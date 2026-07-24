import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Sparkles,
  Upload,
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  Download,
  QrCode,
  Wand2,
  Lock,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Certz — Generate thousands of certificates in seconds" },
      {
        name: "description",
        content:
          "Upload your certificate design and Excel file. Generate personalized certificates in bulk — right in your browser. Zero storage, complete privacy.",
      },
      { property: "og:title", content: "Certz — Bulk certificate generator" },
      {
        property: "og:description",
        content: "Beautiful bulk certificates from your Canva template + Excel. Private, instant, in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Certz" },
      { name: "twitter:description", content: "Generate thousands of certificates in seconds." },
    ],
  }),
  component: Landing,
});

function Blobs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-blob absolute -top-24 -left-24 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-400/40 to-purple-400/30 blur-3xl" />
      <div className="animate-blob absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-blue-400/40 to-cyan-300/30 blur-3xl" style={{ animationDelay: "3s" }} />
      <div className="animate-blob absolute bottom-0 left-1/3 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-purple-500/30 to-fuchsia-400/20 blur-3xl" style={{ animationDelay: "6s" }} />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 px-4 py-4">
      <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 py-2.5">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">Certz</span>
        </Link>
        <div className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#privacy" className="hover:text-foreground">Privacy</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </div>
        <Link
          to="/app"
          className="btn-gradient inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold"
        >
          Generate <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}

