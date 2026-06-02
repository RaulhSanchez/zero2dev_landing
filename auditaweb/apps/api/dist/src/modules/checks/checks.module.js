"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChecksModule = void 0;
const common_1 = require("@nestjs/common");
const aggregator_service_1 = require("./aggregator/aggregator.service");
const lighthouse_runner_1 = require("./runners/lighthouse.runner");
const seo_runner_1 = require("./runners/seo.runner");
const seo_advanced_runner_1 = require("./runners/seo-advanced.runner");
const security_runner_1 = require("./runners/security.runner");
const mobile_runner_1 = require("./runners/mobile.runner");
const social_runner_1 = require("./runners/social.runner");
const legal_runner_1 = require("./runners/legal.runner");
const checks_seeder_1 = require("./checks.seeder");
let ChecksModule = class ChecksModule {
};
exports.ChecksModule = ChecksModule;
exports.ChecksModule = ChecksModule = __decorate([
    (0, common_1.Module)({
        providers: [
            aggregator_service_1.AggregatorService,
            lighthouse_runner_1.LighthouseRunner,
            seo_runner_1.SeoRunner,
            seo_advanced_runner_1.SeoAdvancedRunner,
            security_runner_1.SecurityRunner,
            mobile_runner_1.MobileRunner,
            social_runner_1.SocialRunner,
            legal_runner_1.LegalRunner,
            checks_seeder_1.ChecksSeeder,
        ],
        exports: [aggregator_service_1.AggregatorService],
    })
], ChecksModule);
//# sourceMappingURL=checks.module.js.map