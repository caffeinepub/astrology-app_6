import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Panchang {
    tithi: string;
    sunrise: string;
    date: string;
    yoga: string;
    festivals: Array<string>;
    sunset: string;
    nakshatra: string;
    karana: string;
}
export interface ChatSession {
    startTime: Time;
    endTime?: Time;
    userId: Principal;
    totalCost: bigint;
    isActive: boolean;
    totalMinutes: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Kundali {
    userId: Principal;
    generatedAt: Time;
    houses: string;
    planetaryPositions: string;
    birthDetails: {
        date: string;
        time: string;
        place: string;
    };
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    languagePreference: string;
    freeTrialEnd: Time;
    birthDate: string;
    birthTime: string;
    isPremium: boolean;
    coinBalance: bigint;
    name: string;
    birthPlace: string;
    registrationTime: Time;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPanchang(panchang: Panchang): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deductCoins(amount: bigint): Promise<void>;
    endChatSession(): Promise<void>;
    getActiveChatSession(): Promise<ChatSession | null>;
    getAllPanchang(): Promise<Array<Panchang>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChatSessionHistory(user: Principal): Promise<Array<ChatSession>>;
    getKundali(): Promise<Kundali | null>;
    getPanchang(date: string): Promise<Panchang | null>;
    getRatePerMinute(): Promise<bigint>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isFreeTrialActive(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    registerUser(profile: UserProfile): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveKundali(kundali: Kundali): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    startChatSession(): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCoinBalance(amount: bigint): Promise<void>;
    updateSubscriptionStatus(isPremium: boolean): Promise<void>;
}