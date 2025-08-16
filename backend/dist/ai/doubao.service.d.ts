import { ConfigService } from '@nestjs/config';
export declare class DoubaoService {
    private configService;
    private apiKey;
    private apiUrl;
    constructor(configService: ConfigService);
    generateImage(prompt: string, options?: {
        size?: '1024x1024' | '512x512' | '1080x1920' | '768x1344' | '1344x768';
        guidance_scale?: number;
        watermark?: boolean;
        response_format?: 'url' | 'b64_json';
    }): Promise<string>;
    generateGameBackground(scenario: {
        title: string;
        description: string;
        theme?: string;
    }): Promise<string>;
}
