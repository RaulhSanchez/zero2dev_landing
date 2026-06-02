export declare class TelegramService {
    private readonly logger;
    private readonly token;
    private readonly chatId;
    sendMessage(text: string): Promise<void>;
}
