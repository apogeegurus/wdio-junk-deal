import { HomePage } from '../../../src/app/pages/home-page/HomePage';
import { getHomePage } from '../../../src/app/common/instantiatePage';

/**
 * Actions that need to be performed in the main before() block.
 */
export function homePageBefore() {
    const page = new HomePage();
    page.open();
    browser.pause(1000);
}

export function scrollFlow() {
    const page = getHomePage();
    page.gradualScrollTo('bottom');
    page.gradualScrollTo('top');
}

// const scrollDown = function() {
//     const page = instantiatePage()
//     for (let i = 0; i < 10; i++) {
//         page.scrollByWithinWindow(0, 100);
//         browser.pause(100)
//     }
// }
