import { Page } from './Page';

/**
 * Represents a page with quote form
 * @extends Page
 */
export class PageWithForm extends Page {
    /**
     * @return {WebdriverIO.Element} The object of the form element displayed on on the hero.
     */
    get quoteForm() {
        return $('form#get-quote');
    }

    get formHeading() {
        return this.quoteForm.$('h3');
    }

    get formNameField() {
        return this.quoteForm.$('/html/body/section/div[1]/main/div/div[1]/div[2]/form/section/fieldset[1]/div/input');
    }

    get formPhoneNumberField() {
        return this.quoteForm.$('/html/body/section/div[1]/main/div/div[1]/div[2]/form/section/fieldset[2]/div/input');
    }

    get formEmailField() {
        return this.quoteForm.$('/html/body/section/div[1]/main/div/div[1]/div[2]/form/section/fieldset[3]/div/input');
    }

    get formZipField() {
        return this.quoteForm.$(
            '/html/body/section/div[1]/main/div/div[1]/div[2]/form/section/div[2]/div[1]/fieldset/div/input'
        );
    }

    get formDatePicker() {
        return this.quoteForm.$('div.vdp-datepicker');
    }

    get formTextArea() {
        return this.quoteForm.$(
            '/html/body/section/div[1]/main/div/div[1]/div[2]/form/section/fieldset[4]/div/textarea'
        );
    }

    /**
     * @return {number} The index of the active pagination pointer.
     */
    get activeScreenNumber() {
        return this.pagination.$$('.pagination-list__item').findIndex(x =>
            x
                .getAttribute('class')
                .split(' ')
                .includes('__active')
        );
    }
}
