/**
 * About Miranda Section
 * Design: Warm, authentic storytelling with credentials
 * - Personal narrative
 * - Professional background
 * - Credentials and expertise
 */

export default function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <img
              src="/manus-storage/miranda_hero_1_5f9781bc.png"
              alt="Miranda Rodríguez"
              className="w-full rounded-2xl shadow-xl"
            />
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            {/* Section header */}
            <div className="space-y-4">
              <p className="text-primary font-semibold text-sm uppercase tracking-wide">
                About Me
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Miranda Rodríguez
              </h2>
              <p className="text-lg text-foreground/70 italic">
                Lifestyle Expert & Trusted Product Reviewer
              </p>
            </div>

            {/* Story */}
            <div className="space-y-6 text-foreground/80">
              <p>
                I'm Miranda, a 40-year-old product reviewer and lifestyle expert based in Los Angeles. For over 15 years, I've dedicated my career to helping people make smarter purchasing decisions. What started as a personal blog sharing honest product reviews has grown into a trusted resource for over 500,000 readers worldwide.
              </p>
              <p>
                As a proud Latina entrepreneur, I bring a unique perspective to the world of product reviews. I believe in authenticity, quality, and real-world practicality. I don't review products because brands pay me—I review them because I genuinely believe they deserve your attention (or your skepticism).
              </p>
              <p>
                My approach is simple: I test everything myself, I'm transparent about what works and what doesn't, and I prioritize your needs over marketing hype. Whether it's skincare, home essentials, technology, or wellness products, I'm here to cut through the noise and give you the truth.
              </p>
            </div>

            {/* Credentials */}
            <div className="space-y-4 pt-8 border-t border-border">
              <h3 className="text-xl font-semibold text-foreground">
                Credentials & Recognition
              </h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">
                    Featured in Forbes, Vogue, and The New York Times
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">
                    Certified Product Testing Specialist
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">
                    15+ years of professional product evaluation experience
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">
                    Trusted advisor to 500K+ global readers
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span className="text-foreground/80">
                    Member of the International Product Review Association
                  </span>
                </li>
              </ul>
            </div>

            {/* Values */}
            <div className="bg-primary/5 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground">My Core Values</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold text-primary mb-1">Honesty</p>
                  <p className="text-sm text-foreground/70">
                    No sponsored content, no bias—just truth
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Quality</p>
                  <p className="text-sm text-foreground/70">
                    I only recommend products I truly believe in
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Inclusivity</p>
                  <p className="text-sm text-foreground/70">
                    Reviews for all budgets and lifestyles
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Expertise</p>
                  <p className="text-sm text-foreground/70">
                    Deep knowledge across product categories
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
