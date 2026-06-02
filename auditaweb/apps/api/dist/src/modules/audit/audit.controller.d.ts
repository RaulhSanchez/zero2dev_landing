import { AuditService } from './audit.service';
import type { Response } from 'express';
export declare class AuditController {
    private readonly auditService;
    private readonly logger;
    constructor(auditService: AuditService);
    create(body: any): Promise<{
        id: string;
        publicSlug: string | null;
        status: string;
    }>;
    findBySlug(slug: string): Promise<{
        id: string;
        url: string;
        status: string;
        globalScore: number | null;
        scores: any;
        findings: any[];
        narrative: string | null;
        createdAt: Date;
    }>;
    downloadPdf(id: string, res: Response): Promise<void>;
    findOne(id: string): Promise<{
        id: string;
        url: string;
        status: string;
        globalScore: number | null;
        scores: any;
        findings: any[];
        narrative: string | null;
    }>;
}
