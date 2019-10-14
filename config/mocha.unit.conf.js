const { createFolders } = require('../src/utils/initFunctions');

createFolders(['./test-results']);

module.exports = {
    spec: ['specs/unit'],
    reporter: 'mocha-multi-reporters',
    ['reporter-options']: 'configFile=./config/multi.reporter.config.json',
    require: '@babel/register',
    recursive: true,
};
