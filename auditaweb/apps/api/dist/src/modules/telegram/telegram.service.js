"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
let TelegramService = TelegramService_1 = class TelegramService {
    logger = new common_1.Logger(TelegramService_1.name);
    token = process.env.TELEGRAM_BOT_TOKEN;
    chatId = process.env.TELEGRAM_CHAT_ID;
    async sendMessage(text) {
        if (!this.token || !this.chatId) {
            this.logger.warn('TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set. Skipping Telegram notification.');
            return;
        }
        try {
            const url = `https://api.telegram.org/bot${this.token}/sendMessage`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.chatId,
                    text,
                    parse_mode: 'HTML',
                }),
            });
            if (!response.ok) {
                throw new Error(`Telegram API responded with status ${response.status}`);
            }
            this.logger.log('Telegram notification sent');
        }
        catch (e) {
            this.logger.error('Failed to send Telegram notification', e);
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)()
], TelegramService);
//# sourceMappingURL=telegram.service.js.map