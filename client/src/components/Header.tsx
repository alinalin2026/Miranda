/**
 * Header Component
 * Design: Elevated Minimalism with Warm Sophistication
 * - Lavender accent bar on the left
 * - Logo + Navigation
 * - Clean, spacious layout
 */

import { Link } from "wouter";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      {/* Lavender accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-primary/60" />

      <div className="container flex items-center justify-between py-6 pl-6">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img
              src="/logo.svg"
              alt="Miranda Reviews"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-foreground hidden sm:inline">
              Miranda Reviews
            </span>
          </a>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-8">
          <Link href="/#about">
            <a className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              About
            </a>
          </Link>
          <Link href="/#reviews">
            <a className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Reviews
            </a>
          </Link>
          <Link href="/#contact">
            <a className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
              Contact
            </a>
          </Link>
        </nav>
      </div>
    </header>
  );
}
