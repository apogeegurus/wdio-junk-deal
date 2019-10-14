/**
 * The base class of all components on the application's pages.
 * It has only one variable 'element' that wraps WebdriverIO.Element.
 * By default, JS implicitly defines the constructor in all children classes.
 */
export class Component {
    constructor(element) {
        this.element = element;
    }

    /**
     * This method is used to get rid of usage of '.element' for isDisplayed() in tests.
     *
     * @return {boolean} True if the element is visible.
     */
    isDisplayed() {
        return this.element.isDisplayed();
    }

    /**
     * This method is used to get rid of usage of '.element' on Component objects for getText().
     *
     * @return {string}
     */
    getText() {
        return this.element.getText();
    }

    /**
     * This method is used to get rid of usage of '.element' on Component objects for click().
     */
    click() {
        this.element.click();
    }
}
