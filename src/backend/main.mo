import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  type EvidenceType = { #selfie; #screenshot };
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
    owner : Principal;
    uploadTime : Int;
    evidenceType : EvidenceType;
    notes : Text;
    platform : ?Platform;
    regiao : ?Region;
    bairro : ?Text;
  };

  public type WeatherSample = {
    timestamp : Time.Time;
    condition : WeatherCondition;
    temperatureC : Float;
    city : Text;
  };

  public type WorkSession = {
    id : Nat;
    owner : Principal;
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
    owner : Principal;
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

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var collectiveReports = List.empty<CollectiveReport>();
  var nextEvidenceId : Nat = 3501;
  var nextSessionId : Nat = 1;
  var nextAppealId : Nat = 1;

  let evidenceEntries = Map.empty<Nat, Evidence>();
  let lossProfiles = Map.empty<Principal, LossProfile>();
  let workSessions = Map.empty<Nat, WorkSession>();
  let appeals = Map.empty<Nat, Appeal>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let subscriptions = Map.empty<Principal, SubscriptionStatus>();
  let userAccess = Map.empty<Principal, UserAccessInternalInfo>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserAccessInfo() : async [UserAccessInfo] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only admin can query all users");
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
    let defaultStatus : SubscriptionStatus = { currentPlan = #free_24h; startTime = null; endTime = null };
    switch (subscriptions.get(caller)) {
      case (?status) { status };
      case (null) { defaultStatus };
    };
  };

  public shared ({ caller }) func upgradeSubscription(newPlan : SubscriptionPlan) : async () {
    let now = Time.now();
    let status : SubscriptionStatus = {
      currentPlan = newPlan;
      startTime = ?now;
      endTime = switch (newPlan) {
        case (#free_24h) { ?(now + 24 * 60 * 60 * 1000000000) };
        case (#pro_monthly) { ?(now + 30 * 24 * 60 * 60 * 1000000000) };
        case (#pro_annual) { ?(now + 365 * 24 * 60 * 60 * 1000000000) };
      };
    };
    subscriptions.add(caller, status);
  };

  public shared ({ caller }) func createEvidence(params : { evidenceType : EvidenceType; notes : Text; platform : ?Platform; regiao : ?Region; bairro : ?Text }) : async Evidence {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create evidence");
    };
    checkFeatureAccess(caller);

    let evidenceId = nextEvidenceId;
    nextEvidenceId += 1;
    let uploadTime = Time.now();

    let newEvidence : Evidence = {
      id = evidenceId;
      owner = caller;
      uploadTime;
      evidenceType = params.evidenceType;
      notes = params.notes;
      platform = params.platform;
      regiao = params.regiao;
      bairro = params.bairro;
    };

    evidenceEntries.add(evidenceId, newEvidence);
    newEvidence;
  };

  public query ({ caller }) func getEvidenceById(evidenceId : Nat) : async ?Evidence {
    switch (evidenceEntries.get(evidenceId)) {
      case (null) { null };
      case (?evidence) {
        if (evidence.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?evidence;
        } else {
          Runtime.trap("Unauthorized: Can only view your own evidence");
        };
      };
    };
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

  public query ({ caller }) func getEvidenceFiltered(typeFilter : ?EvidenceType, platformFilter : ?Platform) : async [Evidence] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view evidence");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = evidenceEntries.values().filter(
      func(e : Evidence) : Bool {
        let ownerMatch = isAdmin or e.owner == caller;
        let typeMatch = switch (typeFilter) {
          case (null) { true };
          case (?t) { e.evidenceType == t };
        };
        let platformMatch = switch (platformFilter) {
          case (null) { true };
          case (?p) { e.platform == ?p };
        };
        ownerMatch and typeMatch and platformMatch;
      }
    );
    filtered.toArray().sort();
  };

  public query ({ caller }) func getTimeline(params : {
    startTime : ?Int;
    endTime : ?Int;
    typeFilter : ?EvidenceType;
    platformFilter : ?Platform;
  }) : async [Evidence] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view timeline");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let filtered = evidenceEntries.values().filter(
      func(evidenceEntry : Evidence) : Bool {
        let ownerMatch = isAdmin or evidenceEntry.owner == caller;

        let inTimeRange = switch (params.startTime, params.endTime) {
          case (null, null) { true };
          case (?start, null) { evidenceEntry.uploadTime >= start };
          case (null, ?end) { evidenceEntry.uploadTime <= end };
          case (?start, ?end) { evidenceEntry.uploadTime >= start and evidenceEntry.uploadTime <= end };
        };

        let typeMatches = switch (params.typeFilter) {
          case (null) { true };
          case (?t) { t == evidenceEntry.evidenceType };
        };

        let platformMatches = switch (params.platformFilter) {
          case (null) { true };
          case (?p) { evidenceEntry.platform == ?p };
        };

        ownerMatch and inTimeRange and typeMatches and platformMatches;
      }
    );
    filtered.toArray().sort();
  };

  public shared ({ caller }) func logWorkSession(params : { city : Text }) : async WorkSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can log work sessions");
    };
    checkFeatureAccess(caller);

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

  public shared ({ caller }) func endWorkSession(sessionId : Nat) : async WorkSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can end work sessions");
    };
    checkFeatureAccess(caller);

    switch (workSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only end your own work sessions");
        };

        let updatedSession : WorkSession = {
          id = session.id;
          owner = session.owner;
          startTime = session.startTime;
          endTime = ?Time.now();
          city = session.city;
          weatherSamples = session.weatherSamples;
        };
        workSessions.add(sessionId, updatedSession);
        updatedSession;
      };
    };
  };

  public shared ({ caller }) func addWeatherSample(sessionId : Nat, params : { condition : WeatherCondition; temperatureC : Float }) : async WorkSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add weather samples");
    };
    checkFeatureAccess(caller);

    switch (workSessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        if (session.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only add weather samples to your own sessions");
        };

        let newSample : WeatherSample = {
          timestamp = Time.now();
          condition = params.condition;
          temperatureC = params.temperatureC;
          city = session.city;
        };

        let updatedSamples = session.weatherSamples.concat([newSample]);
        let updatedSession : WorkSession = {
          id = session.id;
          owner = session.owner;
          startTime = session.startTime;
          endTime = session.endTime;
          city = session.city;
          weatherSamples = updatedSamples;
        };
        workSessions.add(sessionId, updatedSession);
        updatedSession;
      };
    };
  };

  public query ({ caller }) func getWorkSession(sessionId : Nat) : async ?WorkSession {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view work sessions");
    };

    switch (workSessions.get(sessionId)) {
      case (null) { null };
      case (?session) {
        if (session.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?session;
        } else {
          Runtime.trap("Unauthorized: Can only view your own work sessions");
        };
      };
    };
  };

  public shared ({ caller }) func setLossProfile(profile : LossProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can set loss profiles");
    };
    checkFeatureAccess(caller);

    lossProfiles.add(caller, profile);
  };

  public query ({ caller }) func getLossProfile(user : Principal) : async ?PublicLossProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view loss profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own loss profile");
    };

    switch (lossProfiles.get(user)) {
      case (null) { null };
      case (?profile) {
        ?{
          dailyEarnings = profile.dailyEarnings;
          daysPerWeek = profile.daysPerWeek;
          deactivationDate = profile.deactivationDate;
          platform = profile.platform;
        };
      };
    };
  };

  public query ({ caller }) func getCallerLossProfile() : async ?PublicLossProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view loss profiles");
    };

    switch (lossProfiles.get(caller)) {
      case (null) { null };
      case (?profile) {
        ?{
          dailyEarnings = profile.dailyEarnings;
          daysPerWeek = profile.daysPerWeek;
          deactivationDate = profile.deactivationDate;
          platform = profile.platform;
        };
      };
    };
  };

  public shared ({ caller }) func generateAppeal(params : {
    platform : Platform;
    reasonCategory : ReasonCategory;
    userExplanation : Text;
    evidenceIds : [Nat];
  }) : async Appeal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can generate appeals");
    };
    checkFeatureAccess(caller);

    for (evidenceId in params.evidenceIds.vals()) {
      switch (evidenceEntries.get(evidenceId)) {
        case (null) { Runtime.trap("Evidence not found: " # evidenceId.toText()) };
        case (?evidence) {
          if (evidence.owner != caller) {
            Runtime.trap("Unauthorized: Can only use your own evidence in appeals");
          };
        };
      };
    };

    let appealId = nextAppealId;
    nextAppealId += 1;

    var templateBody : Text = "";
    switch (params.platform) {
      case (#ifood) {
        switch (params.reasonCategory) {
          case (#documentsExpired or #selfieInvalid) {
            templateBody := "Após enfrentar dificuldades de acesso devido à desativação por documentos/selfie, solicito reativação da conta. " # params.userExplanation # " Documentos atualizados em anexo.";
          };
          case (#lowRating) {
            templateBody := "Solicito reavaliação devido à desativação por avaliação baixa. " # params.userExplanation # " Após ajustes, melhorias implementadas.";
          };
          case (#dangerousConduct) {
            templateBody := "Friso que a desativação por conduta perigosa não condiz com meu histórico. " # params.userExplanation # " Adoto práticas de segurança.";
          };
          case (#fraudSuspicion or #multipleAccounts) {
            templateBody := "Refuto a desativação por suspeita de fraude/múltiplas contas. " # params.userExplanation # " Não possuo múltiplas contas ou condutas fraudulentas.";
          };
          case (#other) {
            templateBody := "Venho solicitar esclarecimentos detalhados sobre o motivo da desativação: " # params.userExplanation;
          };
        };
      };
      case (#uber) {
        switch (params.reasonCategory) {
          case (#documentsExpired or #selfieInvalid) {
            templateBody := "Venho informar que todos os documentos e selfies já foram providenciados e solicitando revisão do bloqueio. " # params.userExplanation;
          };
          case (#lowRating) {
            templateBody := "Solicito a reconsideração do bloqueio devido ao índice de avaliações. " # params.userExplanation # " Comprometo-me a superar expectativas em atendimento e segurança.";
          };
          case (#dangerousConduct) {
            templateBody := "Reforço total desaprovação a qualquer prática que contrarie a segurança promovida pela plataforma. " # params.userExplanation # " Essa não condiz com minha conduta.";
          };
          case (#fraudSuspicion or #multipleAccounts) {
            templateBody := "Gostaria de esclarecer que não mantenho múltiplas contas desde o início de minhas atividades na plataforma. " # params.userExplanation;
          };
          case (#other) {
            templateBody := "Peço análise criteriosa e compartilhamento detalhado do motivo que ensejou o bloqueio: " # params.userExplanation;
          };
        };
      };
      case (#rappi) {
        templateBody := "No ato de cadastro na plataforma, deixei claro interesse em manter todos os requisitos e boas práticas. " # params.userExplanation # " Solicito revisão da desativação.";
      };
      case (#ninetyNine) {
        templateBody := "Peço análise sobre restrição imposta, reiterando que documentos foram atualizados recentemente e não constam pendências em minha conta. " # params.userExplanation;
      };
    };

    let appeal : Appeal = {
      id = appealId;
      owner = caller;
      platform = params.platform;
      reasonCategory = params.reasonCategory;
      userExplanation = params.userExplanation;
      evidenceIds = params.evidenceIds;
      generatedText = templateBody;
      createdTime = Time.now();
    };

    appeals.add(appealId, appeal);
    appeal;
  };

  public query ({ caller }) func getAppeal(appealId : Nat) : async ?Appeal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view appeals");
    };

    switch (appeals.get(appealId)) {
      case (null) { null };
      case (?appeal) {
        if (appeal.owner == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?appeal;
        } else {
          Runtime.trap("Unauthorized: Can only view your own appeals");
        };
      };
    };
  };

  public query ({ caller }) func getCallerAppeals() : async [Appeal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view appeals");
    };

    let filtered = appeals.values().filter(
      func(a : Appeal) : Bool {
        a.owner == caller;
      }
    );
    filtered.toArray();
  };

  public shared ({ caller }) func submitCollectiveReport(params : {
    platform : Platform;
    region : Region;
    neighborhood : Text;
    reason : ReasonCategory;
  }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit collective reports");
    };
    checkFeatureAccess(caller);

    let report : CollectiveReport = {
      platform = params.platform;
      region = params.region;
      neighborhood = params.neighborhood;
      reason = params.reason;
      timestamp = Time.now();
    };

    collectiveReports.add(report);
  };

  public query ({ caller }) func getCollectiveReports() : async [CollectiveReport] {
    collectiveReports.toArray();
  };

  public query ({ caller }) func getRegionStats(region : Region) : async Nat {
    let filtered = collectiveReports.filter(
      func(r : CollectiveReport) : Bool {
        r.region == region;
      }
    );
    filtered.size();
  };

  public query ({ caller }) func getPlatformStats(platform : Platform) : async Nat {
    let filtered = collectiveReports.filter(
      func(r : CollectiveReport) : Bool {
        r.platform == platform;
      }
    );
    filtered.size();
  };

  public query ({ caller }) func getReasonStats(reason : ReasonCategory) : async Nat {
    let filtered = collectiveReports.filter(
      func(r : CollectiveReport) : Bool {
        r.reason == reason;
      }
    );
    filtered.size();
  };

  public query ({ caller }) func getRevisoMotivadaMessage() : async Text {
    "Prezado entregador, este aplicativo é uma iniciativa colaborativa e gratuita criada para ajudar todos os colegas de trabalho em Fortaleza-CE e cidades próximas. Saiba que a revisão completa e acompanhamentos motivados podem levar tempo, mas você será informado assim que houver qualquer alteração.";
  };

  // Admin block functions
  public shared ({ caller }) func blockUser(target : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only admin can block users");
    };
    userAccess.add(target, { isBlockedByAdmin = true });
  };

  public shared ({ caller }) func unblockUser(target : Principal) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Only admin can unblock users");
    };
    userAccess.add(target, { isBlockedByAdmin = false });
  };

  // Query for users to check own block status
  public query ({ caller }) func isCurrentUserBlocked() : async Bool {
    switch (userAccess.get(caller)) {
      case (?status) { status.isBlockedByAdmin };
      case (null) { false };
    };
  };

  func checkFeatureAccess(caller : Principal) {
    // Check if user is blocked by admin first
    let isBlocked = switch (userAccess.get(caller)) {
      case (?status) { status.isBlockedByAdmin };
      case (null) { false };
    };
    if (isBlocked) {
      Runtime.trap("Your account has been blocked by admin. Access denied.");
    };

    let now = Time.now();
    let status = switch (subscriptions.get(caller)) {
      case (?s) { s };
      case (null) {
        {
          currentPlan = #free_24h;
          startTime = ?now;
          endTime = ?(now + 24 * 60 * 60 * 1000000000);
        };
      };
    };

    switch (status.currentPlan, status.endTime) {
      case (#free_24h, ?end) {
        if (now > end) {
          Runtime.trap("Free trial expired. Please upgrade to access this feature.");
        };
      };
      case (#pro_monthly, ?end) {
        if (now > end) {
          Runtime.trap("Monthly subscription expired. Please renew to access this feature.");
        };
      };
      case (#pro_annual, ?end) {
        if (now > end) {
          Runtime.trap("Annual subscription expired. Please renew to access this feature.");
        };
      };
      case (_, null) { Runtime.trap("Invalid subscription status. Please contact support."); };
    };
  };
};
