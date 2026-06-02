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
var PdfService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PdfService = void 0;
const common_1 = require("@nestjs/common");
const handlebars = __importStar(require("handlebars"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
handlebars.registerHelper('colorClass', (score) => {
    if (score >= 80)
        return 'green';
    if (score >= 50)
        return 'yellow';
    return 'red';
});
handlebars.registerHelper('scoreLabel', (score) => {
    if (score >= 80)
        return 'Excelente';
    if (score >= 60)
        return 'Aceptable';
    if (score >= 40)
        return 'Mejorable';
    return 'Crítico';
});
handlebars.registerHelper('severityLabel', (s) => {
    const map = { critical: 'CRÍTICO', high: 'ALTO', medium: 'MEDIO', low: 'BAJO' };
    return map[s] ?? s.toUpperCase();
});
handlebars.registerHelper('eq', (a, b) => a === b);
handlebars.registerHelper('gt', (a, b) => a > b);
handlebars.registerHelper('stripMd', (text) => {
    if (!text)
        return '';
    return text
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/^[-*+]\s+/gm, '• ')
        .replace(/`([^`]+)`/g, '$1')
        .trim();
});
handlebars.registerHelper('fmtMs', (ms) => {
    if (ms == null)
        return '';
    if (ms >= 1000)
        return `${(ms / 1000).toFixed(1)} s`;
    return `${Math.round(ms)} ms`;
});
handlebars.registerHelper('fmtNum', (n) => {
    if (n == null)
        return '';
    return Number.isInteger(n) ? String(n) : parseFloat(n.toFixed(2)).toString();
});
handlebars.registerHelper('scoreAreaName', (key) => {
    const map = {
        performance: 'Rendimiento', seo: 'SEO', security: 'Seguridad', accessibility: 'Accesibilidad',
    };
    return map[key] ?? key;
});
let PdfService = PdfService_1 = class PdfService {
    logger = new common_1.Logger(PdfService_1.name);
    async generate(data) {
        try {
            const distPath = path.join(__dirname, 'templates', 'report.hbs');
            const srcPath = path.join(process.cwd(), 'src', 'modules', 'pdf', 'templates', 'report.hbs');
            const templatePath = await fs.access(distPath).then(() => distPath).catch(() => srcPath);
            const templateHtml = await fs.readFile(templatePath, 'utf8');
            const template = handlebars.compile(templateHtml);
            const findings = data.findings ?? [];
            const criticalFindings = findings.filter((f) => f.severity === 'critical');
            const highFindings = findings.filter((f) => f.severity === 'high');
            const mediumFindings = findings.filter((f) => f.severity === 'medium');
            const lowFindings = findings.filter((f) => f.severity === 'low');
            const urgentFindings = [...criticalFindings, ...highFindings];
            const html = template({
                ...data,
                date: new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                criticalFindings,
                highFindings,
                mediumFindings,
                lowFindings,
                urgentFindings,
                criticalCount: criticalFindings.length,
                highCount: highFindings.length,
                mediumCount: mediumFindings.length,
                lowCount: lowFindings.length,
                totalFindings: findings.length,
            });
            const puppeteer = (await import('puppeteer')).default;
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-zygote'],
            });
            const page = await browser.newPage();
            await page.setContent(html, { waitUntil: 'domcontentloaded' });
            const pdf = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
            });
            await browser.close();
            return Buffer.from(pdf);
        }
        catch (error) {
            this.logger.error('Error generating PDF', error);
            throw error;
        }
    }
};
exports.PdfService = PdfService;
exports.PdfService = PdfService = PdfService_1 = __decorate([
    (0, common_1.Injectable)()
], PdfService);
//# sourceMappingURL=pdf.service.js.map