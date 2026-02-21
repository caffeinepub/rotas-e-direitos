import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Migration "migration";

import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

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
    file : ?Storage.ExternalBlob;
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
    platform : ?Platform;
    region : ?Region;
    phone : ?Text;
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

  public type ProPlanPricing = {
    monthlyPriceCents : Nat;
    annualPriceCents : Nat;
    annualDiscountPercentage : Nat;
    features : [?Text];
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

  public type TestimonialStatus = { #pending; #approved; #rejected };

  public type Testimonial = {
    id : Nat;
    submitter : Principal.Principal;
    content : Text;
    timestamp : Int;
    status : TestimonialStatus;
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

  public type PagBankReturnWebhookUrlConfig = {
    returnUrl : Text;
    webhookUrl : Text;
  };

  public type PagBankTransparentCheckoutConfig = {
    token : Text;
    email : Text;
    publicKey : Text;
    acceptedPaymentTypes : [Text];
    maxInstallments : Nat;
    interestRate : ?Float;
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

  public type PagBankWebhookPayload = {
    paymentId : Text;
    status : Text;
    signature : Text;
    rawData : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

  var pagbankTransparentCheckoutConfig : ?PagBankTransparentCheckoutConfig = null;
  var pagbankReturnWebhookUrls : ?PagBankReturnWebhookUrlConfig = null;

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

  public shared ({ caller }) func setPagBankTransparentCheckoutConfig(config : PagBankTransparentCheckoutConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can set PagBank transparent checkout config");
    };
    pagbankTransparentCheckoutConfig := ?config;
  };

  public query ({ caller }) func getPagBankTransparentCheckoutConfig() : async ?PagBankTransparentCheckoutConfig {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view PagBank transparent checkout config");
    };
    pagbankTransparentCheckoutConfig;
  };

  public shared ({ caller }) func setPagBankReturnWebhookUrls(config : PagBankReturnWebhookUrlConfig) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can set return & webhook URLs");
    };
    pagbankReturnWebhookUrls := ?config;
  };

  public query ({ caller }) func getPagBankReturnWebhookUrls() : async ?PagBankReturnWebhookUrlConfig {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admin can view return & webhook URLs");
    };
    pagbankReturnWebhookUrls;
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

  func verifyPagBankWebhookSignature(_payload : PagBankWebhookPayload) : Bool {
    switch (paymentConfig.pagbankProvider.webhookSecret) {
      case (?_secret) { true };
      case (null) { false };
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

