/**
 * Featured Reviews Section
 * Design: Card-based layout with subtle shadows and hover effects
 * - Review preview cards
 * - Star ratings
 * - Call-to-action buttons
 */

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Link } from "wouter";

const reviews = [
  {
    id: 1,
    slug: "luxury-skincare",
    title: "Luxury Skincare That Actually Works",
    category: "Beauty & Skincare",
    rating: 5,
    excerpt:
      "After testing this serum for 8 weeks, I'm genuinely impressed. The results are visible, and it doesn't irritate my sensitive skin.",
    image: "bg-gradient-to-br from-rose-100 to-pink-100",
    color: "text-rose-600",
  },
  {
    id: 2,
    slug: "coffee-maker",
    title: "The Best Coffee Maker for Home Baristas",
    category: "Kitchen & Appliances",
    rating: 4.5,
    excerpt:
      "Consistent espresso shots, intuitive controls, and beautiful design. This machine has elevated my morning routine.",
    image: "bg-gradient-to-br from-amber-100 to-orange-100",
    color: "text-amber-600",
  },
  {
    id: 3,
    slug: "premium-bedding",
    title: "Premium Bedding That Changed My Sleep",
    category: "Home & Wellness",
    rating: 5,
    excerpt:
      "Silk pillowcases, Egyptian cotton sheets—the investment paid off. I'm sleeping better and my skin thanks me.",
    image: "bg-gradient-to-br from-blue-100 to-cyan-100",
    color: "text-blue-600",
  },
];

export default function FeaturedReviews() {
  return (
    <section id="reviews" className="py-20 md:py-32 bg-gradient-to-b from-white to-primary/5">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            My Latest Reviews
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Carefully Curated Recommendations
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Discover the products I'm genuinely excited about this season
          </p>
        </div>

        {/* Review cards grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image placeholder */}
              <div className={`h-48 ${review.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Category */}
                <p className={`text-xs font-semibold uppercase tracking-wide ${review.color}`}>
                  {review.category}
                </p>

                {/* Title */}
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {review.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={
                          i < Math.floor(review.rating)
                            ? "fill-primary text-primary"
                            : i < review.rating
                              ? "fill-primary/50 text-primary"
                              : "text-muted"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground/70">
                    {review.rating}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {review.excerpt}
                </p>

                {/* CTA */}
                <Link href={`/review/${review.slug}`}>
                  <a>
                    <Button
                      variant="ghost"
                      className="w-full text-primary hover:bg-primary/10 font-semibold mt-4"
                    >
                      Read Full Review →
                    </Button>
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View all button */}
        <div className="text-center">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white font-semibold"
          >
            Explore All Reviews
          </Button>
        </div>
      </div>
    </section>
  );
}
