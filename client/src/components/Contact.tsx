/**
 * Contact Section
 * Design: Warm, inviting call-to-action mirroring the Newsletter section
 * - Direct contact details
 * - Social links
 */

import { Instagram, Mail, Music2, Youtube } from "lucide-react";

const socials = [
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "YouTube", href: "#", icon: Youtube },
  { name: "TikTok", href: "#", icon: Music2 },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 md:py-32 bg-white">
      <div className="container max-w-2xl">
        <div className="text-center space-y-4 mb-12">
          <p className="text-primary font-semibold text-sm uppercase tracking-wide">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Let's Connect
          </h2>
          <p className="text-lg text-foreground/70 max-w-lg mx-auto">
            Have a product you'd love me to review, a partnership idea, or just want to say hi? I'd love to hear from you.
          </p>
        </div>

        <div className="bg-primary/5 rounded-2xl p-8 md:p-12 space-y-8">
          <a
            href="mailto:hello@mirandareviews.com"
            className="flex items-center justify-center gap-3 text-lg font-semibold text-foreground hover:text-primary transition-colors"
          >
            <Mail className="text-primary" size={24} />
            hello@mirandareviews.com
          </a>

          <div className="flex items-center justify-center gap-4 pt-8 border-t border-border">
            {socials.map(({ name, href, icon: Icon }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={name}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-primary shadow-md hover:bg-primary hover:text-white transition-colors"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
