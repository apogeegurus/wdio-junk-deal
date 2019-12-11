import { logger } from './logger';

/**
 * @file This file contains a couple of objects implementing gestures that can be executed in a browser.
 *
 * One of the objects uses the w3c webdriver API (performActions, releaseActions) to support remote execution
 * in Selenium Grid, because WDIO uses w3c to communicate with Selenium. Unfortunately, w3c isn't supported by
 * some browsers when running locally (for instance, Chrome), so browser-specific implementations are also required.
 *
 * The other object is designed for local Chrome execution and uses an API which isn't w3c compatible.
 */

/**
 * Contains a set of methods implementing various gestures that can be executed in Selenium Grid.
 */
export const w3cBrowser = {
    /**
     * Performs a swipe using the given coordinates.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     * @param {number} yEnd The end y position.
     */
    swipeFromTo: function(xStart, yStart, xEnd, yEnd) {
        logger.verbose(`Swiping from x='${xStart}', y='${yStart}' to x='${xEnd}', y='${yEnd}'`);
        browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: Math.round(xStart), y: Math.round(yStart) },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 50, x: Math.round(xEnd), y: Math.round(yEnd) },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        browser.releaseActions();
    },

    /**
     * Performs a drug and drop using the given coordinates.
     *
     * The ordinary swipe doesn't work because Hammer has a specific check for drag actions. This is why the drag action
     * includes multiple movements between buttonDown and buttonUp.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     * @param {number} yEnd The end y position.
     */
    dragFromTo(xStart, yStart, xEnd, yEnd) {
        logger.verbose(`Dragging from x='${xStart}', y='${yStart}' to x='${xEnd}', y='${yEnd}'`);
        const xStartRound = Math.round(xStart);
        const yStartRound = Math.round(yStart);
        const xEndRound = Math.round(xEnd);
        const yEndRound = Math.round(yEnd);
        const xMiddle = xStartRound === xEndRound ? xStartRound : Math.round((xStart + xEnd) / 2);
        const yMiddle = yStartRound === yEndRound ? yStartRound : Math.round((yStart + yEnd) / 2);
        logger.debug(`xMiddle: '${xMiddle}', yMiddle: '${yMiddle}'`);
        browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: xStartRound, y: yStartRound },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pause', duration: 50 },
                    { type: 'pointerMove', duration: 50, x: xMiddle, y: yMiddle },
                    { type: 'pointerMove', duration: 50, x: xEndRound, y: yEndRound },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        browser.releaseActions();
    },

    /**
     * Performs a horizontal drug and drop using the given coordinates.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     */
    horizontalDragFromTo: function(xStart, yStart, xEnd) {
        this.dragFromTo(xStart, yStart, xEnd, yStart);
    },

    /**
     * Performs a vertical drug and drop using the given coordinates.
     *
     * @param {number} yStart The start y position.
     * @param {number} xStart The start x position.
     * @param {number} yEnd The end y position.
     */
    verticalDragFromTo: function(yStart, xStart, yEnd) {
        this.dragFromTo(xStart, yStart, xStart, yEnd);
    },

    /**
     * Performs a click in the given position.
     *
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    clickInPosition: function(x, y) {
        logger.verbose(`Clicking in position x='${x}', y='${y}'`);
        browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'mouse' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: Math.round(x), y: Math.round(y) },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
        browser.releaseActions();
    },
};

/**
 * Contains a set of methods implementing various gestures that can be executed in Chrome locally.
 */
export const localChrome = {
    /**
     * Performs a swipe using the given coordinates.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     * @param {number} yEnd The end y position.
     */
    swipeFromTo: function(xStart, yStart, xEnd, yEnd) {
        logger.verbose(`Swiping from x='${xStart}', y='${yStart}' to x='${xEnd}', y='${yEnd}'`);
        const body = $('body');
        body.moveTo(Math.round(xStart), Math.round(yStart));
        browser.buttonDown(0);
        browser.pause(50); // Touch delay imitation.
        body.moveTo(Math.round(xEnd), Math.round(yEnd));
        browser.buttonUp();
    },

    /**
     * Performs a drug and drop using the given coordinates.
     *
     * The ordinary swipe doesn't work because Hammer has a specific check for drag actions. This is why the drag action
     * includes multiple movements between buttonDown and buttonUp.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     * @param {number} yEnd The end y position.
     * @param {number} steps The number of moves within the drag action.
     * @param {number} pause The delay between moves.
     */
    dragFromTo(xStart, yStart, xEnd, yEnd, steps = 30, pause = 2) {
        logger.verbose(`Dragging from x='${xStart}', y='${yStart}' to x='${xEnd}', y='${yEnd}'`);
        logger.verbose(`Steps count='${steps}' and pause='${pause}'`);
        const xStartRound = Math.round(xStart);
        const yStartRound = Math.round(yStart);
        const xEndRound = Math.round(xEnd);
        const yEndRound = Math.round(yEnd);
        const xStep = Math.round((Math.abs(xStartRound - xEndRound) / steps) * (xStartRound < xEndRound ? 1 : -1));
        const yStep = Math.round((Math.abs(yStartRound - yEndRound) / steps) * (yStartRound < yEndRound ? 1 : -1));
        logger.debug(`X step size='${xStep}'`);
        logger.debug(`Y step size='${yStep}'`);
        const body = $('body');
        body.moveTo(xStartRound, yStartRound);
        browser.buttonDown(0);
        browser.pause(50); // Touch delay imitation.
        let xPosition = xStartRound;
        let yPosition = yStartRound;
        for (let i = 0; i < steps - 1; i++) {
            xPosition += xStep;
            yPosition += yStep;
            body.moveTo(xPosition, yPosition);
            browser.pause(pause);
        }
        body.moveTo(xEndRound, yEndRound);
        browser.buttonUp(1);
    },

    /**
     * Performs a horizontal drug and drop using the given coordinates.
     *
     * @param {number} xStart The start x position.
     * @param {number} yStart The start y position.
     * @param {number} xEnd The end x position.
     */
    horizontalDragFromTo: function(xStart, yStart, xEnd) {
        this.dragFromTo(xStart, yStart, xEnd, yStart);
    },

    /**
     * Performs a vertical drug and drop using the given coordinates.
     *
     * @param {number} yStart The start y position.
     * @param {number} xStart The start x position.
     * @param {number} yEnd The end y position.
     */
    verticalDragFromTo: function(yStart, xStart, yEnd) {
        this.dragFromTo(xStart, yStart, xStart, yEnd);
    },

    /**
     * Performs a click in the given position.
     *
     * @param {number} x The x coordinate.
     * @param {number} y The y coordinate.
     */
    clickInPosition: function(x, y) {
        logger.verbose(`Clicking in position x='${x}', y='${y}'`);
        const body = $('body');
        body.moveTo(x, y);
        browser.positionClick(0);
    },
};
