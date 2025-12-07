// API Service for SMS Spam Detector

import { PredictionRequest, PredictionResponse, HealthResponse } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
    constructor(
        public status: number,
        message: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function predictSMS(text: string): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text } as PredictionRequest),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: "Unknown error" }));
        throw new ApiError(response.status, error.detail || "Prediction failed");
    }

    return response.json();
}

export async function checkHealth(): Promise<HealthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/health`);

    if (!response.ok) {
        throw new ApiError(response.status, "Health check failed");
    }

    return response.json();
}

export { ApiError };
