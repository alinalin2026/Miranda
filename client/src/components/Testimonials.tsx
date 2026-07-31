/**
 * Testimonials Section
 * Design: Social proof with reader testimonials and media mentions
 * - Reader quotes with avatars
 * - Media mentions and brand partnerships
 * - Trust indicators
 */

import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah M.",
    role: "Verified Reader",
    quote:
      "Miranda's reviews are the only ones I trust. She's honest about what works and what doesn't. I've saved so much money following her recommendations.",
    rating: 5,
    avatar: "SM",
  },
  {
    id: 2,
    name: "Jessica L.",
    role: "Verified Reader",
    quote:
      "Finally, a reviewer who gets it. No sponsored nonsense, just real talk about products. Miranda changed how I shop.",
    rating: 5,
    avatar: "JL",
  },
  {
    id: 3,
    name: "Maria G.",
    role: "Verified Reader",
    quote:
      "As a busy mom, I don't have time to test everything. Miranda does it for me. Her skincare recommendations are life-changing.",
    rating: 5,
    avatar: "MG",
  },
];

const mediaLogos = [
  { name: "Forbes", color: "text-slate-700" },
  { name: "Vogue", color: "text-slate-700" },
  { name: "The New York Times", color: "text-slate-700" },
  { name: "Cosmopolitan", color: "text-slate-700" },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            Trusted by Readers & Brands
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            What People Are Saying
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of readers who rely on Miranda's honest, expert reviews
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gradient-to-br from-primary/5 to-primary/0 rounded-xl p-8 space-y-4 border border-primary/10 hover:border-primary/30 transition-colors"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-foreground/80 italic leading-relaxed">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-primary/10">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media mentions */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <p className="text-sm font-semibold text-foreground/60 uppercase tracking-wide">
              Featured In
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {mediaLogos.map((media) => (
                <div key={media.name} className="text-center">
                  <p className={`font-bold text-lg ${media.color}`}>
                    {media.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Trust metrics */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-8 md:p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-primary mb-2">500K+</p>
                <p className="text-sm text-foreground/70">
                  Readers Worldwide
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">4.9★</p>
                <p className="text-sm text-foreground/70">Average Rating</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">200+</p>
                <p className="text-sm text-foreground/70">Products Reviewed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">15+</p>
                <p className="text-sm text-foreground/70">Years of Expertise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
