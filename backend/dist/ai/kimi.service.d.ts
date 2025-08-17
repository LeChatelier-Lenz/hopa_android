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
    generateConflictQuestions(scenario: {
        title: string;
        description: string;
        scenarioType?: string;
        budget?: [number, number];
        duration?: string;
        preferences?: string[];
    }): Promise<Array<{
        id: string;
        type: 'choice' | 'fill' | 'sort';
        question: string;
        options?: string[];
        correctAnswer?: number | string | string[];
        explanation: string;
        category: string;
    }>>;
    generateEquipmentContent(scenario: {
        title: string;
        description: string;
        scenarioType?: string;
        budget?: [number, number];
        duration?: string;
        preferences?: string[];
    }): Promise<{
        cuisineGem: {
            types: string[];
            name: string;
            description: string;
        };
        attractionShield: {
            preferences: string[];
            name: string;
            description: string;
        };
    }>;
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
