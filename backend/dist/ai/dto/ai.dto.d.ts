export declare class GenerateImageDto {
    prompt: string;
    size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';
    guidance_scale?: number;
    watermark?: boolean;
    response_format?: 'url' | 'b64_json';
}
export declare class GenerateGameBackgroundDto {
    title: string;
    description: string;
    theme?: string;
}
export declare class ChatDto {
    messages: Array<{
        role: 'system' | 'user' | 'assistant';
        content: string;
    }>;
    temperature?: number;
    max_tokens?: number;
}
export declare class GenerateQuestionsDto {
    title: string;
    description: string;
    scenarioType?: string;
    budget?: [number, number];
    duration?: string;
    preferences?: string[];
}
