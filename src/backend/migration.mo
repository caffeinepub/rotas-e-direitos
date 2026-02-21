import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldActor = {
    subscriptions : Map.Map<Principal.Principal, { currentPlan : { #free_24h; #pro_monthly; #pro_annual }; startTime : ?Int; endTime : ?Int }>;
    userAccess : Map.Map<Principal.Principal, { isBlockedByAdmin : Bool }>;
  };

  type NewActor = {
    subscriptions : Map.Map<Principal.Principal, { currentPlan : { #free_24h; #pro_monthly; #pro_annual }; startTime : ?Int; endTime : ?Int }>;
  };

  public func run(old : OldActor) : NewActor {
    { subscriptions = old.subscriptions };
  };
};
