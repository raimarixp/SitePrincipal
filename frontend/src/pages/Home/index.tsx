import { HeroCarousel } from '../../components/sections/HeroCarousel';
import { ValueProposition } from '../../components/sections/ValueProposition';
import { FeaturedProducts } from '../../components/sections/ProductsSection/FeaturedProducts';
import { AboutSection } from '../../components/sections/AboutSection';
import { Testimonials } from '../../components/sections/Testimonials';
import { ContactCTA } from '../../components/sections/ContactSection/ContactCTA';

export const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroCarousel />
      <ValueProposition />
      <AboutSection /> {/* Inverti para contar a história antes dos produtos, ou pode ser depois */}
      <FeaturedProducts />
      <Testimonials />
      <ContactCTA />
    </div>
  );
};