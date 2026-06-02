"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityRunner = void 0;
const common_1 = require("@nestjs/common");
let SecurityRunner = class SecurityRunner {
    code = 'SEC_CORE';
    category = 'security';
    async run(ctx) {
        const findings = [];
        const headers = ctx.headers || {};
        const url = ctx.url;
        if (!url.startsWith('https://')) {
            findings.push({ code: 'SEC_NO_HTTPS', severity: 'critical', evidence: { url } });
        }
        const securityHeaders = [
            { key: 'x-content-type-options', code: 'SEC_NO_XCTO' },
            { key: 'x-frame-options', code: 'SEC_NO_XFO' },
            { key: 'content-security-policy', code: 'SEC_NO_CSP' },
            { key: 'strict-transport-security', code: 'SEC_NO_HSTS' },
        ];
        for (const { key, code } of securityHeaders) {
            const headerValue = headers[key] || headers[key.toLowerCase()];
            if (!headerValue) {
                findings.push({
                    code,
                    severity: code === 'SEC_NO_HSTS' || code === 'SEC_NO_CSP' ? 'high' : 'medium',
                    evidence: { missing_header: key },
                });
            }
        }
        return findings;
    }
};
exports.SecurityRunner = SecurityRunner;
exports.SecurityRunner = SecurityRunner = __decorate([
    (0, common_1.Injectable)()
], SecurityRunner);
//# sourceMappingURL=security.runner.js.map