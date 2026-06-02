import { CheckContext, CheckRunner, Finding } from '../interfaces';
export declare class SeoAdvancedRunner implements CheckRunner {
    code: string;
    category: string;
    private readonly logger;
    run(ctx: CheckContext): Promise<Finding[]>;
}
