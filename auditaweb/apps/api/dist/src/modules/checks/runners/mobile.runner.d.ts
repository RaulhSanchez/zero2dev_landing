import { CheckContext, CheckRunner, Finding } from '../interfaces';
export declare class MobileRunner implements CheckRunner {
    code: string;
    category: string;
    run(ctx: CheckContext): Promise<Finding[]>;
}
