import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Array "mo:core/Array";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
actor {
  type EvidenceType = { #selfie; #screenshot; #audio; #video };
  type Platform = { #ifood; #uber; #rappi; #ninetyNine };
  type ReasonCategory = {
    #documentsExpired;
    #selfieInvalid;
    #lowRating;
    #dangerousConduct;
    #fraudSuspicion;
    #multipleAccounts;
    #other;
  };

  type WeatherCondition = {
    #clear;
    #cloudy;
    #rainy;
    #windy;
    #soleado;
    #nublado;
    #tempestuoso;
  };

  public type Evidence = {
    id : Nat;
    owner : Principal.Principal;
    uploadTime : Int;
    evidenceType : EvidenceType;
    notes : Text;
    platform : ?Platform;
    regiao : ?Region;
    bairro : ?Text;
    duration : ?Nat;
    audioQuality : ?Text;
    videoQuality : ?Text;
  };

  public type WeatherSample = {
    timestamp : Time.Time;
    condition : WeatherCondition;
    temperatureC : Float;
    city : Text;
  };

  public type WorkSession = {
    id : Nat;
    owner : Principal.Principal;
    startTime : Time.Time;
    endTime : ?Time.Time;
    city : Text;
    weatherSamples : [WeatherSample];
  };

  public type LossProfile = {
    dailyEarnings : Float;
    daysPerWeek : Nat;
    deactivationDate : Int;
    platform : Platform;
  };

  public type Region = {
    #fortaleza;
    #caucaia;
    #maracanau;
  };

  public type CollectiveReport = {
    platform : Platform;
    region : Region;
    neighborhood : Text;
    reason : ReasonCategory;
    timestamp : Time.Time;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
  };

  type Appeal = {
    id : Nat;
    owner : Principal.Principal;
    platform : Platform;
    reasonCategory : ReasonCategory;
    userExplanation : Text;
    evidenceIds : [Nat];
    generatedText : Text;
    createdTime : Int;
  };

  public type PublicLossProfile = {
    dailyEarnings : Float;
    daysPerWeek : Nat;
    deactivationDate : Int;
    platform : Platform;
  };

  public type SubscriptionPlan = {
    #free_24h;
    #pro_monthly;
    #pro_annual;
  };

  public type SubscriptionStatus = {
    currentPlan : SubscriptionPlan;
    startTime : ?Int;
    endTime : ?Int;
  };

  public type UserAccessInfo = {
    principal : Principal.Principal;
    profile : ?UserProfile;
    subscriptionStatus : SubscriptionStatus;
    isBlockedByAdmin : Bool;
  };

  type UserAccessInternalInfo = {
    isBlockedByAdmin : Bool;
  };

  public type PaymentProviderConfig = {
    enabled : Bool;
  };

  public type PagBankConfig = {
    enabled : Bool;
    clientId : ?Text;
    clientSecret : ?Text;
    merchantId : ?Text;
    webhookSecret : ?Text;
  };

  public type PaymentConfig = {
    gatewayProvider : PaymentProviderConfig;
    pagbankProvider : PagBankConfig;
  };

  public type PublicPaymentProviderConfig = {
    enabled : Bool;
  };

  public type PublicPaymentConfig = {
    gatewayProvider : PublicPaymentProviderConfig;
    pagbankProvider : PublicPagBankConfig;
  };

  public type PublicPagBankConfig = {
    enabled : Bool;
  };

  public type PaymentCheckoutResponse = {
    checkoutUrl : ?Text;
    paymentId : Text;
  };

  public type PaymentStatus = {
    paymentId : Text;
    status : Text;
    rawResponse : Text;
  };

  public type TestimonialStatus = { #pending; #approved; #rejected };

  public type Testimonial = {
    id : Nat;
    submitter : Principal.Principal;
    content : Text;
    timestamp : Int;
    status : TestimonialStatus;
  };

  public type PagBankWebhookPayload = {
    paymentId : Text;
    status : Text;
    signature : Text;
    rawData : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var collectiveReports = List.empty<CollectiveReport>();
  var nextEvidenceId : Nat = 3501;
  var nextSessionId : Nat = 1;
  var nextAppealId : Nat = 1;
  var nextTestimonialId : Nat = 1;

  let evidenceEntries = Map.empty<Nat, Evidence>();
  let lossProfiles = Map.empty<Principal.Principal, LossProfile>();
  let workSessions = Map.empty<Nat, WorkSession>();
  let appeals = Map.empty<Nat, Appeal>();
  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let subscriptions = Map.empty<Principal.Principal, SubscriptionStatus>();
  let userAccess = Map.empty<Principal.Principal, UserAccessInternalInfo>();
  let pendingPayments = Map.empty<Text, { user : Principal.Principal; plan : SubscriptionPlan; timestamp : Int }>();
  let testimonials = Map.empty<Nat, Testimonial>();

  var paymentConfig : PaymentConfig = {
    gatewayProvider = { enabled = false };
    pagbankProvider = {
      enabled = false;
      clientId = null;
      clientSecret = null;
      merchantId = null;
      webhookSecret = null;
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal.Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserAccessInfo() : async [UserAccessInfo] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can query all users");
    };

    let allUserPrincipals = userProfiles.keys();
    let resultList = List.empty<UserAccessInfo>();

    for (principal in allUserPrincipals) {
      let profile = userProfiles.get(principal);
      let subscriptionStatus = switch (subscriptions.get(principal)) {
        case (?status) { status };
        case (null) {
          {
            currentPlan = #free_24h;
            startTime = null;
            endTime = null;
          };
        };
      };
      let userAccessStatus = userAccess.get(principal);

      let info : UserAccessInfo = {
        principal;
        profile;
        subscriptionStatus;
        isBlockedByAdmin = switch (userAccessStatus) {
          case (null) { false };
          case (?status) { status.isBlockedByAdmin };
        };
      };
      resultList.add(info);
    };

    resultList.toArray();
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  func validatePaymentConfig(config : PaymentConfig) : () {
    if (config.gatewayProvider.enabled) {
      Runtime.trap("Unexpected gateway configuration: All fields except accessToken and publicKey must be present when enabled is true");
    };

    if (config.pagbankProvider.enabled) {
      switch (config.pagbankProvider.clientId, config.pagbankProvider.clientSecret, config.pagbankProvider.merchantId, config.pagbankProvider.webhookSecret) {
        case (null, _, _, _) {
          Runtime.trap("PagBank clientId is required when PagBank is enabled");
        };
        case (_, null, _, _) {
          Runtime.trap("PagBank clientSecret is required when PagBank is enabled");
        };
        case (_, _, null, _) {
          Runtime.trap("PagBank merchantId is required when PagBank is enabled");
        };
        case (_, _, _, null) {
          Runtime.trap("PagBank webhookSecret is required when PagBank is enabled");
        };
        case (?_, ?_, ?_, ?_) {};
      };
    };
  };

  public shared ({ caller }) func setPaymentConfig(config : PaymentConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can set payment configuration");
    };
    validatePaymentConfig(config);
    paymentConfig := config;
  };

  public query func getPublicPaymentConfig() : async PublicPaymentConfig {
    {
      gatewayProvider = {
        enabled = paymentConfig.gatewayProvider.enabled;
      };
      pagbankProvider = {
        enabled = paymentConfig.pagbankProvider.enabled;
      };
    };
  };

  public query ({ caller }) func getSubscriptionStatus() : async SubscriptionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view subscription status");
    };
    let defaultStatus : SubscriptionStatus = { currentPlan = #free_24h; startTime = null; endTime = null };
    switch (subscriptions.get(caller)) {
      case (?status) { status };
      case (null) { defaultStatus };
    };
  };

  public shared ({ caller }) func createPaymentSession(_plan : SubscriptionPlan) : async PaymentCheckoutResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create payment sessions");
    };

    if (not paymentConfig.gatewayProvider.enabled) {
      Runtime.trap("Payment provider not enabled");
    };

    let checkoutResponse : PaymentCheckoutResponse = {
      checkoutUrl = null;
      paymentId = "dummy-payment-id";
    };

    pendingPayments.add(
      checkoutResponse.paymentId,
      {
        user = caller;
        plan = _plan;
        timestamp = Time.now();
      },
    );

    checkoutResponse;
  };

  public shared ({ caller }) func createPagBankPaymentSession(_plan : SubscriptionPlan) : async PaymentCheckoutResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create PagBank payment sessions");
    };

    if (not paymentConfig.pagbankProvider.enabled) {
      Runtime.trap("PagBank payment provider not enabled");
    };

    let checkoutResponse : PaymentCheckoutResponse = {
      checkoutUrl = null;
      paymentId = "pagbank-dummy-payment-id";
    };

    pendingPayments.add(
      checkoutResponse.paymentId,
      {
        user = caller;
        plan = _plan;
        timestamp = Time.now();
      },
    );

    checkoutResponse;
  };

  public shared ({ caller }) func checkPaymentStatus(paymentId : Text) : async PaymentStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check payment status");
    };

    switch (pendingPayments.get(paymentId)) {
      case (?payment) {
        if (payment.user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only check status of your own payments");
        };
      };
      case (null) {
        Runtime.trap("Payment not found");
      };
    };

    let paymentStatus : PaymentStatus = {
      paymentId;
      status = "pending";
      rawResponse = "{}";
    };

    paymentStatus;
  };

  func verifyPagBankWebhookSignature(payload : PagBankWebhookPayload) : Bool {
    switch (paymentConfig.pagbankProvider.webhookSecret) {
      case (?secret) {
        payload.signature.size() > 0;
      };
      case (null) {
        false;
      };
    };
  };

  func activateSubscription(user : Principal.Principal, plan : SubscriptionPlan) : () {
    let now = Time.now();
    let endTime = switch (plan) {
      case (#free_24h) { ?(now + 86_400_000_000_000) };
      case (#pro_monthly) { ?(now + 2_592_000_000_000_000) };
      case (#pro_annual) { ?(now + 31_536_000_000_000_000) };
    };

    let newStatus : SubscriptionStatus = {
      currentPlan = plan;
      startTime = ?now;
      endTime;
    };

    subscriptions.add(user, newStatus);
  };

  public shared func handlePagBankWebhook(payload : PagBankWebhookPayload) : async () {
    if (not verifyPagBankWebhookSignature(payload)) {
      Runtime.trap("Unauthorized: Invalid webhook signature");
    };

    switch (pendingPayments.get(payload.paymentId)) {
      case (?payment) {
        switch (payload.status) {
          case ("approved") {
            activateSubscription(payment.user, payment.plan);
            pendingPayments.remove(payload.paymentId);
          };
          case ("rejected") {
            pendingPayments.remove(payload.paymentId);
          };
          case ("cancelled") {
            pendingPayments.remove(payload.paymentId);
          };
          case (_) {};
        };
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func logWorkSession(params : { city : Text }) : async WorkSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log work sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;
    let startTime = Time.now();

    let newSession : WorkSession = {
      id = sessionId;
      owner = caller;
      startTime;
      endTime = null;
      city = params.city;
      weatherSamples = [];
    };

    workSessions.add(sessionId, newSession);
    newSession;
  };

  public shared ({ caller }) func setLossProfile(profile : LossProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can set loss profiles");
    };

    lossProfiles.add(caller, profile);
  };

  public shared ({ caller }) func submitTestimonial(content : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit testimonials");
    };

    let testimonialId = nextTestimonialId;
    nextTestimonialId += 1;

    let newTestimonial : Testimonial = {
      id = testimonialId;
      submitter = caller;
      content;
      timestamp = Time.now();
      status = #pending;
    };

    testimonials.add(testimonialId, newTestimonial);
    testimonialId;
  };

  public query func getApprovedTestimonials() : async [Testimonial] {
    testimonials.values().filter(
      func(t) { t.status == #approved }
    ).toArray();
  };

  public query ({ caller }) func getPendingTestimonials() : async [Testimonial] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view pending testimonials");
    };
    testimonials.values().filter(
      func(t) { t.status == #pending }
    ).toArray();
  };

  public shared ({ caller }) func updateTestimonialStatus(testimonialId : Nat, newStatus : TestimonialStatus) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can update testimonial status");
    };

    switch (testimonials.get(testimonialId)) {
      case (?testimonial) {
        let updatedTestimonial = { testimonial with status = newStatus };
        testimonials.add(testimonialId, updatedTestimonial);
      };
      case (null) {
        Runtime.trap("Testimonial not found");
      };
    };
  };
};
