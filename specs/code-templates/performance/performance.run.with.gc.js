import { assert } from 'chai';
import { logger } from '../../../src/utils/logger';

const mb = 1024 * 1024;

/**
 * Keeps information about performance metrics taken on creation.
 */
export class PerformanceMetrics {
    constructor() {
        const metrics = browser.execute('return window.performance.memory');
        this.limit = metrics.jsHeapSizeLimit / mb;
        this.total = metrics.totalJSHeapSize / mb;
        this.used = metrics.usedJSHeapSize / mb;
        logger.debug(
            `Performance stats: jsHeapSizeLimit='${this.limit}', totalJSHeapSize='${this.total}', usedJSHeapSize='${
                this.used
            }'`
        );
    }
}

/**
 * Keeps information about metrics difference for given test runs.
 */
class StatsDifference {
    constructor(currentRun, previousRun, total, used) {
        this.currentRun = currentRun;
        this.previousRun = previousRun;
        this.total = total;
        this.used = used;
    }
}

/**
 * Provides performance statistics about all recorded test executions.
 */
export class StatsCollection {
    constructor(name) {
        this.name = name;
        this.stats = [];
        this.diffs = [];
    }

    /**
     * Calculates performance statistics. Needs to be run before getting access to internal variables:
     *
     *  - totalFirstAndLast The difference of the total heap size between the first and last runs.
     *  - usedFirstAndLast The difference of the used heap size between the first and last runs.
     *  - maxTotal The maximal difference of the the total heap size between runs.
     *  - maxUsed The maximal difference of the used heap sized between runs.
     *  - acceptableTotal The acceptable difference in the total heap size between runs. Calculated with the given
     *    percentage based on measurements of the first run.
     *  - acceptableUsed The acceptable difference in the used heap size between runs. Calculated with the given
     *    percentage based on measurements of the first run.
     *
     * @param {integer} total The acceptable percentage of the total heap size difference.
     * @param {integer} used The acceptable percentage of the used heap size difference.
     */
    calculate(total, used) {
        if (this.stats.length === 1) {
            this.totalFirstAndLast = this.stats[0].total;
            this.usedFirstAndLast = this.stats[0].used;
            this.maxTotal = this.minTotal = this.stats[0].total;
            this.maxUsed = this.minUsed = this.stats[0].used;
        } else {
            const lastIndex = this.stats.length - 1;
            this.totalFirstAndLast = this.stats[lastIndex].total - this.stats[0].total;
            this.usedFirstAndLast = this.stats[lastIndex].used - this.stats[0].used;
            this.maxTotal = this.minTotal = this.stats[1].total - this.stats[0].total;
            this.maxUsed = this.minUsed = this.stats[1].used - this.stats[0].used;
            for (let i = 1; i < this.stats.length; i++) {
                const diff = new StatsDifference(
                    i,
                    i - 1,
                    this.stats[i].total - this.stats[i - 1].total,
                    this.stats[i].used - this.stats[i - 1].used
                );
                this.diffs.push(diff);
                if (diff.total > this.maxTotal) {
                    this.maxTotal = diff.total;
                }
                if (diff.total < this.minTotal) {
                    this.minTotal = diff.total;
                }
                if (diff.used > this.maxUsed) {
                    this.maxUsed = diff.used;
                }
                if (diff.used < this.minUsed) {
                    this.minUsed = diff.used;
                }
            }
        }
        this.acceptableTotal = (this.stats[0].total / 100) * total;
        this.acceptableUsed = (this.stats[0].used / 100) * used;
    }

    /**
     * @return {StatsDifference[]} The array of all stats that overreached the acceptable total heap size difference.
     */
    getFailedTotal() {
        return this.diffs.filter(x => x.total > this.acceptableTotal);
    }

    /**
     * @return {StatsDifference[]} The array of all stats that overreached the acceptable used heap size difference.
     */
    getFailedUsed() {
        return this.diffs.filter(x => x.used > this.acceptableUsed);
    }

    /**
     * @override
     * @return {string} A report on the collected performance statistics.
     */
    toString() {
        const allDiffs = this.diffs
            .map(x => {
                return `Difference between runs '${x.currentRun}' and '${x.previousRun}': total='${x.total}', used='${
                    x.used
                }'`;
            })
            .join('\n');
        return (
            `Performance statistics for '${this.name}':\n` +
            `Acceptable total heap size deviation: '${this.acceptableTotal}'\n` +
            `Acceptable used heap size deviation: '${this.acceptableUsed}'\n` +
            `Total heap size difference between first and last measurements: '${this.totalFirstAndLast}'\n` +
            `Used heap size difference between first and last measurements: '${this.usedFirstAndLast}'\n` +
            `MAX total heap size deviation: '${this.maxTotal}'\n` +
            `MAX used heap size deviation: '${this.maxUsed}'\n` +
            `MIN total heap size deviation: '${this.minTotal}'\n` +
            `MIN used heap size deviation: '${this.minUsed}'\n` +
            allDiffs
        );
    }
}

/**
 * This suite verifies performance metrics of an experience. The gc() function is called to simulate the real
 * application behavior.
 *
Steps:
 *
 * 1. Perform all required preliminary actions. Usually opening an experience for the first time.
 * 2. Executing the experience's flow the given number of times.
 * 3. Waiting for the timeout of 10 seconds.
 * 4. Running gc().
 * 5. Collecting performance statistics.
 * 6. Performing 2-5 the required number of times.
 * 7. Processing statistics.
 * 8. Checking if there are any violations in the total heap size.
 * 9. Checking if there are any violations in the used heap size.
 *
 * @param {string} name The name of the the experience to be tested.
 * @param {number} runs The number of runs before collecting performance metrics.
 * @param {number} cycles The number of cycles of collecting performance metrics.
 * @param {number} totalDelta The acceptable percentage of the total heap size difference.
 * @param {number} usedDelta The acceptable percentage of the used heap size difference.
 * @param {function} beforeActions The function containing steps that will be run once in the main before().
 * @param {function} flowActions The complete experience flow (or any other set of actions).
 */

export function performanceRunsWithGc(name, runs, cycles, totalDelta, usedDelta, beforeActions, flowActions) {
    const collectedStats = new StatsCollection(name);

    describe(`NAME ${name}`, function() {
        before(function() {
            beforeActions();
        });

        for (let i = 0; i < cycles; i++) {
            describe(`Collecting statistics for iteration '${i}'`, function() {
                before(function() {
                    for (let j = 0; j < runs; j++) {
                        flowActions(); // Executing the given experience's flow.
                    }
                    browser.pause(10000); // A cool down for the browser to release memory.
                    browser.execute('gc()');
                });

                it(`Collecting stats`, function() {
                    collectedStats.stats.push(new PerformanceMetrics());
                });
            });
        }

        it(`Collecting stats`, function() {
            collectedStats.stats.push(new PerformanceMetrics());
        });

        describe('Verifying statistics', function() {
            before(function() {
                collectedStats.calculate(totalDelta, usedDelta);
            });

            it(`Total heap size deviation is no more than '${totalDelta}'% `, function() {
                assert.deepEqual(
                    collectedStats.getFailedTotal(),
                    [],
                    `Total heap size deviation '${collectedStats.maxTotal}' is higher than '${
                        collectedStats.acceptableTotal
                    }'`
                );
            });

            it(`Used heap size deviation is no more than '${usedDelta}'%`, function() {
                assert.deepEqual(
                    collectedStats.getFailedUsed(),
                    [],
                    `Used heap size deviation '${collectedStats.maxUsed}' is higher than '${
                        collectedStats.acceptableUsed
                    }'`
                );
            });
        });
    });
}
