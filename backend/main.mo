import AccessControl "authorization/access-control";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Migration "migration";
import Int "mo:base/Int";
import Array "mo:base/Array";

(with migration = Migration.run)
actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
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

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    principalMap.get(userProfiles, caller);
  };

  public query func getUserProfile(user : Principal) : async ?UserProfile {
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  public shared ({ caller }) func updateCoinBalance(amount : Nat) : async () {
    switch (principalMap.get(userProfiles, caller)) {
      case null Debug.trap("User profile not found");
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          birthDate = profile.birthDate;
          birthTime = profile.birthTime;
          birthPlace = profile.birthPlace;
          languagePreference = profile.languagePreference;
          isPremium = profile.isPremium;
          coinBalance = profile.coinBalance + amount;
          registrationTime = profile.registrationTime;
          freeTrialEnd = profile.freeTrialEnd;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func deductCoins(amount : Nat) : async () {
    switch (principalMap.get(userProfiles, caller)) {
      case null Debug.trap("User profile not found");
      case (?profile) {
        if (profile.coinBalance < amount) {
          Debug.trap("Insufficient coins");
        };
        let updatedProfile : UserProfile = {
          name = profile.name;
          birthDate = profile.birthDate;
          birthTime = profile.birthTime;
          birthPlace = profile.birthPlace;
          languagePreference = profile.languagePreference;
          isPremium = profile.isPremium;
          coinBalance = profile.coinBalance - amount;
          registrationTime = profile.registrationTime;
          freeTrialEnd = profile.freeTrialEnd;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
    };
  };

  public type Kundali = {
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

  transient let kundaliMap = OrderedMap.Make<Principal>(Principal.compare);
  var kundalis = kundaliMap.empty<Kundali>();

  public shared ({ caller }) func saveKundali(kundali : Kundali) : async () {
    kundalis := kundaliMap.put(kundalis, caller, kundali);
  };

  public query ({ caller }) func getKundali() : async ?Kundali {
    kundaliMap.get(kundalis, caller);
  };

  public type Panchang = {
    date : Text;
    tithi : Text;
    nakshatra : Text;
    yoga : Text;
    karana : Text;
    sunrise : Text;
    sunset : Text;
    festivals : [Text];
  };

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var panchangData = textMap.empty<Panchang>();

  public shared ({ caller }) func addPanchang(panchang : Panchang) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add Panchang data");
    };
    panchangData := textMap.put(panchangData, panchang.date, panchang);
  };

  public query func getPanchang(date : Text) : async ?Panchang {
    textMap.get(panchangData, date);
  };

  public query func getAllPanchang() : async [Panchang] {
    Iter.toArray(textMap.vals(panchangData));
  };

  var stripeConfig : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfig := ?config;
  };

  private func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func updateSubscriptionStatus(isPremium : Bool) : async () {
    switch (principalMap.get(userProfiles, caller)) {
      case null Debug.trap("User profile not found");
      case (?profile) {
        let updatedProfile : UserProfile = {
          name = profile.name;
          birthDate = profile.birthDate;
          birthTime = profile.birthTime;
          birthPlace = profile.birthPlace;
          languagePreference = profile.languagePreference;
          isPremium;
          coinBalance = profile.coinBalance;
          registrationTime = profile.registrationTime;
          freeTrialEnd = profile.freeTrialEnd;
        };
        userProfiles := principalMap.put(userProfiles, caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func isFreeTrialActive() : async Bool {
    switch (principalMap.get(userProfiles, caller)) {
      case null false;
      case (?profile) {
        let currentTime = Time.now();
        currentTime <= profile.freeTrialEnd;
      };
    };
  };

  public shared ({ caller }) func registerUser(profile : UserProfile) : async () {
    let currentTime = Time.now();
    let oneMonthInNanos : Int = 30 * 24 * 60 * 60 * 1000000000;
    let freeTrialEnd = currentTime + oneMonthInNanos;

    let newProfile : UserProfile = {
      name = profile.name;
      birthDate = profile.birthDate;
      birthTime = profile.birthTime;
      birthPlace = profile.birthPlace;
      languagePreference = profile.languagePreference;
      isPremium = true;
      coinBalance = profile.coinBalance;
      registrationTime = currentTime;
      freeTrialEnd;
    };

    userProfiles := principalMap.put(userProfiles, caller, newProfile);
  };

  public type ChatSession = {
    userId : Principal;
    startTime : Time.Time;
    endTime : ?Time.Time;
    totalMinutes : Nat;
    totalCost : Nat;
    isActive : Bool;
  };

  transient let chatSessionMap = OrderedMap.Make<Principal>(Principal.compare);
  var chatSessions = chatSessionMap.empty<ChatSession>();

  public shared ({ caller }) func startChatSession() : async () {
    let ratePerMinute : Nat = 5;

    switch (principalMap.get(userProfiles, caller)) {
      case null Debug.trap("User profile not found");
      case (?profile) {
        if (profile.coinBalance < ratePerMinute) {
          Debug.trap("Insufficient coins to start chat session");
        };

        let currentTime = Time.now();
        let newSession : ChatSession = {
          userId = caller;
          startTime = currentTime;
          endTime = null;
          totalMinutes = 0;
          totalCost = 0;
          isActive = true;
        };

        chatSessions := chatSessionMap.put(chatSessions, caller, newSession);
      };
    };
  };

  public shared ({ caller }) func endChatSession() : async () {
    let ratePerMinute : Nat = 5;

    switch (chatSessionMap.get(chatSessions, caller)) {
      case null Debug.trap("No active chat session found");
      case (?session) {
        if (not session.isActive) {
          Debug.trap("Chat session is already ended");
        };

        let currentTime = Time.now();
        let durationNanos = currentTime - session.startTime;
        let durationMinutes = Int.abs(durationNanos / (60 * 1000000000));
        let totalCost = durationMinutes * ratePerMinute;

        switch (principalMap.get(userProfiles, caller)) {
          case null Debug.trap("User profile not found");
          case (?profile) {
            if (profile.coinBalance < totalCost) {
              Debug.trap("Insufficient coins to pay for chat session");
            };

            let updatedProfile : UserProfile = {
              name = profile.name;
              birthDate = profile.birthDate;
              birthTime = profile.birthTime;
              birthPlace = profile.birthPlace;
              languagePreference = profile.languagePreference;
              isPremium = profile.isPremium;
              coinBalance = profile.coinBalance - totalCost;
              registrationTime = profile.registrationTime;
              freeTrialEnd = profile.freeTrialEnd;
            };
            userProfiles := principalMap.put(userProfiles, caller, updatedProfile);

            let updatedSession : ChatSession = {
              userId = session.userId;
              startTime = session.startTime;
              endTime = ?currentTime;
              totalMinutes = durationMinutes;
              totalCost;
              isActive = false;
            };
            chatSessions := chatSessionMap.put(chatSessions, caller, updatedSession);
          };
        };
      };
    };
  };

  public query ({ caller }) func getActiveChatSession() : async ?ChatSession {
    switch (chatSessionMap.get(chatSessions, caller)) {
      case null null;
      case (?session) {
        if (session.isActive) {
          ?session;
        } else {
          null;
        };
      };
    };
  };

  public query func getChatSessionHistory(user : Principal) : async [ChatSession] {
    let userSessions = Iter.toArray(chatSessionMap.vals(chatSessions));
    Array.filter<ChatSession>(userSessions, func(session) { session.userId == user });
  };

  public query func getRatePerMinute() : async Nat {
    5;
  };
};

