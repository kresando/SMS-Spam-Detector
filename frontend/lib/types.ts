// API Types for SMS Spam Detector

export interface PredictionRequest {
    text: string;
}

export interface PredictionResponse {
    text: string;
    label: number;
    label_name: string;
    confidence: number;
    probabilities: {
        Normal: number;
        "Fraud/Penipuan": number;
        Promo: number;
    };
}

export interface HealthResponse {
    status: string;
    model_loaded: boolean;
    version: string;
}

// Label colors and icons for UI
export const LABEL_CONFIG = {
    0: {
        name: "Normal",
        color: "emerald",
        bgClass: "bg-emerald-500/10",
        textClass: "text-emerald-600 dark:text-emerald-400",
        borderClass: "border-emerald-500/20",
        icon: "check-circle",
        description: "SMS biasa/normal dari kontak pribadi",
    },
    1: {
        name: "Fraud/Penipuan",
        color: "red",
        bgClass: "bg-red-500/10",
        textClass: "text-red-600 dark:text-red-400",
        borderClass: "border-red-500/20",
        icon: "alert-triangle",
        description: "SMS penipuan atau scam - HATI-HATI!",
    },
    2: {
        name: "Promo",
        color: "blue",
        bgClass: "bg-blue-500/10",
        textClass: "text-blue-600 dark:text-blue-400",
        borderClass: "border-blue-500/20",
        icon: "tag",
        description: "SMS promosi dari operator/brand",
    },
} as const;
