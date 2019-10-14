import { getRandomNumber } from '../../../src/utils/helpers';
import { assert } from 'chai';

describe('Random numbers generator', function() {
    const MAX_NUMBERS = [10, 100, 1000];

    MAX_NUMBERS.forEach(function(number) {
        const randomNumber = getRandomNumber(number);

        describe(`Checking generation for maxNumber='${number}'`, function() {
            it('Random number is above than  -1', function() {
                assert.isAtLeast(randomNumber, 0);
            });

            it(`Random number is below than '${number}'`, function() {
                assert.isBelow(randomNumber, number);
            });
        });
    });

    it('Random number for maxNumber=0 is 0', function() {
        assert.equal(getRandomNumber(0), 0);
    });
});
