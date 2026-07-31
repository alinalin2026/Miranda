/**
 * Hero Section
 * Design: Asymmetric layout with Miranda's portrait on the right
 * - Bold typography with Playfair Display
 * - Warm gradient overlay
 * - Generous whitespace
 */

import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />

      <div className="container grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Content */}
        <div className="space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold text-sm">
              ✓ Trusted Reviews
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Products I Actually
              <span className="block text-primary italic">Use Every Day</span>
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
              Honest, thoughtful reviews from someone who believes in quality over hype. Discover products that make real life better.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 hover:shadow-lg"
            >
              Explore Reviews
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold"
            >
              Learn About Me
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 pt-8 border-t border-border">
            <div>
              <p className="text-2xl font-bold text-foreground">500K+</p>
              <p className="text-sm text-foreground/60">Readers Worldwide</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">15+</p>
              <p className="text-sm text-foreground/60">Years of Expertise</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">200+</p>
              <p className="text-sm text-foreground/60">Products Reviewed</p>
            </div>
          </div>
        </div>

        {/* Right: Miranda's Image */}
        <div className="relative h-full min-h-96 md:min-h-full">
          {/* Image container with subtle shadow */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="/manus-storage/miranda_hero_2_7f51747c.png"
              alt="Miranda - Professional Product Reviewer"
              className="w-full h-full object-cover"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
          </div>

          {/* Floating accent card */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs">
            <p className="text-sm font-semibold text-primary mb-2">
              ⭐ Verified Expert
            </p>
            <p className="text-sm text-foreground/70">
              Trusted by leading brands and readers globally
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-primary/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </section>
  );
}
