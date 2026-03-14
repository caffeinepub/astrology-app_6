import OrderedMap "mo:base/OrderedMap";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";

module {
  type OldUserProfile = {
    name : Text;
    birthDate : Text;
    birthTime : Text;
    birthPlace : Text;
    languagePreference : Text;
    isPremium : Bool;
    coinBalance : Nat;
    registrationTime : Time.Time;
    freeTrialEnd : Time.Time;
  };

  type OldKundali = {
    userId : Principal;
    birthDetails : {
      date : Text;
      time : Text;
      place : Text;
    };
    planetaryPositions : Text;
    houses : Text;
    generatedAt : Time.Time;
  };

  type OldPanchang = {
    date : Text;
    tithi : Text;
    nakshatra : Text;
    yoga : Text;
    karana : Text;
    sunrise : Text;
    sunset : Text;
    festivals : [Text];
  };

  type OldActor = {
    userProfiles : OrderedMap.Map<Principal, OldUserProfile>;
    kundalis : OrderedMap.Map<Principal, OldKundali>;
    panchangData : OrderedMap.Map<Text, OldPanchang>;
    stripeConfig : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  type NewUserProfile = {
    name : Text;
    birthDate : Text;
    birthTime : Text;
    birthPlace : Text;
    languagePreference : Text;
    isPremium : Bool;
    coinBalance : Nat;
    registrationTime : Time.Time;
    freeTrialEnd : Time.Time;
  };

  type NewKundali = {
    userId : Principal;
    birthDetails : {
      date : Text;
      time : Text;
      place : Text;
    };
    planetaryPositions : Text;
    houses : Text;
    generatedAt : Time.Time;
  };

  type NewPanchang = {
    date : Text;
    tithi : Text;
    nakshatra : Text;
    yoga : Text;
    karana : Text;
    sunrise : Text;
    sunset : Text;
    festivals : [Text];
  };

  type ChatSession = {
    userId : Principal;
    startTime : Time.Time;
    endTime : ?Time.Time;
    totalMinutes : Nat;
    totalCost : Nat;
    isActive : Bool;
  };

  type NewActor = {
    userProfiles : OrderedMap.Map<Principal, NewUserProfile>;
    kundalis : OrderedMap.Map<Principal, NewKundali>;
    panchangData : OrderedMap.Map<Text, NewPanchang>;
    stripeConfig : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
    chatSessions : OrderedMap.Map<Principal, ChatSession>;
  };

  public func run(old : OldActor) : NewActor {
    let principalMap = OrderedMap.Make<Principal>(Principal.compare);
    {
      userProfiles = old.userProfiles;
      kundalis = old.kundalis;
      panchangData = old.panchangData;
      stripeConfig = old.stripeConfig;
      chatSessions = principalMap.empty<ChatSession>();
    };
  };
};

