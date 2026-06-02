"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LighthouseRunner = void 0;
const common_1 = require("@nestjs/common");
let LighthouseRunner = class LighthouseRunner {
    code = 'LH_CORE';
    category = 'performance';
    async run(ctx) {
        const findings = [];
        if (!ctx.lighthouse)
            return findings;
        const categories = ctx.lighthouse.categories;
        if (categories?.performance?.score !== null) {
            const score = categories.performance.score * 100;
            if (score < 50) {
                findings.push({
                    code: 'PERF_SCORE_LOW',
                    severity: 'critical',
                    evidence: { score },
                });
            }
            else if (score < 90) {
                findings.push({
                    code: 'PERF_SCORE_MED',
                    severity: 'medium',
                    evidence: { score },
                });
            }
        }
        const lcp = ctx.lighthouse.audits?.['largest-contentful-paint']?.numericValue;
        if (lcp && lcp > 2500) {
            findings.push({
                code: 'PERF_LCP_HIGH',
                severity: lcp > 4000 ? 'critical' : 'medium',
                evidence: { lcp_ms: lcp },
            });
        }
        return findings;
    }
};
exports.LighthouseRunner = LighthouseRunner;
exports.LighthouseRunner = LighthouseRunner = __decorate([
    (0, common_1.Injectable)()
], LighthouseRunner);
//# sourceMappingURL=lighthouse.runner.js.map