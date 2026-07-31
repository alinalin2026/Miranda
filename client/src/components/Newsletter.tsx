/**
 * Newsletter Section
 * Design: Warm, inviting call-to-action with gradient background
 * - Email signup form
 * - Benefit messaging
 */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="container max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Get My Latest Reviews
            </h2>
            <p className="text-lg text-foreground/70">
              Subscribe to my newsletter and never miss a product recommendation. I share honest insights, exclusive finds, and special offers—no spam, just quality.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
              />
              <Button
                type="submit"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-semibold whitespace-nowrap"
              >
                Subscribe
              </Button>
            </div>

            {/* Success message */}
            {submitted && (
              <p className="text-sm text-primary font-semibold animate-pulse">
                ✓ Thank you! Check your email for a welcome gift.
              </p>
            )}

            {/* Privacy note */}
            <p className="text-xs text-foreground/50">
              I respect your privacy. Unsubscribe anytime. No spam, ever.
            </p>
          </form>

          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-6 pt-8 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-2">📧</p>
              <p className="text-sm font-semibold text-foreground">
                Weekly Picks
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Curated recommendations
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-2">🎁</p>
              <p className="text-sm font-semibold text-foreground">
                Exclusive Deals
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                Subscriber-only offers
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary mb-2">🔍</p>
              <p className="text-sm font-semibold text-foreground">
                Early Access
              </p>
              <p className="text-xs text-foreground/60 mt-1">
                New reviews first
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
