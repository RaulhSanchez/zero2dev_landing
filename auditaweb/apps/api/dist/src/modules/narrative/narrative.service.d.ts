import { PrismaService } from '../../common/prisma/prisma.service';
import type { Finding } from '../checks/interfaces';
export interface NarrativeInput {
    url: string;
    globalScore: number;
    scores: Record<string, number>;
    findings: Finding[];
}
export declare class NarrativeService {
    private prisma;
    private readonly logger;
    private llm;
    constructor(prisma: PrismaService);
    generate(params: NarrativeInput): Promise<string>;
    private generateFallback;
}
