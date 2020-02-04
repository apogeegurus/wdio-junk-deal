import { assert } from 'chai';
import { HomePage } from '../../../src/app/pages/home-page/HomePage';
import { HomePageDataProvider } from '../../../src/data-providers/HomePageDataProvider';

const expectedData = new HomePageDataProvider();
const quoteForm = {
    name: 'Levon',
    phone: '9909909909',
    email: 'levon@gmail.com',
    zip: '98234',
    description: 'Happy Birthday Dog!',
};

describe('Home Page Checks', function() {
    before(function() {
        this.page = new HomePage();
        this.page.open();
        browser.pause(1000);
    });
    it('Get landing page title', function() {
        assert.equal(browser.getTitle(), 'Junk Deals - Home');
    });

    describe(`Check Global Nav items`, function() {
        it('Logo is displayed', function() {
            assert.isTrue(this.page.globalNavLogo.isDisplayed());
        });

        // it('Hero Slide one is displayed', function() {
        //     assert.isTrue(this.page.getHeroSlideOne('slider-1').isDisplayed());
        // });

        // it('Hero Slide two is displayed', function() {
        //     assert.isTrue(this.page.getHeroSlideOne('slider-2').isDisplayed());
        // });
    });

    describe(`Check Heros image and slides`, function() {
        it('Heros image is displayed', function() {
            assert.isTrue(this.page.herosImage.isDisplayed());
        });

        it('Slide one is displayed', function() {
            assert.isTrue(this.page.getHeroSlideOne().isDisplayed());
        });

        it('Slide two is displayed', function() {
            assert.isTrue(this.page.getHeroSlideOne().isDisplayed());
        });
    });

    describe('Quote form and its items are displayed', function() {
        before(function() {
            this.page.quoteForm.waitForDisplayed(2000);
            assert.isTrue(this.page.quoteForm.isDisplayed());
        });
        it('Header is displayed', function() {
            assert.isTrue(this.page.formHeading.isDisplayed());
        });

        it(`Header reads ${expectedData.getFormHeaderText()}`, function() {
            assert.equal(this.page.formHeading.getText(), expectedData.getFormHeaderText());
        });

        it('Name field is displayed', function() {
            assert.isTrue(this.page.formNameField.isDisplayed());
        });

        it('Phone number field is displayed', function() {
            assert.isTrue(this.page.formPhoneNumberField.isDisplayed());
        });

        it('Email field is displayed', function() {
            assert.isTrue(this.page.formEmailField.isDisplayed());
        });

        it('Zip field is displayed', function() {
            assert.isTrue(this.page.formZipField.isDisplayed());
        });

        it('Date picker is displayed', function() {
            assert.isTrue(this.page.formDatePicker.isDisplayed());
        });

        it('Text area field is displayed', function() {
            assert.isTrue(this.page.formTextArea.isDisplayed());
        });
    });

    describe(`Type shit into quote form fields and submit`, function() {
        it(`Type ${quoteForm.name} into name field`, function() {
            this.page.formNameField.setValue(quoteForm.name);
        });

        it(`Type ${quoteForm.phone} into phone number field`, function() {
            this.page.formPhoneNumberField.setValue(quoteForm.phone);
        });

        it(`Type ${quoteForm.email} into email field`, function() {
            this.page.formEmailField.setValue(quoteForm.email);
        });

        it(`Type ${quoteForm.zip} into zip code field`, function() {
            this.page.formZipField.setValue(quoteForm.zip);
        });

        it(`Type ${quoteForm.description} into description field`, function() {
            this.page.formTextArea.setValue(quoteForm.description);
            browser.pause(2000);
        });
    });
});
