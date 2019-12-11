/**
 * @file This module provides functions that can be used in hooks of wdio configs.
 */

const request = require('request');
const fs = require('fs');

/**
 * Verifies that given services are available on the given URLs.
 *
 * @param {Object[]} services An array of objects describing the service that need to be checked.
 * @param {string} services[].name The name of a service that will be printed out to stdout.
 * @param {string} services[].url The URL of a service that will checked.
 */
function servicesHealthCheck(services) {
    console.log(`Performing health check for services: '${services.map(x => x.name)}'`);
    services.forEach(service => {
        request(
            {
                url: service.url,
                method: 'GET',
            },
            (error, response) => {
                if (error || response.statusCode !== 200) {
                    console.error(`'${service.name}' isn't available on ${service.url}\n`);
                    process.exit(-1);
                }
            }
        );
    });
}

/**
 * Creates directories in the current work folder.
 *
 * @param {string[]} folders An array of folders that need to be created.
 */
function createFolders(folders) {
    console.log(`Creating necessary directories: '${folders}'`);
    folders.forEach(folder => {
        if (!fs.existsSync(folder)) {
            console.log(`'${folder}' does not exist. Creating...`);
            fs.mkdirSync(folder);
        }
    });
}

// This module uses the NodeJS module system, as the Mocha's wdio.conf.js file doesn't support ES6 imports.
module.exports = {
    servicesHealthCheck,
    createFolders,
};
