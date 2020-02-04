import { GlobalNav } from '../../common/GlobalNav';
import { PageWithForm } from '../../common/PageWithForm';
import { HeroSection } from './components/HeroSection';

/**
 * Represents page with form.
 * @extends PageWithForm
 */
export class HomePage extends PageWithForm {
    constructor() {
        super(`/`, 'HOME_PAGE');
    }

    /**
     * @return {GlobalNav} The global nav element object.
     */
    get globalNav() {
        return new GlobalNav($('#app header#site-header'));
    }

    /**
     * @return {HeroSection} The hero section element object.
     */
    get hero() {
        return new HeroSection($('section#app div.home-section'));
    }

    get herosImage() {
        return this.hero.herosImage;
    }

    get herosGallery() {
        return this.hero.heroGallery;
    }

    getHeroSlideOne(name) {
        return this.hero.getGallerySlide(name);
    }

    get globalNavLogo() {
        return this.globalNav.logo;
    }

    get globalNavLogoSource() {
        return this.globalNav.logoSource;
    }
}
