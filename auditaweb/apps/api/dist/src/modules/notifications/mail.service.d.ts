export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
    attachment?: {
        filename: string;
        content: Buffer;
        contentType: string;
    };
}
export declare class MailService {
    private readonly logger;
    send(opts: MailOptions, apiKey: string): Promise<void>;
}
