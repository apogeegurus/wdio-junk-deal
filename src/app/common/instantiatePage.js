import { logger } from '../../utils/logger';

const urlPatterns = {
    YOUR_PAGE: /.*\/your.page.com\/$/, // Add patterns for pages of the SUT.
};

/**
 * Is used to return a page instance based on the URL of the opened page.
 *
 * @return {Object} An instance of the detected page.
 */
export function instantiatePage() {
    const url = browser.getUrl();
    logger.debug(`Instantiate new page with url='${url}'`);

    if (urlPatterns.YOUR_PAGE.test(url)) {
        /* Next lines need to updated to support pages of your SUT.

        const urlParts = url.split(urlPatterns.HAND_OFF);
        const sourcePageParts = urlParts[1].split('/');
        const collection = sourcePageParts[1] ? sourcePageParts[1] : '';
        logger.debug(
            `Detected 'HANDOFF' page from '${sourcePageParts[0]}' for collection='${collection}' with item='${
                urlParts[2]
            }' and selection='${urlParts[3]}'`
        );
        return new HandOff({
            sourcePage: sourcePageParts[0],
            collection: collection,
            item: urlParts[2],
            selection: urlParts[3],
            handOffType: urlParts[4],
        });
        */
        return {};
    }

    const errorMessage = `Couldn't detect correct page type for url='${url}'`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
}

/**
 * Is used to get a page instance and check that it has an expected type.
 * It's used in tests that switch between multiple pages.
 *
 * @param {string} pageType An available page type.
 * @return {Object} An instance of the detected page.
 */
function instantiateSpecificPage(pageType) {
    const page = instantiatePage();
    assert.equal(page.getType(), pageType);
    return page;
}

// Syntax sugar.

export function getYourPage() {
    return instantiateSpecificPage('YOUR_PAGE');
}
