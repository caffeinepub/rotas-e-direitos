import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LossProfile {
    dailyEarnings: number;
    deactivationDate: bigint;
    platform: Platform;
    daysPerWeek: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export type Time = bigint;
export interface Appeal {
    id: bigint;
    owner: Principal;
    createdTime: bigint;
    platform: Platform;
    userExplanation: string;
    reasonCategory: ReasonCategory;
    generatedText: string;
    evidenceIds: Array<bigint>;
}
export interface CollectiveReport {
    region: Region;
    neighborhood: string;
    platform: Platform;
    timestamp: Time;
    reason: ReasonCategory;
}
export interface WeatherSample {
    city: string;
    timestamp: Time;
    temperatureC: number;
    condition: WeatherCondition;
}
export interface Evidence {
    id: bigint;
    regiao?: Region;
    owner: Principal;
    bairro?: string;
    platform?: Platform;
    notes: string;
    uploadTime: bigint;
    evidenceType: EvidenceType;
}
export interface PublicLossProfile {
    dailyEarnings: number;
    deactivationDate: bigint;
    platform: Platform;
    daysPerWeek: bigint;
}
export interface WorkSession {
    id: bigint;
    startTime: Time;
    endTime?: Time;
    owner: Principal;
    city: string;
    weatherSamples: Array<WeatherSample>;
}
export enum EvidenceType {
    selfie = "selfie",
    screenshot = "screenshot"
}
export enum Platform {
    uber = "uber",
    ninetyNine = "ninetyNine",
    ifood = "ifood",
    rappi = "rappi"
}
export enum ReasonCategory {
    lowRating = "lowRating",
    other = "other",
    documentsExpired = "documentsExpired",
    fraudSuspicion = "fraudSuspicion",
    selfieInvalid = "selfieInvalid",
    dangerousConduct = "dangerousConduct",
    multipleAccounts = "multipleAccounts"
}
export enum Region {
    maracanau = "maracanau",
    caucaia = "caucaia",
    fortaleza = "fortaleza"
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
    addWeatherSample(sessionId: bigint, params: {
        temperatureC: number;
        condition: WeatherCondition;
    }): Promise<WorkSession>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createEvidence(params: {
        regiao?: Region;
        bairro?: string;
        platform?: Platform;
        notes: string;
        evidenceType: EvidenceType;
    }): Promise<Evidence>;
    endWorkSession(sessionId: bigint): Promise<WorkSession>;
    generateAppeal(params: {
        platform: Platform;
        userExplanation: string;
        reasonCategory: ReasonCategory;
        evidenceIds: Array<bigint>;
    }): Promise<Appeal>;
    getAllEvidence(): Promise<Array<Evidence>>;
    getAppeal(appealId: bigint): Promise<Appeal | null>;
    getCallerAppeals(): Promise<Array<Appeal>>;
    getCallerLossProfile(): Promise<PublicLossProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCollectiveReports(): Promise<Array<CollectiveReport>>;
    getEvidenceById(evidenceId: bigint): Promise<Evidence | null>;
    getEvidenceFiltered(typeFilter: EvidenceType | null, platformFilter: Platform | null): Promise<Array<Evidence>>;
    getLossProfile(user: Principal): Promise<PublicLossProfile | null>;
    getPlatformStats(platform: Platform): Promise<bigint>;
    getReasonStats(reason: ReasonCategory): Promise<bigint>;
    getRegionStats(region: Region): Promise<bigint>;
    getRevisoMotivadaMessage(): Promise<string>;
    getTimeline(params: {
        startTime?: bigint;
        endTime?: bigint;
        platformFilter?: Platform;
        typeFilter?: EvidenceType;
    }): Promise<Array<Evidence>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWorkSession(sessionId: bigint): Promise<WorkSession | null>;
    isCallerAdmin(): Promise<boolean>;
    logWorkSession(params: {
        city: string;
    }): Promise<WorkSession>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setLossProfile(profile: LossProfile): Promise<void>;
    submitCollectiveReport(params: {
        region: Region;
        neighborhood: string;
        platform: Platform;
        reason: ReasonCategory;
    }): Promise<void>;
}
