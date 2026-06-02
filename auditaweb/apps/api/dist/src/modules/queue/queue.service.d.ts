export declare class QueueService {
    private queue;
    private isProcessing;
    private readonly logger;
    add(job: () => Promise<void>): void;
    private processNext;
}
