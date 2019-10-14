import { assert } from 'chai';

describe('Sample suite opening Today at Apple', function() {
    it('Get landing page title', function() {
        browser.url(`/today`);
        browser.pause(1000);
        assert.equal(browser.getTitle(), 'Today at Apple - Apple');
    });
});
