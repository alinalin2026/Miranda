/**
 * Product Review Page Template
 * Design: Detailed review layout with specs, pros/cons, and purchase links
 * - Product hero image
 * - Rating and verdict
 * - Detailed review content
 * - Specifications table
 * - Pros and cons
 * - Related products
 */

import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Star, Check, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock product data - in a real app, this would come from a database
const productDatabase: Record<
  string,
  {
    id: string;
    title: string;
    category: string;
    rating: number;
    price: string;
    image: string;
    imageGradient: string;
    verdict: string;
    summary: string;
    fullReview: string;
    specs: Array<{ label: string; value: string }>;
    pros: string[];
    cons: string[];
    purchaseLink: string;
  }
> = {
  "luxury-skincare": {
    id: "luxury-skincare",
    title: "Luxury Skincare That Actually Works",
    category: "Beauty & Skincare",
    rating: 5,
    price: "$89",
    image: "bg-gradient-to-br from-rose-100 to-pink-100",
    imageGradient: "from-rose-500/20 to-pink-500/20",
    verdict: "A game-changer for sensitive skin",
    summary:
      "After 8 weeks of testing, this serum delivers visible results without irritation. The formula is lightweight, absorbs quickly, and the packaging is luxurious.",
    fullReview:
      "I've tested countless serums over my 15 years as a product reviewer, and this one stands out. The hyaluronic acid and peptide complex work together to plump and hydrate without any heaviness. My skin feels softer, looks more radiant, and the fine lines around my eyes have noticeably diminished. The best part? No irritation, even on my most sensitive days. This is a keeper.",
    specs: [
      { label: "Size", value: "30ml" },
      { label: "Type", value: "Hydrating Serum" },
      { label: "Skin Type", value: "All, especially sensitive" },
      { label: "Ingredients", value: "Hyaluronic Acid, Peptides, Vitamin E" },
      { label: "Cruelty-Free", value: "Yes" },
      { label: "Vegan", value: "Yes" },
    ],
    pros: [
      "Visible results within 2 weeks",
      "No irritation or redness",
      "Lightweight and fast-absorbing",
      "Luxurious packaging",
      "Long-lasting bottle",
      "Cruelty-free and vegan",
    ],
    cons: [
      "Premium price point",
      "Scent might be strong for some",
      "Best results with consistent use",
    ],
    purchaseLink: "#",
  },
  "coffee-maker": {
    id: "coffee-maker",
    title: "The Best Coffee Maker for Home Baristas",
    category: "Kitchen & Appliances",
    rating: 4.5,
    price: "$299",
    image: "bg-gradient-to-br from-amber-100 to-orange-100",
    imageGradient: "from-amber-500/20 to-orange-500/20",
    verdict: "Café-quality espresso at home",
    summary:
      "Consistent shots, intuitive controls, and beautiful design. This machine has elevated my morning routine and impressed every coffee lover who's tried it.",
    fullReview:
      "As someone who's tested dozens of home espresso machines, I can confidently say this is the best value for the price. The pressure consistency is remarkable—every shot pulls beautifully with proper crema. The steam wand froths milk to perfection, and the build quality feels premium without the premium price tag. Setup was straightforward, and the included accessories are actually useful.",
    specs: [
      { label: "Type", value: "Semi-Automatic Espresso Machine" },
      { label: "Pressure", value: "15 bars" },
      { label: "Water Tank", value: "2.5L" },
      { label: "Dimensions", value: "13 x 10 x 12 inches" },
      { label: "Weight", value: "25 lbs" },
      { label: "Warranty", value: "2 years" },
    ],
    pros: [
      "Consistent pressure and extraction",
      "Professional steam wand",
      "Compact footprint",
      "Easy to clean",
      "Great customer support",
      "Beautiful design",
    ],
    cons: [
      "Requires some learning curve",
      "Loud during operation",
      "Takes time to heat up",
    ],
    purchaseLink: "#",
  },
  "premium-bedding": {
    id: "premium-bedding",
    title: "Premium Bedding That Changed My Sleep",
    category: "Home & Wellness",
    rating: 5,
    price: "$199",
    image: "bg-gradient-to-br from-blue-100 to-cyan-100",
    imageGradient: "from-blue-500/20 to-cyan-500/20",
    verdict: "Worth every penny for better sleep",
    summary:
      "Silk pillowcases and Egyptian cotton sheets that feel like a luxury hotel. My sleep quality improved noticeably, and my skin has never looked better.",
    fullReview:
      "I invested in this bedding set three months ago, and I'm still amazed by the difference. The silk pillowcases have reduced friction on my hair and face—no more sleep creases or frizz. The Egyptian cotton sheets are buttery soft and breathe beautifully throughout the night. I'm sleeping deeper and waking up more refreshed. This is one of those purchases that actually delivers on its promises.",
    specs: [
      { label: "Material", value: "100% Egyptian Cotton + Silk" },
      { label: "Thread Count", value: "1000+" },
      { label: "Sizes", value: "Twin to California King" },
      { label: "Care", value: "Machine washable" },
      { label: "Hypoallergenic", value: "Yes" },
      { label: "Warranty", value: "Lifetime" },
    ],
    pros: [
      "Exceptional comfort",
      "Improves sleep quality",
      "Better for hair and skin",
      "Temperature regulating",
      "Durable and long-lasting",
      "Lifetime warranty",
    ],
    cons: [
      "Higher upfront cost",
      "Requires gentle washing",
      "Takes time to break in",
    ],
    purchaseLink: "#",
  },
};

