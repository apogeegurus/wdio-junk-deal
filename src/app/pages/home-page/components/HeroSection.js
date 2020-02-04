import { Section } from '../../../common/Section';

/**
 * @extends Section
 */

export class HeroSection extends Section {
    get herosImage() {
        return this.element.$('img.home-heroes.d-none.d-lg-block');
    }

    get heroGallery() {
        return this.element.$('.slideshow');
    }

    getGallerySlide() {
        return this.heroGallery
            .$$('div#slideshow img')
            .find(slide => /* slide.getAttribute('src').includes(name) &&*/ slide.getAttribute('class').includes('fx'));
    }
}
