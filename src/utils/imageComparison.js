/**
 * @file This module provides basic functionality for image comparison checks.
 */

import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs';
import { logger } from './logger';

/**
 * Is used to take a screenshot of a DOM element wrapped into the Component class.
 * To avoid naming collision, a timestamp is used as the name of a new screenshot file.
 *
 * @param {Component} component An element of the rendered DOM.
 * @return {string} The name of the generated screenshot file.
 */
export function takeScreenshot(component) {
    const screenPath = `./test-results/${new Date().getTime()}.png`;
    logger.verbose(`Taking screenshot of '${component.element.selector}' and saving to ${screenPath}`);
    component.element.saveScreenshot(screenPath);
    return screenPath;
}

/**
 * Is used to compare two PNG images.
 *
 * @param {string} pathA A path to the first image.
 * @param {string} pathB A path to the second image.
 * @param {object} options An object containing pixelmatch options (https://github.com/mapbox/pixelmatch).
 * @return {boolean} true if images are identical, false otherwise.
 */
export function compareImages(pathA, pathB, options) {
    logger.verbose(`Comparing images '${pathA}' and '${pathB}' with options '${JSON.stringify(options, null, 2)}'`);
    const image1 = PNG.sync.read(fs.readFileSync(pathA));
    const image2 = PNG.sync.read(fs.readFileSync(pathB));
    const { width, height } = image1;
    const diff = new PNG({ width, height });
    const result = pixelmatch(image1.data, image2.data, diff.data, width, height, options);
    if (result) {
        const diffFile = `./test-results/${new Date().getTime()}.diff.png`;
        logger.error(
            `Image comparison failed. Number of failed pixels is '${result}'. Visual difference is written to '${diffFile}'`
        );
        fs.writeFileSync(diffFile, PNG.sync.write(diff));
        return false;
    }
    return true;
}
