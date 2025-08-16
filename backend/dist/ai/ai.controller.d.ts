import { DoubaoService } from './doubao.service';
import { KimiService } from './kimi.service';
import { GenerateImageDto, GenerateGameBackgroundDto, ChatDto, GenerateQuestionsDto } from './dto/ai.dto';
export declare class AiController {
    private doubaoService;
    private kimiService;
    constructor(doubaoService: DoubaoService, kimiService: KimiService);
    generateImage(generateImageDto: GenerateImageDto): Promise<{
        success: boolean;
        imageUrl: string;
        message: string;
    }>;
    generateGameBackground(dto: GenerateGameBackgroundDto): Promise<{
        success: boolean;
        imageUrl: string;
        message: string;
    }>;
    chat(chatDto: ChatDto): Promise<{
        success: boolean;
        response: string;
        message: string;
    }>;
    generateQuestions(dto: GenerateQuestionsDto): Promise<{
        success: boolean;
        questions: {
            question: string;
            options: string[];
            correctAnswer: number;
            explanation: string;
        };
        message: string;
    }>;
    proxyDoubao(body: any): Promise<any>;
    proxyKimi(body: any): Promise<any>;
}
