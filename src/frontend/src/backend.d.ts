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
    name: string;
    email?: string;
}
export interface PublicPaymentProviderConfig {
    publicKey: string;
    enabled: boolean;
}
export interface PaymentConfig {
    mercadoPago: PaymentProviderConfig;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface LossProfile {
    dailyEarnings: number;
    deactivationDate: bigint;
    platform: Platform;
    daysPerWeek: bigint;
}
export interface UserAccessInfo {
    principal: Principal;
    isBlockedByAdmin: boolean;
    subscriptionStatus: SubscriptionStatus;
    profile?: UserProfile;
}
export type Principal = Principal;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface WeatherSample {
    city: string;
    timestamp: Time;
    temperatureC: number;
    condition: WeatherCondition;
}
export interface PublicPaymentConfig {
    mercadoPago: PublicPaymentProviderConfig;
}
export interface PaymentProviderConfig {
    publicKey: string;
    enabled: boolean;
    accessToken: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PaymentCheckoutResponse {
    paymentId: string;
    checkoutUrl?: string;
}
export interface PaymentStatus {
    status: string;
    paymentId: string;
    rawResponse: string;
}
export interface Evidence {
    id: bigint;
    regiao?: Region;
    duration?: bigint;
    owner: Principal;
    bairro?: string;
    audioQuality?: string;
    videoQuality?: string;
    platform?: Platform;
    notes: string;
    uploadTime: bigint;
    evidenceType: EvidenceType;
}
export interface SubscriptionStatus {
    startTime?: bigint;
    endTime?: bigint;
    currentPlan: SubscriptionPlan;
}
export interface WorkSession {
    id: bigint;
    startTime: Time;
    endTime?: Time;
    owner: Principal;
    city: string;
    weatherSamples: Array<WeatherSample>;
}
export interface Testimonial {
    id: bigint;
    status: TestimonialStatus;
    content: string;
    submitter: Principal;
    timestamp: bigint;
}
export enum EvidenceType {
    audio = "audio",
    video = "video",
    selfie = "selfie",
    screenshot = "screenshot"
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
export enum SubscriptionPlan {
    free_24h = "free_24h",
    pro_monthly = "pro_monthly",
    pro_annual = "pro_annual"
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
    checkPaymentStatus(paymentId: string): Promise<PaymentStatus>;
    createMercadoPagoCheckout(plan: SubscriptionPlan): Promise<PaymentCheckoutResponse>;
    createPaymentPreference(plan: SubscriptionPlan): Promise<PaymentCheckoutResponse>;
    getAllEvidence(): Promise<Array<Evidence>>;
    getAllUserAccessInfo(): Promise<Array<UserAccessInfo>>;
    getApprovedTestimonials(): Promise<Array<Testimonial>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPendingTestimonials(): Promise<Array<Testimonial>>;
    getPublicPaymentConfig(): Promise<PublicPaymentConfig>;
    getSubscriptionStatus(): Promise<SubscriptionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    logWorkSession(params: {
        city: string;
    }): Promise<WorkSession>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setLossProfile(profile: LossProfile): Promise<void>;
    setPaymentConfig(config: PaymentConfig): Promise<void>;
    submitTestimonial(content: string): Promise<bigint>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateTestimonialStatus(testimonialId: bigint, newStatus: TestimonialStatus): Promise<void>;
}
