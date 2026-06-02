"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuditService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const aggregator_service_1 = require("../checks/aggregator/aggregator.service");
const pdf_service_1 = require("../pdf/pdf.service");
const narrative_service_1 = require("../narrative/narrative.service");
const queue_service_1 = require("../queue/queue.service");
const telegram_service_1 = require("../telegram/telegram.service");
const mail_service_1 = require("../notifications/mail.service");
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
let AuditService = AuditService_1 = class AuditService {
    prisma;
    aggregator;
    pdfService;
    narrative;
    queueService;
    telegramService;
    mailService;
    logger = new common_1.Logger(AuditService_1.name);
    constructor(prisma, aggregator, pdfService, narrative, queueService, telegramService, mailService) {
        this.prisma = prisma;
        this.aggregator = aggregator;
        this.pdfService = pdfService;
        this.narrative = narrative;
        this.queueService = queueService;
        this.telegramService = telegramService;
        this.mailService = mailService;
    }
    async createAudit(url, email) {
        let domain = '';
        try {
            domain = new URL(url).hostname;
        }
        catch (e) {
            domain = url;
        }
        const crypto = await import('crypto');
        const publicSlug = crypto.randomUUID().split('-')[0];
        const audit = await this.prisma.audit.create({
            data: {
                url,
                domain,
                status: 'pending',
                publicSlug,
                ...(email ? { email } : {}),
            },
        });
        this.telegramService.sendMessage(`🚀 <b>Nuevo lead</b>\nURL: ${url}\nEmail: ${email || 'No proporcionado'}`);
        this.queueService.add(() => this.processAudit(audit.id, url, email));
        return {
            id: audit.id,
            publicSlug: audit.publicSlug,
            status: audit.status,
        };
    }
    async processAudit(auditId, url, email) {
        try {
            this.logger.log(`[1/5] Starting audit ${auditId} — url=${url} email=${email ?? 'none'}`);
            const result = await this.aggregator.runAll(url);
            this.logger.log(`[2/5] Checks done — score=${result.globalScore} findings=${result.findings.length}`);
            const narrativeText = await this.narrative.generate({
                url,
                globalScore: result.globalScore,
                scores: result.scores,
                findings: result.findings,
            });
            this.logger.log(`[3/5] Narrative generated (${narrativeText.length} chars)`);
            await this.prisma.audit.update({
                where: { id: auditId },
                data: {
                    status: 'done',
                    globalScore: result.globalScore,
                    scores: JSON.stringify(result.scores),
                    findings: JSON.stringify(result.findings),
                    narrative: narrativeText,
                },
            });
            this.logger.log(`[3/5] Audit ${auditId} persisted as done`);
            let pdfBuffer = null;
            try {
                this.logger.log(`[4/5] Generating PDF…`);
                const enrichedForPdf = await this.enrichFindings(result.findings);
                pdfBuffer = await this.pdfService.generate({
                    url,
                    globalScore: result.globalScore,
                    scores: result.scores,
                    findings: enrichedForPdf,
                    narrative: narrativeText,
                });
                const reportsDir = path.resolve(process.env.REPORTS_DIR || path.join(process.cwd(), 'reports'));
                await fs.mkdir(reportsDir, { recursive: true });
                const pdfFilePath = path.join(reportsDir, `${auditId}.pdf`);
                await fs.writeFile(pdfFilePath, pdfBuffer);
                this.logger.log(`[4/5] PDF saved: ${pdfFilePath}`);
            }
            catch (pdfError) {
                this.logger.error(`[4/5] PDF generation failed — audit still done`, pdfError);
            }
            if (email) {
                this.logger.log(`[5/5] Sending email to ${email} (pdfReady=${pdfBuffer !== null})`);
                await this.sendReportEmail(email, url, auditId, pdfBuffer, result.globalScore);
            }
            this.telegramService.sendMessage(`✅ <b>Auditoría completada</b>\nURL: ${url}\nPuntuación: ${result.globalScore}/100\nLink: ${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/report/?id=${auditId}`);
            this.logger.log(`Audit ${auditId} completed successfully.`);
        }
        catch (e) {
            this.logger.error(`Error processing audit ${auditId}`, e);
            await this.prisma.audit.update({
                where: { id: auditId },
                data: { status: 'failed' },
            }).catch(() => { });
        }
    }
    async sendReportEmail(email, url, auditId, pdfBuffer, globalScore) {
        const resendApiKey = process.env.RESEND_API_KEY;
        if (!resendApiKey) {
            this.logger.warn('⚠️  RESEND_API_KEY vacío — email NO enviado.');
            return;
        }
        const hostname = new URL(url).hostname;
        const reportUrl = `${process.env.FRONTEND_BASE_URL || 'http://localhost:3000'}/report/?id=${auditId}`;
        const fromAddress = process.env.RESEND_FROM ?? 'AuditaWeb <onboarding@resend.dev>';
        try {
            await this.mailService.send({
                from: fromAddress,
                to: email,
                subject: `Tu informe de auditoría para ${hostname} — Puntuación: ${globalScore}/100`,
                html: `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
              <h2 style="color:#4f46e5">Tu informe está listo</h2>
              <p>Hemos analizado <strong>${url}</strong> y tu puntuación global es <strong style="font-size:1.4em">${globalScore}/100</strong>.</p>
              <p>Haz clic en el botón para ver todos los hallazgos y el plan de acción.</p>
              <a href="${reportUrl}" style="display:inline-block;margin:16px 0;background:#4f46e5;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Ver resultado online</a>
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
              <p style="font-size:12px;color:#64748b">Raúl Huete · zero2dev.es</p>
            </div>
          `,
                ...(pdfBuffer ? {
                    attachment: {
                        filename: `informe-${hostname}.pdf`,
                        content: pdfBuffer,
                        contentType: 'application/pdf',
                    },
                } : {}),
            }, resendApiKey);
        }
        catch (e) {
            this.logger.error(`Error enviando email a ${email}`, e);
        }
    }
    async enrichFindings(rawFindings) {
        if (!rawFindings?.length)
            return rawFindings ?? [];
        const codes = rawFindings.map((f) => f.code);
        const catalog = await this.prisma.findingCatalog.findMany({ where: { code: { in: codes } } });
        const catalogMap = new Map(catalog.map((c) => [c.code, c]));
        return rawFindings.map((f) => {
            const entry = catalogMap.get(f.code);
            return {
                ...f,
                title: entry?.titleEs ?? f.code,
                description: entry?.descriptionEs ?? null,
                businessImpact: entry?.businessImpact ?? null,
                fixSuggestion: entry?.fixSuggestion ?? null,
            };
        });
    }
    async getAudit(id) {
        const audit = await this.prisma.audit.findUnique({ where: { id } });
        if (!audit)
            return null;
        const rawFindings = audit.findings ? JSON.parse(audit.findings) : null;
        return {
            id: audit.id,
            url: audit.url,
            status: audit.status,
            globalScore: audit.globalScore,
            scores: audit.scores ? JSON.parse(audit.scores) : null,
            findings: await this.enrichFindings(rawFindings),
            narrative: audit.narrative,
        };
    }
    async getAuditBySlug(publicSlug) {
        const audit = await this.prisma.audit.findUnique({ where: { publicSlug } });
        if (!audit)
            return null;
        const rawFindings = audit.findings ? JSON.parse(audit.findings) : null;
        return {
            id: audit.id,
            url: audit.url,
            status: audit.status,
            globalScore: audit.globalScore,
            scores: audit.scores ? JSON.parse(audit.scores) : null,
            findings: await this.enrichFindings(rawFindings),
            narrative: audit.narrative,
            createdAt: audit.createdAt,
        };
    }
    async getPdfPath(id) {
        const reportsDir = path.resolve(process.env.REPORTS_DIR ?? path.join(process.cwd(), 'reports'));
        const pdfPath = path.join(reportsDir, `${id}.pdf`);
        try {
            await fs.access(pdfPath);
            return pdfPath;
        }
        catch {
            return null;
        }
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = AuditService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        aggregator_service_1.AggregatorService,
        pdf_service_1.PdfService,
        narrative_service_1.NarrativeService,
        queue_service_1.QueueService,
        telegram_service_1.TelegramService,
        mail_service_1.MailService])
], AuditService);
//# sourceMappingURL=audit.service.js.map