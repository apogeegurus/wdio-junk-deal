/**
 * @file This module contains helper functions and classes that don't require a separate file.
 */

/**
 * Returns a random number from the range 0..(maxNumber - 1).
 *
 * @param {number} maxNumber Limits the highest possible number from the range of random numbers.
 * @return {number} A random number from the given range.
 */
export function getRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
}
