"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AggregatorService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregatorService = void 0;
const common_1 = require("@nestjs/common");
const lighthouse_runner_1 = require("../runners/lighthouse.runner");
const seo_runner_1 = require("../runners/seo.runner");
const seo_advanced_runner_1 = require("../runners/seo-advanced.runner");
const security_runner_1 = require("../runners/security.runner");
const mobile_runner_1 = require("../runners/mobile.runner");
const social_runner_1 = require("../runners/social.runner");
const legal_runner_1 = require("../runners/legal.runner");
let AggregatorService = AggregatorService_1 = class AggregatorService {
    lighthouseRunner;
    seoRunner;
    seoAdvancedRunner;
    securityRunner;
    mobileRunner;
    socialRunner;
    legalRunner;
    logger = new common_1.Logger(AggregatorService_1.name);
    constructor(lighthouseRunner, seoRunner, seoAdvancedRunner, securityRunner, mobileRunner, socialRunner, legalRunner) {
        this.lighthouseRunner = lighthouseRunner;
        this.seoRunner = seoRunner;
        this.seoAdvancedRunner = seoAdvancedRunner;
        this.securityRunner = securityRunner;
        this.mobileRunner = mobileRunner;
        this.socialRunner = socialRunner;
        this.legalRunner = legalRunner;
    }
    async runAll(url) {
        const findings = [];
        const scores = {};
        let html = '';
        let headers = {};
        try {
            const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AuditBot/1.0)' } });
            html = await res.text();
            res.headers.forEach((value, key) => { headers[key.toLowerCase()] = value; });
            this.logger.log(`Fetched HTML for ${url} (${html.length} bytes)`);
        }
        catch (e) {
            this.logger.warn(`Could not fetch HTML for ${url}: ${e}`);
        }
        const ctx = { url, html, headers };
        try {
            if (process.env.PUPPETEER_SKIP_DOWNLOAD === 'true') {
                throw new Error('Lighthouse skipped: no Chromium (PUPPETEER_SKIP_DOWNLOAD=true)');
            }
            const lighthouse = (await import('lighthouse')).default;
            const chromeLauncher = await import('chrome-launcher');
            const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--no-zygote'] });
            const runnerResult = await lighthouse(url, {
                logLevel: 'error',
                output: 'json',
                onlyCategories: ['performance', 'accessibility', 'seo'],
                port: chrome.port,
            });
            await chrome.kill();
            ctx.lighthouse = runnerResult?.lhr;
            if (runnerResult?.lhr?.categories) {
                scores.performance = Math.round((runnerResult.lhr.categories.performance?.score ?? 0) * 100);
                scores.seo = Math.round((runnerResult.lhr.categories.seo?.score ?? 0) * 100);
                scores.accessibility = Math.round((runnerResult.lhr.categories.accessibility?.score ?? 0) * 100);
            }
            this.logger.log(`Lighthouse done — perf=${scores.performance} seo=${scores.seo} a11y=${scores.accessibility}`);
        }
        catch (e) {
            this.logger.warn(`Lighthouse failed — continuing: ${e}`);
        }
        const [lhFindings, seoFindings, seoAdvFindings, secFindings, mobFindings, socFindings, legFindings] = await Promise.all([
            this.lighthouseRunner.run(ctx),
            this.seoRunner.run(ctx),
            this.seoAdvancedRunner.run(ctx),
            this.securityRunner.run(ctx),
            this.mobileRunner.run(ctx),
            this.socialRunner.run(ctx),
            this.legalRunner.run(ctx),
        ]);
        findings.push(...lhFindings, ...seoFindings, ...seoAdvFindings, ...secFindings, ...mobFindings, ...socFindings, ...legFindings);
        const severity = (arr, s) => arr.filter((f) => f.severity === s).length;
        scores.security = Math.max(0, 100
            - severity(secFindings, 'critical') * 30
            - severity(secFindings, 'high') * 15
            - severity(secFindings, 'medium') * 8);
        scores.mobile = Math.max(0, 100
            - severity(mobFindings, 'critical') * 30
            - severity(mobFindings, 'high') * 15
            - severity(mobFindings, 'medium') * 8);
        const available = Object.values(scores).filter((s) => s > 0);
        const globalScore = available.length > 0
            ? Math.round(available.reduce((a, b) => a + b, 0) / available.length)
            : 0;
        this.logger.log(`Scores: ${JSON.stringify(scores)} → global=${globalScore} findings=${findings.length}`);
        return { findings, scores, globalScore };
    }
};
exports.AggregatorService = AggregatorService;
exports.AggregatorService = AggregatorService = AggregatorService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lighthouse_runner_1.LighthouseRunner,
        seo_runner_1.SeoRunner,
        seo_advanced_runner_1.SeoAdvancedRunner,
        security_runner_1.SecurityRunner,
        mobile_runner_1.MobileRunner,
        social_runner_1.SocialRunner,
        legal_runner_1.LegalRunner])
], AggregatorService);
//# sourceMappingURL=aggregator.service.js.map