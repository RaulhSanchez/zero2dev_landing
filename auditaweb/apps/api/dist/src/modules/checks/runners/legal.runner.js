"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegalRunner = void 0;
const common_1 = require("@nestjs/common");
let LegalRunner = class LegalRunner {
    code = 'LEG_CORE';
    category = 'legal';
    async run(ctx) {
        const findings = [];
        if (!ctx.html)
            return findings;
        const lower = ctx.html.toLowerCase();
        const hasCookieBanner = lower.includes('cookie') &&
            (lower.includes('aceptar') ||
                lower.includes('accept') ||
                lower.includes('consent') ||
                lower.includes('consentimiento') ||
                lower.includes('cookie-banner') ||
                lower.includes('cookiebanner') ||
                lower.includes('cookie_banner') ||
                lower.includes('rgpd') ||
                lower.includes('gdpr'));
        if (!hasCookieBanner) {
            findings.push({ code: 'LEG_NO_COOKIE_BANNER', severity: 'high', evidence: {} });
        }
        const hasPrivacy = lower.includes('política de privacidad') ||
            lower.includes('politica de privacidad') ||
            lower.includes('privacy policy') ||
            lower.includes('privacidad') ||
            lower.includes('href') && lower.includes('privaci');
        if (!hasPrivacy) {
            findings.push({ code: 'LEG_NO_PRIVACY', severity: 'high', evidence: {} });
        }
        const hasLegal = lower.includes('aviso legal') ||
            lower.includes('términos') ||
            lower.includes('terminos') ||
            lower.includes('condiciones de uso') ||
            lower.includes('términos y condiciones');
        if (!hasLegal) {
            findings.push({ code: 'LEG_NO_LEGAL', severity: 'medium', evidence: {} });
        }
        return findings;
    }
};
exports.LegalRunner = LegalRunner;
exports.LegalRunner = LegalRunner = __decorate([
    (0, common_1.Injectable)()
], LegalRunner);
//# sourceMappingURL=legal.runner.js.map