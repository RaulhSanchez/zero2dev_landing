import { PrismaService } from '../../common/prisma/prisma.service';
import { AggregatorService } from '../checks/aggregator/aggregator.service';
import { PdfService } from '../pdf/pdf.service';
import { NarrativeService } from '../narrative/narrative.service';
import { QueueService } from '../queue/queue.service';
import { TelegramService } from '../telegram/telegram.service';
import { MailService } from '../notifications/mail.service';
export declare class AuditService {
    private readonly prisma;
    private readonly aggregator;
    private readonly pdfService;
    private readonly narrative;
    private readonly queueService;
    private readonly telegramService;
    private readonly mailService;
    private readonly logger;
    constructor(prisma: PrismaService, aggregator: AggregatorService, pdfService: PdfService, narrative: NarrativeService, queueService: QueueService, telegramService: TelegramService, mailService: MailService);
    createAudit(url: string, email?: string): Promise<{
        id: string;
        publicSlug: string | null;
        status: string;
    }>;
    private processAudit;
    private sendReportEmail;
    private enrichFindings;
    getAudit(id: string): Promise<{
        id: string;
        url: string;
        status: string;
        globalScore: number | null;
        scores: any;
        findings: any[];
        narrative: string | null;
    } | null>;
    getAuditBySlug(publicSlug: string): Promise<{
        id: string;
        url: string;
        status: string;
        globalScore: number | null;
        scores: any;
        findings: any[];
        narrative: string | null;
        createdAt: Date;
    } | null>;
    getPdfPath(id: string): Promise<string | null>;
}
