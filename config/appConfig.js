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
    env: {
        doc: 'The application environment',
        format: String,
        default: '',
        env: 'TEST_ENV',
    },
    baseUrl: {
        doc: 'The application base URL',
        format: 'url',
        default: 'https://www.apple.com',
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
                    // args: ['--headless', '--disable-gpu'],
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
