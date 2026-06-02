"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialRunner = void 0;
const common_1 = require("@nestjs/common");
let SocialRunner = class SocialRunner {
    code = 'SOC_CORE';
    category = 'social';
    async run(ctx) {
        const findings = [];
        if (!ctx.html)
            return findings;
        const html = ctx.html;
        if (!/<meta[^>]+property=["']og:title["'][^>]*>/i.test(html)) {
            findings.push({ code: 'SOC_NO_OG_TITLE', severity: 'medium', evidence: {} });
        }
        if (!/<meta[^>]+property=["']og:image["'][^>]*>/i.test(html)) {
            findings.push({ code: 'SOC_NO_OG_IMAGE', severity: 'high', evidence: {} });
        }
        const hasFavicon = /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]*>/i.test(html) ||
            /<link[^>]+rel=["']shortcut icon["'][^>]*>/i.test(html);
        if (!hasFavicon) {
            findings.push({ code: 'SOC_NO_FAVICON', severity: 'low', evidence: {} });
        }
        const lower = html.toLowerCase();
        const hasCta = lower.includes('href="tel:') ||
            lower.includes("href='tel:") ||
            lower.includes('wa.me') ||
            lower.includes('contacto') ||
            lower.includes('presupuesto') ||
            lower.includes('llamar') ||
            lower.includes('cita');
        if (!hasCta) {
            findings.push({ code: 'SOC_NO_CTA', severity: 'high', evidence: {} });
        }
        return findings;
    }
};
exports.SocialRunner = SocialRunner;
exports.SocialRunner = SocialRunner = __decorate([
    (0, common_1.Injectable)()
], SocialRunner);
//# sourceMappingURL=social.runner.js.map