"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditModule = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("./audit.service");
const audit_controller_1 = require("./audit.controller");
const checks_module_1 = require("../checks/checks.module");
const pdf_module_1 = require("../pdf/pdf.module");
const narrative_module_1 = require("../narrative/narrative.module");
const queue_module_1 = require("../queue/queue.module");
const telegram_module_1 = require("../telegram/telegram.module");
const mail_service_1 = require("../notifications/mail.service");
let AuditModule = class AuditModule {
};
exports.AuditModule = AuditModule;
exports.AuditModule = AuditModule = __decorate([
    (0, common_1.Module)({
        imports: [checks_module_1.ChecksModule, pdf_module_1.PdfModule, narrative_module_1.NarrativeModule, queue_module_1.QueueModule, telegram_module_1.TelegramModule],
        controllers: [audit_controller_1.AuditController],
        providers: [audit_service_1.AuditService, mail_service_1.MailService],
    })
], AuditModule);
//# sourceMappingURL=audit.module.js.map