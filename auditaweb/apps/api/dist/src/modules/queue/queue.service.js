"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var QueueService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = void 0;
const common_1 = require("@nestjs/common");
let QueueService = QueueService_1 = class QueueService {
    queue = [];
    isProcessing = false;
    logger = new common_1.Logger(QueueService_1.name);
    add(job) {
        this.queue.push(job);
        this.processNext();
    }
    async processNext() {
        if (this.isProcessing || this.queue.length === 0)
            return;
        this.isProcessing = true;
        const job = this.queue.shift();
        if (job) {
            try {
                await job();
            }
            catch (err) {
                this.logger.error('Job failed', err);
            }
        }
        this.isProcessing = false;
        this.processNext();
    }
};
exports.QueueService = QueueService;
exports.QueueService = QueueService = QueueService_1 = __decorate([
    (0, common_1.Injectable)()
], QueueService);
//# sourceMappingURL=queue.service.js.map