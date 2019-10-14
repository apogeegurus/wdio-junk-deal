import { logger } from '../../utils/logger';

/**
 * The base class for implementing the POM pattern https://webdriver.io/docs/pageobjects.html.
 * All pages of the application should extend from this class.
 */
export class Page {
    /**
     * @param {string} url The URL of the generated page.
     * @param {string} type The type of the generated page. Is used as a unique page type ID.
     * @param {Object} options An object containing extra parameters that can be use inside the class.
     */
    constructor(url, type, options) {
        this.url = url;
        this.type = type;
        this.options = options;
    }

    /**
     * This methods opens the page in a browser. Is used to setup additional browser properties, and perform other
     * extra actions.
     */
    open() {
        browser.url(this.url);
    }

    /**
     * Is used to get the page type defined in Page children constructors.
     *
     * @return {string}
     */
    getType() {
        return this.type;
    }

    /**
     *
     * @return {string} The title of the page from the DOM.
     */
    getPageTitle() {
        return browser.getTitle();
    }

    /**
     * This method implements scrolling by pixels within a given body element, which isn't supported by WebdriverIO
     * by default.
     *
     * @param {string} selector Specifies the element for scrolling.
     * @param {number} x The pixel shift by the X axis.
     * @param {menubar} y The pixel shift by the Y axis.
     */
    scrollByWithinBodyElement(selector, x, y) {
        logger.debug(`Scrolling within element '${selector}' by x='${x}' and y='${y}' pixels`);
        browser.execute(
            function(selector, x, y) {
                document.body.querySelector(selector).scrollBy(x, y);
            },
            selector,
            x,
            y
        );
    }

    /**
     * This method implements scrolling by pixels within the given window, which isn't supported by WebdriverIO
     * by default.
     *
     * @param {number} x The pixel shift by the X axis.
     * @param {number} y The pixel shift by the Y axis.
     */
    scrollByWithinWindow(x, y) {
        logger.debug(`Scrolling within browser window by x='${x}' and y='${y}' pixels`);
        browser.execute(
            function(x, y) {
                window.scrollBy(x, y);
            },
            x,
            y
        );
    }

    /*
     * Verifies that the give element is located within the viewport.
     *
     * @param {WebdriverIO.Element} element The element to be verified.
     * @return {boolean} true Returns 'true' if the element is inside the viewport, 'false' otherwise.
     */
    isDisplayedInViewport(element) {
        const { width, height } = browser.getWindowSize();
        const elementX = element.getLocation('x');
        const elementY = element.getLocation('y');
        const elementWidth = element.getSize('width');
        const elementHeight = element.getSize('height');
        return (
            elementX + elementWidth > 0 &&
            elementX + elementWidth < width &&
            elementY + elementHeight > 0 &&
            elementY + elementHeight < height
        );
    }
}
