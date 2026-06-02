import { Finding } from '../interfaces';
import { LighthouseRunner } from '../runners/lighthouse.runner';
import { SeoRunner } from '../runners/seo.runner';
import { SeoAdvancedRunner } from '../runners/seo-advanced.runner';
import { SecurityRunner } from '../runners/security.runner';
import { MobileRunner } from '../runners/mobile.runner';
import { SocialRunner } from '../runners/social.runner';
import { LegalRunner } from '../runners/legal.runner';
export declare class AggregatorService {
    private readonly lighthouseRunner;
    private readonly seoRunner;
    private readonly seoAdvancedRunner;
    private readonly securityRunner;
    private readonly mobileRunner;
    private readonly socialRunner;
    private readonly legalRunner;
    private readonly logger;
    constructor(lighthouseRunner: LighthouseRunner, seoRunner: SeoRunner, seoAdvancedRunner: SeoAdvancedRunner, securityRunner: SecurityRunner, mobileRunner: MobileRunner, socialRunner: SocialRunner, legalRunner: LegalRunner);
    runAll(url: string): Promise<{
        findings: Finding[];
        scores: Record<string, number>;
        globalScore: number;
    }>;
}
