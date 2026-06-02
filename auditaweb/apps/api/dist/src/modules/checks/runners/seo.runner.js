"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeoRunner = void 0;
const common_1 = require("@nestjs/common");
let SeoRunner = class SeoRunner {
    code = 'SEO_CORE';
    category = 'seo';
    async run(ctx) {
        const findings = [];
        if (!ctx.html)
            return findings;
        const html = ctx.html;
        const h1Matches = html.match(/<h1[^>]*>/gi);
        if (!h1Matches || h1Matches.length === 0) {
            findings.push({ code: 'SEO_NO_H1', severity: 'high', evidence: {} });
        }
        else if (h1Matches.length > 1) {
            findings.push({ code: 'SEO_MULTIPLE_H1', severity: 'medium', evidence: { count: h1Matches.length } });
        }
        const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
        if (!metaDesc) {
            findings.push({ code: 'SEO_NO_META_DESC', severity: 'high', evidence: {} });
        }
        const title = html.match(/<title[^>]*>(.*?)<\/title>/i);
        if (!title) {
            findings.push({ code: 'SEO_NO_TITLE', severity: 'critical', evidence: {} });
        }
        else if (title[1].length < 30 || title[1].length > 60) {
            findings.push({
                code: 'SEO_TITLE_LENGTH',
                severity: 'low',
                evidence: { length: title[1].length },
            });
        }
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const imgsWithoutAlt = imgMatches.filter((img) => !img.includes('alt='));
        if (imgsWithoutAlt.length > 0) {
            findings.push({
                code: 'SEO_IMG_NO_ALT',
                severity: 'medium',
                evidence: { count: imgsWithoutAlt.length },
            });
        }
        return findings;
    }
};
exports.SeoRunner = SeoRunner;
exports.SeoRunner = SeoRunner = __decorate([
    (0, common_1.Injectable)()
], SeoRunner);
//# sourceMappingURL=seo.runner.js.map