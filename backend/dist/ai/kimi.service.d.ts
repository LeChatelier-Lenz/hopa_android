import { ConfigService } from '@nestjs/config';
interface KimiMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export declare class KimiService {
    private configService;
    private apiKey;
    private apiUrl;
    constructor(configService: ConfigService);
    chat(messages: KimiMessage[], options?: {
        temperature?: number;
        max_tokens?: number;
    }): Promise<string>;
    generateConsensusQuestions(scenario: {
        title: string;
        description: string;
        scenarioType?: string;
        budget?: [number, number];
        duration?: string;
        preferences?: string[];
    }): Promise<{
        question: string;
        options: string[];
        correctAnswer: number;
        explanation: string;
    }>;
}
export {};