function Hero() {
 return (
  <section className="relative px-4 pt-16 pb-24 md:pt-24 md:pb-32">
    <div className="mx-auto max-w-6xl text-center">

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
        Free Plan • Generate up to 100 Certificates • 100% Private
      </motion.div>

      {/* SEO H1 */}
      <motion.h1
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl"
      >
        Free{" "}
        <span className="gradient-text">
          Bulk Certificate Generator
        </span>
        <br />
        from Excel
      </motion.h1>

      {/* SEO Paragraph */}
    <motion.p
  initial={{ opacity: 0, y: 14 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.12 }}
  className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
>
  Generate personalized certificates from Excel in seconds for{" "}
  <span className="font-medium">
    schools, colleges, workshops, conferences, hackathons,
    seminars, training programs, and more.
  </span>
  <br />

      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-9 flex flex-wrap items-center justify-center gap-3"
      >
        <Link
          to="/app"
          className="btn-gradient inline-flex items-center gap-2 rounded-full px-6 py-3 text-base font-semibold"
        >
          Generate Certificates
          <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
  <br />
  Upload your <span className="font-medium">PNG or PDF template</span>,
  import participant data from Excel, and instantly download all certificates
  as a ZIP file-<span className="font-medium">100% private, right in your browser.</span>

 </motion.p>
      {/* Process */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-16"
      >
        <div className="glass-strong mx-auto max-w-5xl rounded-3xl p-3">
          <div className="rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-cyan-400/10 p-6 md:p-10">

            <div className="grid gap-4 md:grid-cols-3">

              {[
                {
                  icon: Upload,
                  title: "Upload Certificate Template",
                  desc: "Upload your Canva, PDF or image certificate template."
                },
                {
                  icon: FileSpreadsheet,
                  title: "Upload Excel Sheet",
                  desc: "Import participant names and details directly from Excel."
                },
                {
                  icon: Download,
                  title: "Download ZIP",
                  desc: "Generate personalized PDF certificates and download them instantly."
                }

              ].map((item, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 text-left"
                >
                  <item.icon className="h-7 w-7 text-indigo-500" />

                  <h3 className="mt-4 text-lg font-bold">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}

            </div>

          </div>
        </div>
      </motion.div>

      {/* SEO Features */}

      <div className="mx-auto mt-20 grid max-w-6xl gap-8 md:grid-cols-3">

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Bulk Certificate Generator
          </h2>

          <p className="mt-3 text-muted-foreground">
            Generate up to 100 personalized certificates from a single
            Excel spreadsheet in seconds.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            Supports Canva & PDF Templates
          </h2>

          <p className="mt-3 text-muted-foreground">
            Design certificates in Canva or any graphics software and
            generate personalized PDFs automatically.
          </p>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-bold">
            100% Private
          </h2>

          <p className="mt-3 text-muted-foreground">
            No files are uploaded to any server.
            Excel files and certificate templates stay on your device.
          </p>
        </div>

      </div>

    </div>
  </section>
);
}

function Features() {
  const items = [
    { icon: Wand2, title: "Drag-and-drop editor", desc: "Place fields anywhere on your template. Live preview." },
    { icon: FileSpreadsheet, title: "Smart Excel mapping", desc: "Auto-detects headers. Map any column to any placeholder." },
    { icon: QrCode, title: "QR + signatures", desc: "Add verification QR codes, logos, and typed or image signatures." },
    { icon: Zap, title: "Blazing fast batch", desc: "Generate 10,000+ personalized certificates without breaking a sweat." },
    { icon: Download, title: "PDF, PNG or JPG", desc: "Export individually named files, bundled into a ZIP." },
    { icon: ShieldCheck, title: "Privacy first", desc: "Everything runs in your browser. No uploads, no accounts." },
  ];
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need to <span className="gradient-text">ship certificates</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            A premium editor and a lightning-fast generation engine — all with zero storage.
          </p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="glass rounded-3xl p-6"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
                <it.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{it.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { t: "Upload your design", d: "PNG, JPG or PDF exported from Canva or any editor." },
    { t: "Drop the Excel", d: "We auto-detect columns like Name, Event, Date, Certificate_ID." },
    { t: "Place & style", d: "Drag placeholders onto the canvas. Style fonts, alignment, colors." },
    { t: "Generate & download", d: "Get a ZIP of named PDFs or images in seconds." },
  ];
  return (
    <section id="how" className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            How it <span className="gradient-text">works</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="glass rounded-3xl p-6">
              <div className="text-4xl font-extrabold gradient-text">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-3 text-base font-semibold">{s.t}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Privacy() {
  return (
    <section id="privacy" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="glass-strong overflow-hidden rounded-3xl p-8 md:p-14">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <Lock className="h-3.5 w-3.5" /> Privacy first
              </div>
              <h2 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
                Your files are processed temporarily and <span className="gradient-text">never stored</span> on our servers.
              </h2>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {[
                  "No login. No account. No database.",
                  "Templates and Excel files never leave your device.",
                  "Certificates are generated locally in your browser.",
                  "No user tracking. No analytics on your data.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-4 w-4 text-indigo-500" /> What we don't do
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {["Store your templates", "Save your Excel data", "Keep generated certificates", "Collect personal info"].map((t) => (
                  <div key={t} className="glass flex items-center justify-between rounded-xl px-4 py-3">
                    <span>{t}</span>
                    <span className="text-xs font-semibold text-emerald-600">Never</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

{/*function Testimonials() {
  const items = [
    { name: "Harish M.", role: "Event Lead, IIT Madras", quote: "We shipped 4,200 certificates in under 3 minutes. Insane." },
    { name: "Priya K.", role: "Community Manager", quote: "The editor feels like Canva but for bulk. My team loves it." },
    { name: "Daniel R.", role: "Bootcamp Director", quote: "Zero uploads and zero data leaks. That alone sold it." },
  ];
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Loved by <span className="gradient-text">event teams</span>
          </h2>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((t, i) => (
            <div key={i} className="glass rounded-3xl p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-3 text-sm">{t.quote}</p>
              <div className="mt-4 text-sm font-semibold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}*/}

function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "$0",
      desc: "Perfect for one-off events.",
      features: ["Up to 100 certificates / batch", "PDF, PNG, JPG export", "Drag-and-drop editor", "Private in-browser processing"],
      cta: "Start free",
      highlight: false,
    },
   /* {
      name: "Pro",
      price: "$19",
      desc: "For teams shipping at scale.",
      features: ["Up to 50,000 / batch", "QR verification codes", "Multiple signatures", "Template library", "Priority support"],
      cta: "Coming soon",
      highlight: true,
    },*/
  ];
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Simple <span className="gradient-text">pricing</span>
          </h2>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade when you're ready.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-3xl p-8 ${t.highlight ? "glass-strong ring-1 ring-indigo-400/40" : "glass"}`}
            >
              <div className="flex items-baseline justify-between">
                <div className="text-lg font-semibold">{t.name}</div>
                {t.highlight && (
                  <span className="rounded-full px-2.5 py-1 text-[10px] font-bold text-white" style={{ background: "var(--gradient-brand)" }}>
                    POPULAR
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold">{t.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-500" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold ${
                  t.highlight ? "btn-gradient" : "glass"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    { q: "Do you store my files?", a: "Never. Templates, Excel data, and generated certificates stay in your browser." },
    { q: "What file formats can I upload?", a: "PNG, JPG, or PDF for templates and .xlsx for participant data." },
    { q: "How many certificates can I generate?", a: "Free plan handles up to 100 per batch. Pro scales past 50,000." },
    { q: "Do I need an account?", a: "No — Certz is fully client-side. Zero signup, zero friction." },
  ];
  return (
    <section id="faq" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
            Frequently asked <span className="gradient-text">questions</span>
          </h2>
        </div>
        <div className="mt-12 space-y-3">
          {items.map((it) => (
            <details key={it.q} className="glass group rounded-2xl p-5">
              <summary className="cursor-pointer list-none text-base font-semibold">
                {it.q}
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="glass flex flex-col items-center justify-between gap-4 rounded-3xl p-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold">Certz</span>
          </div>
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Certz. Privacy-first certificate generation.
          </div>
          <div className="text-xs text-muted-foreground">
            by HARISH MADURAIMANI

          </div>
        </div>
      </div>
    </footer>
  );
}

function Landing() {
  return (
    <div className="relative">
      <Blobs />
      <Nav />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Privacy />
        {/* <Testimonials /> */}
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
