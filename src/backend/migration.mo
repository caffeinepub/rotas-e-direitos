import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";

module {
  type EvidenceType = { #selfie; #screenshot; #audio; #video };
  type Platform = {
    #ifood;
    #uber;
    #rappi;
    #ninetyNine;
  };

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

  type Evidence = {
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

  type WeatherSample = {
    timestamp : Time.Time;
    condition : WeatherCondition;
    temperatureC : Float;
    city : Text;
  };

  type WorkSession = {
    id : Nat;
    owner : Principal.Principal;
    startTime : Time.Time;
    endTime : ?Time.Time;
    city : Text;
    weatherSamples : [WeatherSample];
  };

  type LossProfile = {
    dailyEarnings : Float;
    daysPerWeek : Nat;
    deactivationDate : Int;
    platform : Platform;
  };

  type Region = {
    #fortaleza;
    #caucaia;
    #maracanau;
  };

  type CollectiveReport = {
    platform : Platform;
    region : Region;
    neighborhood : Text;
    reason : ReasonCategory;
    timestamp : Time.Time;
  };

  type UserProfile = {
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

  type PublicLossProfile = {
    dailyEarnings : Float;
    daysPerWeek : Nat;
    deactivationDate : Int;
    platform : Platform;
  };

  type SubscriptionPlan = {
    #free_24h;
    #pro_monthly;
    #pro_annual;
  };

  type SubscriptionStatus = {
    currentPlan : SubscriptionPlan;
    startTime : ?Int;
    endTime : ?Int;
  };

  type UserAccessInfo = {
    principal : Principal.Principal;
    profile : ?UserProfile;
    subscriptionStatus : SubscriptionStatus;
    isBlockedByAdmin : Bool;
  };

  type UserAccessInternalInfo = {
    isBlockedByAdmin : Bool;
  };

  type PaymentProviderConfig = {
    enabled : Bool;
  };

  // Old PaymentConfig without PagBankConfig
  type OldPaymentConfig = {
    gatewayProvider : PaymentProviderConfig;
  };

  // New PagBankConfig type
  type PagBankConfig = {
    enabled : Bool;
    clientId : ?Text;
    clientSecret : ?Text;
    merchantId : ?Text;
    webhookSecret : ?Text;
  };

  // New PaymentConfig with PagBankConfig
  type NewPaymentConfig = {
    gatewayProvider : PaymentProviderConfig;
    pagbankProvider : PagBankConfig;
  };

  type PaymentCheckoutResponse = {
    checkoutUrl : ?Text;
    paymentId : Text;
  };

  type PaymentStatus = {
    paymentId : Text;
    status : Text;
    rawResponse : Text;
  };

  type TestimonialStatus = { #pending; #approved; #rejected };

  type Testimonial = {
    id : Nat;
    submitter : Principal.Principal;
    content : Text;
    timestamp : Int;
    status : TestimonialStatus;
  };

  // Old actor type (without PagBank)
  type OldActor = {
    collectiveReports : List.List<CollectiveReport>;
    nextEvidenceId : Nat;
    nextSessionId : Nat;
    nextAppealId : Nat;
    nextTestimonialId : Nat;
    evidenceEntries : Map.Map<Nat, Evidence>;
    lossProfiles : Map.Map<Principal.Principal, LossProfile>;
    workSessions : Map.Map<Nat, WorkSession>;
    appeals : Map.Map<Nat, Appeal>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    subscriptions : Map.Map<Principal.Principal, SubscriptionStatus>;
    userAccess : Map.Map<Principal.Principal, UserAccessInternalInfo>;
    pendingPayments : Map.Map<Text, { user : Principal.Principal; plan : SubscriptionPlan; timestamp : Int }>;
    testimonials : Map.Map<Nat, Testimonial>;
    paymentConfig : OldPaymentConfig;
  };

  // New actor type (with PagBank)
  type NewActor = {
    collectiveReports : List.List<CollectiveReport>;
    nextEvidenceId : Nat;
    nextSessionId : Nat;
    nextAppealId : Nat;
    nextTestimonialId : Nat;
    evidenceEntries : Map.Map<Nat, Evidence>;
    lossProfiles : Map.Map<Principal.Principal, LossProfile>;
    workSessions : Map.Map<Nat, WorkSession>;
    appeals : Map.Map<Nat, Appeal>;
    userProfiles : Map.Map<Principal.Principal, UserProfile>;
    subscriptions : Map.Map<Principal.Principal, SubscriptionStatus>;
    userAccess : Map.Map<Principal.Principal, UserAccessInternalInfo>;
    pendingPayments : Map.Map<Text, { user : Principal.Principal; plan : SubscriptionPlan; timestamp : Int }>;
    testimonials : Map.Map<Nat, Testimonial>;
    paymentConfig : NewPaymentConfig;
  };

  public func run(old : OldActor) : NewActor {
    let defaultPagBankConfig = {
      enabled = false;
      clientId = null;
      clientSecret = null;
      merchantId = null;
      webhookSecret = null;
    };

    let newPaymentConfig = {
      old.paymentConfig with
      pagbankProvider = defaultPagBankConfig
    };

    { old with paymentConfig = newPaymentConfig };
  };
};
