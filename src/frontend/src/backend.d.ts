import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface UserProfile {
    region?: Region;
    name: string;
    platform?: Platform;
    email?: string;
    phone?: string;
}
export interface PaymentConfig {
    gatewayProvider: PaymentProviderConfig;
    pagbankProvider: PagBankConfig;
}
export interface PagBankTransparentCheckoutConfig {
    token: string;
    publicKey: string;
    maxInstallments: bigint;
    email: string;
    interestRate?: number;
    acceptedPaymentTypes: Array<string>;
}
export type Time = bigint;
export interface PublicPagBankConfig {
    enabled: boolean;
}
export interface LossProfile {
    dailyEarnings: number;
    deactivationDate: bigint;
    platform: Platform;
    daysPerWeek: bigint;
}
export type Principal = Principal;
export interface WeatherSample {
    city: string;
    timestamp: Time;
    temperatureC: number;
    condition: WeatherCondition;
}
export interface PaymentProviderConfig {
    enabled: boolean;
}
export interface PublicPaymentConfig {
    gatewayProvider: PublicPaymentProviderConfig;
    pagbankProvider: PublicPagBankConfig;
}
export interface PagBankConfig {
    webhookSecret?: string;
    clientId?: string;
    merchantId?: string;
    enabled: boolean;
    clientSecret?: string;
}
export interface PagBankWebhookPayload {
    status: string;
    signature: string;
    paymentId: string;
    rawData: string;
}
export interface PagBankReturnWebhookUrlConfig {
    returnUrl: string;
    webhookUrl: string;
}
export interface PublicPaymentProviderConfig {
    enabled: boolean;
}
export interface WorkSession {
    id: bigint;
    startTime: Time;
    endTime?: Time;
    owner: Principal;
    city: string;
    weatherSamples: Array<WeatherSample>;
}
export enum Platform {
    uber = "uber",
    ninetyNine = "ninetyNine",
    ifood = "ifood",
    rappi = "rappi"
}
export enum Region {
    maracanau = "maracanau",
    caucaia = "caucaia",
    fortaleza = "fortaleza"
}
export enum TestimonialStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum WeatherCondition {
    cloudy = "cloudy",
    clear = "clear",
    nublado = "nublado",
    soleado = "soleado",
    tempestuoso = "tempestuoso",
    windy = "windy",
    rainy = "rainy"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPagBankReturnWebhookUrls(): Promise<PagBankReturnWebhookUrlConfig | null>;
    getPagBankTransparentCheckoutConfig(): Promise<PagBankTransparentCheckoutConfig | null>;
    getPublicPaymentConfig(): Promise<PublicPaymentConfig>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    handlePagBankWebhook(payload: PagBankWebhookPayload): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    logWorkSession(params: {
        city: string;
    }): Promise<WorkSession>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setLossProfile(profile: LossProfile): Promise<void>;
    setPagBankReturnWebhookUrls(config: PagBankReturnWebhookUrlConfig): Promise<void>;
    setPagBankTransparentCheckoutConfig(config: PagBankTransparentCheckoutConfig): Promise<void>;
    setPaymentConfig(config: PaymentConfig): Promise<void>;
    submitTestimonial(content: string): Promise<bigint>;
    updateTestimonialStatus(testimonialId: bigint, newStatus: TestimonialStatus): Promise<void>;
}
