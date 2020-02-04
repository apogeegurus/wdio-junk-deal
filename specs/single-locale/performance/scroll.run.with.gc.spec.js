import { homePageBefore, scrollFlow } from '../../../specs/code-templates/performance/scroll.flow';
import { performanceRunsWithGc } from '../../../specs/code-templates/performance/performance.run.with.gc';
import { appConfig } from '../../../config/appConfig';

performanceRunsWithGc(
    'Scroll Flow',
    appConfig.get('perfRuns'),
    appConfig.get('perfCycles'),
    5,
    5,
    homePageBefore,
    scrollFlow
);
