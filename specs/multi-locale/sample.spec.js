import { assert } from 'chai';

describe('Sample suite opening Today at Apple', function() {
    it('Get landing page title', function() {
        browser.url(`/today`);
        browser.pause(1000);

        // Printing out extra options assigned to capabilities.
        console.log(browser.extraOptions.geo);

        assert.equal(browser.getTitle(), 'Today at Apple - Apple');
    });
});
