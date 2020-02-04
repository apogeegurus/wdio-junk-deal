import { Section } from './Section';

/**
 * @extends Section
 */

export class GlobalNav extends Section {
    get logo() {
        return this.element.$('nav a img');
    }

    get logoSource() {
        return this.navLogo.getAttribute('src');
    }

    get navPhone() {
        return this.element.$('.slideshow');
    }

    getNavItems(name) {
        return this.heroGallery
            .$$('div#slideshow img')
            .find(slide => slide.getAttribute('src').includes(name) && slide.getAttribute('class').includes('fx'));
    }
}
