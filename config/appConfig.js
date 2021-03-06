/**
 * @file This module provides the default configuration for usage in wdio configs.
 * Overriding is based on the convict library via loading JSON configs specified in the TEST_ENV variable.
 *
 * For instance, if you need to use Firefox capabilities instead of Chrome, you can create a new JSON config describing
 * only the capabilities section (there is safari.json config with an example of the approach).
 *
 */

const convict = require('convict');

/*
 This constant represents a custom capability that isn't rejected by the JS webdriver implementation.
 This capability is used to attach additional information to wdio capabilites, so the information can later be used
 when a new session is created for the given capability.
 */
const EXTRA_OPTIONS = 'extra:options';

const appConfig = convict({
    hostname: {
        doc: 'The hostname of the Selenium instance',
        format: 'url',
        default: 'localhost',
        env: 'SELENIUM_HOST',
    },
    perfRuns: {
        doc: 'The number of runs before collecting performance metrics',
        format: Number,
        default: 5,
        env: 'PERF_RUNS',
    },
    perfCycles: {
        doc: 'The number of cycles of collecting performance metrics',
        format: Number,
        default: 3,
        env: 'PERF_CYCLES',
    },
    protocol: {
        doc: 'The protocol being used to connect to the Selenium instance',
        format: String,
        default: 'http',
        env: 'SELENIUM_PROTOCOL',
    },
    webDriverProtocol: {
        doc: 'The type of a WebDriver protocol to be used by WDIO. It is either w3c or localChrome',
        format: String,
        default: '',
        env: 'WEBDRIVER_PROTOCOL',
    },
    port: {
        doc: 'The port being used to connect to the Selenium instance',
        format: 'port',
        default: 4444,
        env: 'SELENIUM_PORT',
    },
    path: {
        doc: 'The path being used to connect to the Selenium instance',
        format: String,
        default: '/wd/hub',
        env: 'SELENIUM_PATH',
    },
    exclude: {
        doc: 'Patterns of the tests that need to be excluded from test execution',
        format: Array,
        default: [],
        env: 'EXCLUDE',
    },
    logLevel: {
        doc: 'The required test execution log level',
        format: String,
        default: 'verbose',
        env: 'LOG_LEVEL',
    },
    env: {
        doc: 'The application environment',
        format: String,
        default: '',
        env: 'TEST_ENV',
    },
    baseUrl: {
        doc: 'The application base URL',
        format: 'url',
        default: 'http://3.17.120.50/',
        env: 'BASE_URL',
    },
    maxInstances: {
        doc: 'The number of capabilities to run in parallel',
        format: Number,
        default: 1,
        env: 'MAX_INSTANCES',
    },
    geos: {
        doc: 'The list of geos to be tested',
        format: Array,
        default: ['en_US'],
        env: 'GEOS',
    },
    capabilities: {
        doc: 'Sets of WebDriver capabilities',
        format: Array,
        default: [
            {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    // to run chrome headless the following flags are required
                    // (see https://developers.google.com/web/updates/2017/04/headless-chrome)
                    // args: ['--headless', '--disable-gpu'],//
                    args: ['–-enable-precise-memory-info', '--js-flags=--expose-gc'],
                },
                [EXTRA_OPTIONS]: {},
            },
        ],
    },
});

const env = appConfig.get('env');

if (env) {
    appConfig.loadFile('./config/' + env + '.json');
}

appConfig.validate({ allowed: 'strict' });

module.exports = {
    appConfig,
    EXTRA_OPTIONS,
};
