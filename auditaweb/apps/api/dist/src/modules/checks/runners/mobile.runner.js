"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileRunner = void 0;
const common_1 = require("@nestjs/common");
let MobileRunner = class MobileRunner {
    code = 'MOB_CORE';
    category = 'mobile';
    async run(ctx) {
        const findings = [];
        if (!ctx.html)
            return findings;
        const html = ctx.html;
        const lower = html.toLowerCase();
        if (!/<meta[^>]+name=["']viewport["'][^>]*>/i.test(html)) {
            findings.push({ code: 'MOB_NO_VIEWPORT', severity: 'critical', evidence: {} });
        }
        if (!/<a[^>]+href=["']tel:/i.test(html)) {
            findings.push({ code: 'MOB_NO_TEL_LINK', severity: 'medium', evidence: {} });
        }
        if (!lower.includes('wa.me') && !lower.includes('api.whatsapp.com') && !lower.includes('whatsapp.com/send')) {
            findings.push({ code: 'MOB_NO_WHATSAPP', severity: 'medium', evidence: {} });
        }
        const tinyFont = html.match(/font-size\s*:\s*([0-9]+)px/gi) || [];
        const hasSmallText = tinyFont.some((m) => {
            const px = parseInt(m.replace(/[^0-9]/g, ''), 10);
            return px > 0 && px < 12;
        });
        if (hasSmallText) {
            findings.push({ code: 'MOB_FONT_SMALL', severity: 'medium', evidence: {} });
        }
        return findings;
    }
};
exports.MobileRunner = MobileRunner;
exports.MobileRunner = MobileRunner = __decorate([
    (0, common_1.Injectable)()
], MobileRunner);
//# sourceMappingURL=mobile.runner.js.map