export default function ProductReview() {
  const [match, params] = useRoute("/review/:productId");

  if (!match) return null;

  const productId = params?.productId as string;
  const product = productDatabase[productId];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-20">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">
              Product Not Found
            </h1>
            <p className="text-lg text-foreground/70">
              Sorry, we couldn't find that review.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white">
              Back to Reviews
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero section */}
        <section className="py-12 md:py-20 bg-white border-b border-border">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className={`h-96 ${product.image} rounded-2xl shadow-lg`} />

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-primary font-semibold text-sm uppercase tracking-wide mb-2">
                    {product.category}
                  </p>
                  <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {product.title}
                  </h1>
                </div>

                {/* Rating and price */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={
                            i < Math.floor(product.rating)
                              ? "fill-primary text-primary"
                              : i < product.rating
                                ? "fill-primary/50 text-primary"
                                : "text-muted"
                          }
                        />
                      ))}
                    </div>
                    <span className="font-bold text-foreground">
                      {product.rating}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {product.price}
                  </p>
                </div>

                {/* Verdict */}
                <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                  <p className="text-sm font-semibold text-primary mb-1">
                    Miranda's Verdict
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {product.verdict}
                  </p>
                </div>

                {/* Summary */}
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {product.summary}
                </p>

                {/* CTA */}
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold w-full md:w-auto"
                >
                  View on Amazon →
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Full review */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-white to-primary/5">
          <div className="container max-w-3xl">
            <div className="space-y-12">
              {/* Review text */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  The Full Review
                </h2>
                <p className="text-lg text-foreground/80 leading-relaxed">
                  {product.fullReview}
                </p>
              </div>

              {/* Specifications */}
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">
                  Specifications
                </h2>
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                  {product.specs.map((spec, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center p-4 ${
                        i !== product.specs.length - 1
                          ? "border-b border-border"
                          : ""
                      }`}
                    >
                      <span className="font-semibold text-foreground">
                        {spec.label}
                      </span>
                      <span className="text-foreground/70">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pros and Cons */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Pros</h3>
                  <ul className="space-y-3">
                    {product.pros.map((pro, i) => (
                      <li key={i} className="flex gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-foreground">Cons</h3>
                  <ul className="space-y-3">
                    {product.cons.map((con, i) => (
                      <li key={i} className="flex gap-3">
                        <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Final CTA */}
              <div className="bg-primary/10 rounded-xl p-8 text-center space-y-4">
                <p className="text-lg font-semibold text-foreground">
                  Ready to try this product?
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold"
                >
                  View on Amazon →
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
