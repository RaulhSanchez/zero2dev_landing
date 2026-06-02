"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SeoAdvancedRunner_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoAdvancedRunner = void 0;
const common_1 = require("@nestjs/common");
let SeoAdvancedRunner = SeoAdvancedRunner_1 = class SeoAdvancedRunner {
    code = 'SEO_ADV_CORE';
    category = 'seo';
    logger = new common_1.Logger(SeoAdvancedRunner_1.name);
    async run(ctx) {
        const findings = [];
        if (!ctx.html)
            return findings;
        const html = ctx.html;
        if (!/<link[^>]+rel=["']canonical["'][^>]*>/i.test(html)) {
            findings.push({ code: 'SEO_NO_CANONICAL', severity: 'medium', evidence: {} });
        }
        const hasSchema = html.includes('application/ld+json') ||
            /itemtype=["']https?:\/\/schema\.org/i.test(html);
        if (!hasSchema) {
            findings.push({ code: 'SEO_NO_SCHEMA', severity: 'medium', evidence: {} });
        }
        try {
            const base = new URL(ctx.url).origin;
            const [robotsRes, sitemapRes] = await Promise.allSettled([
                fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(5000) }),
                fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(5000) }),
            ]);
            if (robotsRes.status === 'rejected' || (robotsRes.status === 'fulfilled' && !robotsRes.value.ok)) {
                findings.push({ code: 'SEO_NO_ROBOTS', severity: 'medium', evidence: { url: `${base}/robots.txt` } });
            }
            if (sitemapRes.status === 'rejected' || (sitemapRes.status === 'fulfilled' && !sitemapRes.value.ok)) {
                findings.push({ code: 'SEO_NO_SITEMAP', severity: 'medium', evidence: { url: `${base}/sitemap.xml` } });
            }
        }
        catch (e) {
            this.logger.warn(`Could not check robots.txt / sitemap.xml: ${e}`);
        }
        return findings;
    }
};
exports.SeoAdvancedRunner = SeoAdvancedRunner;
exports.SeoAdvancedRunner = SeoAdvancedRunner = SeoAdvancedRunner_1 = __decorate([
    (0, common_1.Injectable)()
], SeoAdvancedRunner);
//# sourceMappingURL=seo-advanced.runner.js.map