import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";

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

  module Evidence {
    public func compare(e1 : Evidence, e2 : Evidence) : Order.Order {
      Nat.compare(e1.id, e2.id);
    };
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
    accessToken : Text;
    publicKey : Text;
    enabled : Bool;
  };

  public type PaymentConfig = {
    mercadoPago : PaymentProviderConfig;
  };

  public type PublicPaymentProviderConfig = {
    publicKey : Text;
    enabled : Bool;
  };

  public type PublicPaymentConfig = {
    mercadoPago : PublicPaymentProviderConfig;
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Persistent state
  var collectiveReports = List.empty<CollectiveReport>();
  var nextEvidenceId : Nat = 3501;
  var nextSessionId : Nat = 1;
  var nextAppealId : Nat = 1;

  let evidenceEntries = Map.empty<Nat, Evidence>();
  let lossProfiles = Map.empty<Principal.Principal, LossProfile>();
  let workSessions = Map.empty<Nat, WorkSession>();
  let appeals = Map.empty<Nat, Appeal>();
  let userProfiles = Map.empty<Principal.Principal, UserProfile>();
  let subscriptions = Map.empty<Principal.Principal, SubscriptionStatus>();
  let userAccess = Map.empty<Principal.Principal, UserAccessInternalInfo>();
  let pendingPayments = Map.empty<Text, { user : Principal.Principal; plan : SubscriptionPlan; timestamp : Int }>();

  var paymentConfig : PaymentConfig = {
    mercadoPago = { accessToken = ""; publicKey = ""; enabled = false };
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

  func validatePaymentConfig(config : PaymentConfig) : () {
    if (config.mercadoPago.enabled) {
      if (config.mercadoPago.accessToken == "" or config.mercadoPago.publicKey == "") {
        Runtime.trap("All fields except accessToken and publicKey must be present when enabled is true");
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

  public query ({ caller }) func getPublicPaymentConfig() : async PublicPaymentConfig {
    {
      mercadoPago = {
        publicKey = paymentConfig.mercadoPago.publicKey;
        enabled = paymentConfig.mercadoPago.enabled;
      };
    };
  };

  func getLocalizedPlanDetails(plan : SubscriptionPlan) : (Text, Float, Text) {
    switch (plan) {
      case (#free_24h) { ("Day Pass", 0, "USD") };
      case (#pro_monthly) { ("Monthly Membership", 48, "BRL") };
      case (#pro_annual) { ("Annual Membership", 498, "BRL") };
    };
  };

  public shared ({ caller }) func createMercadoPagoCheckout(plan : SubscriptionPlan) : async PaymentCheckoutResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create payment preferences");
    };
    if (not paymentConfig.mercadoPago.enabled) {
      Runtime.trap("Payment provider not enabled");
    };
    if (paymentConfig.mercadoPago.accessToken == "") {
      Runtime.trap("Missing backend configuration. Cannot process payment");
    };

    let (title, amount, currency) = getLocalizedPlanDetails(plan);
    if (amount == 0.0) {
      { checkoutUrl = null; paymentId = "free" };
    } else {
      let externalReference = caller.toText() # "-" # Time.now().toText();

      pendingPayments.add(externalReference, { user = caller; plan = plan; timestamp = Time.now() });

      let authorizationHeader = {
        name = "Authorization";
        value = "Bearer " # paymentConfig.mercadoPago.accessToken;
      };

      let checkoutBody = "{" #
      "\"items\":[{\"title\":\"" # title # "\",\"quantity\":1,\"unit_price\":" # amount.toText() #
      "}],\"external_reference\":\"" # externalReference #
      ("\",\"currency_id\":\"" # currency # "\"}");

      try {
        let response = await OutCall.httpPostRequest(
          "https://api.mercadopago.com/checkout/preferences",
          [authorizationHeader],
          checkoutBody,
          transform,
        );
        {
          checkoutUrl = ?response;
          paymentId = externalReference;
        };
      } catch (_) {
        Runtime.trap("Failed to create Mercado Pago checkout, internal error");
      };
    };
  };

  public shared ({ caller }) func createPaymentPreference(plan : SubscriptionPlan) : async PaymentCheckoutResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create payment preferences");
    };
    if (not paymentConfig.mercadoPago.enabled) {
      Runtime.trap("Payment provider not enabled");
    };
    let (title, amount, _) = getLocalizedPlanDetails(plan);
    if (amount == 0.0) {
      { checkoutUrl = null; paymentId = "free" };
    } else {
      await createMercadoPagoCheckout(plan);
    };
  };

  public shared ({ caller }) func checkPaymentStatus(paymentId : Text) : async PaymentStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check payment status");
    };

    if (paymentId == "" or paymentId == "free") {
      { paymentId; status = "free"; rawResponse = "null" };
    } else {
      let isAdmin = AccessControl.isAdmin(accessControlState, caller);
      if (not isAdmin) {
        switch (pendingPayments.get(paymentId)) {
          case (?payment) {
            if (payment.user != caller) {
              Runtime.trap("Unauthorized: Can only check your own payment status");
            };
          };
          case (null) {
            Runtime.trap("Payment not found or unauthorized");
          };
        };
      };

      if (paymentConfig.mercadoPago.accessToken == "") {
        Runtime.trap("Missing backend configuration. Cannot process payment check.");
      };

      let authorizationHeader = {
        name = "Authorization";
        value = "Bearer " # paymentConfig.mercadoPago.accessToken;
      };

      try {
        let response = await OutCall.httpGetRequest(
          "https://api.mercadopago.com/v1/payments/search?external_reference=" # paymentId,
          [authorizationHeader],
          transform,
        );
        { paymentId; status = response; rawResponse = response };
      } catch (_) {
        Runtime.trap("Failed to check Mercado Pago payment status, internal error");
      };
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

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public query ({ caller }) func getAllEvidence() : async [Evidence] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view evidence");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = evidenceEntries.values().filter(
      func(e : Evidence) : Bool {
        isAdmin or e.owner == caller;
      }
    );
    filtered.toArray().sort();
  };
};
