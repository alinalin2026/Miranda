/**
 * Vanotium Titanium Cutting Board — Spanish landing page
 * Shorter, more sales-driven variant of VanotiumReview.tsx for ES traffic.
 * Route: /review/vanotium-cutting-board/es
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star, Check, X, ChevronDown, Droplets, Shield, Zap, Scissors } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Same buy endpoint as the English page (handled in middleware.ts) so the
// existing tracking/geo-override logic in api/_lib/destinations.ts keeps
// working unchanged.
const SHOP_URL = "/review/vanotium-cutting-board/buy";

const whyPoints = [
  {
    icon: <Droplets className="w-5 h-5" />,
    title: "No porosa — nada se filtra",
    text: "Sin poros microscópicos donde las bacterias o el moho puedan alojarse, incluso tras años de uso diario.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Cero microplásticos",
    text: "No hay superficie de plástico, así que no se desprende nada en tu comida. La razón número uno de mi cambio.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Sin olores, sin bacterias",
    text: "Ajo, pescado, pollo crudo: todo se enjuaga al instante. E. coli y Salmonella no tienen dónde sobrevivir.",
  },
  {
    icon: <Scissors className="w-5 h-5" />,
    title: "Suave con tus cuchillos",
    text: "A diferencia del vidrio o la cerámica, esta superficie está diseñada para conservar el filo de tus cuchillos.",
  },
];

const comparisonRows = [
  { label: "Riesgo de microplásticos", vanotium: true, otros: false },
  { label: "Bacterias tras lavar", vanotium: true, otros: false },
  { label: "Absorbe olores", vanotium: true, otros: false },
  { label: "Apta para lavavajillas", vanotium: true, otros: null },
];

const pros = [
  "Superficie no porosa — las bacterias no tienen dónde vivir",
  "Cero microplásticos liberados en tu comida",
  "Se limpia en 10 segundos, apta para lavavajillas",
  "Ningún olor a ajo o pescado que se quede pegado",
];

const cons = [
  "Precio premium — muy compensado con el 70% de descuento",
  "Más pesada que una tabla de plástico",
];

const faqs = [
  {
    q: "¿Es apta para lavavajillas?",
    a: "Sí, sin ningún reparo. A diferencia de la madera que se deforma o el plástico que se degrada, el composite de titanio resiste perfectamente el calor y el detergente.",
  },
  {
    q: "¿Dañará mis cuchillos?",
    a: "No. La superficie está diseñada específicamente para ser suave con las hojas. Tras 60 días de uso diario no noté ninguna pérdida de filo.",
  },
  {
    q: "¿Tiene garantía?",
    a: "Sí, garantía de devolución de 30 días sin preguntas. Con la oferta actual del 70% de descuento, realmente no hay ningún riesgo en probarla.",
  },
];

function CompareCell({ good }: { good: boolean | null }) {
  if (good === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (good === false) return <X className="w-4 h-4 text-destructive mx-auto" />;
  return <span className="text-muted-foreground text-xs">~</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        className="w-full flex items-center justify-between text-left py-5 gap-4 font-semibold text-foreground hover:text-primary transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <p className="pb-5 text-foreground/70 leading-relaxed text-[0.9375rem]">{a}</p>}
    </div>
  );
}

export default function VanotiumReviewEs() {
  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 pt-16 pb-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-10" />

          <div className="container grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 pb-16 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-primary font-semibold text-sm">Probada durante 60 días</span>
              </div>

              <p className="text-primary font-semibold text-xs uppercase tracking-widest">Cocina e Higiene</p>

              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Cambié la Madera por el{" "}
                <span className="text-primary italic block">Titanio</span>
              </h1>

              <p className="text-lg text-foreground/70 leading-relaxed max-w-lg">
                60 días cortando pollo crudo, pescado y ajo — todos los días. Cero microplásticos. Cero bacterias. Cero olores. Por eso ya no pienso volver atrás.
              </p>

              <div className="flex items-center gap-3 bg-white border border-border rounded-xl px-4 py-3 w-fit shadow-sm">
                <img
                  src="/images/vanotium/miranda_thumb.jpg"
                  alt="Miranda Rodríguez"
                  className="w-11 h-11 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <p className="font-semibold text-sm text-foreground">Miranda Rodríguez</p>
                  <p className="text-xs text-foreground/60">Experta en Estilo de Vida · 15+ Años · 500K+ Lectores</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a href={SHOP_URL} target="_blank" rel="nofollow sponsored" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg px-8 py-7 shadow-lg hover:shadow-xl transition-all">
                    Aprovechar el 70% Ahora
                  </Button>
                </a>
              </div>

              <div className="flex items-center gap-8 pt-6 border-t border-border">
                {[
                  { num: "500K+", label: "Lectores" },
                  { num: "15+", label: "Años de Experiencia" },
                  { num: "70%", label: "De Descuento" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-bold text-foreground">{s.num}</p>
                    <p className="text-xs text-foreground/60">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-full min-h-[440px] flex items-end">
              <div className="relative rounded-t-2xl overflow-hidden shadow-2xl w-full">
                <img
                  src="/images/vanotium/hero_main.jpg"
                  alt="Miranda cortando verduras frescas sobre la tabla Vanotium"
                  className="w-full max-h-[560px] object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
              </div>
              <div className="absolute bottom-0 -left-4 bg-white rounded-xl shadow-xl p-5">
                <p className="text-xs font-semibold text-primary mb-1">Mi Veredicto</p>
                <p className="text-4xl font-bold text-foreground leading-none">9.8</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-xs text-foreground/60 mt-1">Muy Recomendada</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAND ── */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 py-10">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: "0", label: "Microplásticos" },
              { num: "10+", label: "Años de Vida Útil" },
              { num: "10 seg", label: "Tiempo de Limpieza" },
              { num: "70%", label: "De Descuento Hoy" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>{s.num}</p>
                <p className="text-sm text-foreground/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WHY IT'S DIFFERENT ── */}
        <section className="py-20 bg-white">
          <div className="container">
            <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Por Qué el Titanio</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              La Única Tabla Que Resuelve el Problema de Verdad
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mb-12 leading-relaxed">
              La madera retiene bacterias en su veta. El plástico libera microplásticos con cada corte. El composite de titanio no hace ninguna de las dos cosas.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {whyPoints.map((pt) => (
                <div key={pt.title} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                    {pt.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{pt.title}</p>
                    <p className="text-sm text-foreground/70 leading-relaxed">{pt.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden border border-border shadow-md overflow-x-auto">
              <table className="w-full text-sm min-w-[420px]">
                <thead>
                  <tr className="bg-foreground text-white">
                    <th className="text-left px-5 py-3.5 text-xs uppercase tracking-wide font-semibold">Criterio</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold bg-primary">Vanotium Titanio</th>
                    <th className="px-5 py-3.5 text-xs uppercase tracking-wide font-semibold text-white/60">Madera / Plástico</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={i % 2 === 1 ? "bg-background" : "bg-white"}>
                      <td className="px-5 py-3.5 font-semibold text-foreground">{row.label}</td>
                      <td className="px-5 py-3.5 text-center bg-primary/5"><CompareCell good={row.vanotium} /></td>
                      <td className="px-5 py-3.5 text-center"><CompareCell good={row.otros} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className="bg-foreground py-20 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[20rem] font-serif text-white/[0.03] leading-none">"</span>
          </div>
          <blockquote className="relative z-10 font-serif text-2xl md:text-4xl italic text-white/90 max-w-3xl mx-auto leading-snug mb-8">
            "La primera tabla de cortar que me hizo sentir que{" "}
            <em className="not-italic text-primary">de verdad protegía a mi familia</em> — no solo que cocinaba para ella."
          </blockquote>
          <div className="relative z-10 flex items-center justify-center gap-3">
            <img
              src="/images/vanotium/miranda_thumb.jpg"
              alt="Miranda Rodríguez"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/50"
            />
            <div className="text-left">
              <p className="font-semibold text-white text-sm">Miranda Rodríguez</p>
              <p className="text-white/50 text-xs">MirandaReviews.com · Probada 60 Días</p>
            </div>
          </div>
        </section>

        {/* ── PROS / CONS ── */}
        <section className="py-20 bg-white">
          <div className="container grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-xl font-bold text-primary">Lo Que Me Encanta</h3>
              <ul className="space-y-3">
                {pros.map((pro) => (
                  <li key={pro} className="flex gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-xl font-bold text-destructive">Vale la Pena Saber</h3>
              <ul className="space-y-3">
                {cons.map((con) => (
                  <li key={con} className="flex gap-3">
                    <X className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground/80">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="py-20 bg-background" id="faq">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Preguntas Frecuentes</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">Tus Dudas, Resueltas</h2>
            </div>
            <div className="max-w-2xl mx-auto">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 bg-gradient-to-br from-background to-primary/5 text-center px-6">
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mb-3">Oferta por Tiempo Limitado</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">¿Lista Para Cocinar Más Sano?</h2>
          <p className="text-lg text-foreground/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Tras 60 días de prueba real, es la única tabla que recomiendo a cualquiera que le importe lo que termina en su plato.
          </p>
          <a href={SHOP_URL} target="_blank" rel="nofollow sponsored" className="hidden md:inline-block">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold text-xl px-12 py-8 shadow-lg hover:shadow-xl transition-all">
              Aprovechar el 70% Hoy
            </Button>
          </a>
          <p className="mt-4 text-sm text-foreground/50">Garantía de 30 Días · Devoluciones Gratis · Pago Seguro</p>
        </section>

        {/* Disclosure */}
        <p className="text-center text-xs text-foreground/40 px-6 pb-10 max-w-2xl mx-auto">
          <strong className="text-foreground/50">Divulgación:</strong> Este es un artículo patrocinado/de afiliados. Recibí la tabla Vanotium para probarla y puedo ganar una comisión por las compras realizadas a través de los enlaces de esta página. Todas las opiniones son mías, basadas en 60 días de uso real.
        </p>
      </main>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <a href={SHOP_URL} target="_blank" rel="nofollow sponsored" className="block">
          <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold text-base py-6 shadow-lg">
            Comprar — 70% de Descuento
          </Button>
        </a>
      </div>

      <Footer />
    </div>
  );
}
