"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState, ReactNode } from "react";

/* ─────────────────────────────────────────────
   COLLECTOR'S CORNER — Rentagun Landing Page
   Route: /collectors-corner
   All CTAs → /product-category/collectors-corner/
   Design: Matches rentagun.com white/red theme
   ───────────────────────────────────────────── */

// ── Design tokens (matching rentagun.com) ───
const C = {
  bg: "#FFFFFF",
  bgAlt: "#F5F5F5",
  surface: "#FFFFFF",
  heading: "#1A1A1A",
  body: "#555555",
  bodyLight: "#777777",
  border: "#E5E5E5",
  red: "#CC0000",
  redHover: "#B00000",
  green: "#4CAF50",
  dark: "#1A1A1A",
  darkBg: "#222222",
};

// ── Animation variants ──────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// ── Animated counter ────────────────────────
function Counter({
  target,
  prefix = "",
  suffix = "",
  className = "",
}: {
  target: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * target));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

// ── Data ────────────────────────────────────
const COLLECTION = [
  {
    name: "Colt Python",
    era: "1955-2005",
    note: "Original royal blue finish. The snake gun.",
    value: "$4,500",
    daily: "$90/day",
  },
  {
    name: "IMI UZI",
    era: "Pre-ban Import",
    note: "Original Israeli manufacture. Not coming back.",
    value: "$3,200",
    daily: "$64/day",
  },
  {
    name: "HK P7M8",
    era: "1982-2008",
    note: "Squeeze-cocker. This design doesn't exist in production anymore.",
    value: "$2,800",
    daily: "$56/day",
  },
  {
    name: "Winchester Model 70",
    era: "Pre-'64 Action",
    note: "Controlled-round feed. The one collectors hunt.",
    value: "$3,400",
    daily: "$68/day",
  },
  {
    name: "Browning Hi-Power",
    era: "FN Manufacture",
    note: "Last Browning design. Classic single-action 9mm.",
    value: "$2,200",
    daily: "$44/day",
  },
  {
    name: "SIG P210",
    era: "Swiss Production",
    note: "Swiss-made. Target-grade accuracy. Production ended.",
    value: "$3,800",
    daily: "$76/day",
  },
];

const STEPS = [
  {
    title: "Pick Your Gun",
    desc: "Browse the collection. Every firearm lists current market value and daily rate.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    title: "We Ship to Your FFL",
    desc: "Select your preferred FFL at checkout. We handle transfer paperwork and protected shipping.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    title: "Shoot It",
    desc: "7-30 days. Take it to the range as many times as you want. Break it down. Clean it.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Ship It Back",
    desc: "Prepaid return label in the box. Free return shipping. We handle the FFL transfer back.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
  },
];

const FAQS = [
  { q: "How much does it cost?", a: "2% of the gun's current market value per day. A $2,200 gun rents for $44/day. No hidden fees." },
  { q: "How long is the rental period?", a: "7 to 30 days. You pick when you book. Enough time to actually shoot it - not just hold it at a counter." },
  { q: "How do returns work?", a: "Prepaid return label in the box. Drop it off at FedEx. We handle the FFL transfer back. Free return shipping." },
  { q: "What condition are these in?", a: "Every firearm is inspected and function-tested before it ships. Collector-grade pieces, well-maintained and ready to shoot." },
  { q: "Can I trade in a gun?", a: "Most firearms, yes. We evaluate condition and market value, then make you a store credit offer within 48 hours." },
  { q: "What if I want to buy it?", a: "Some pieces are available for purchase. Contact us. But most people rent for the experience." },
];

// ── Buttons ─────────────────────────────────
function RedButton({
  children,
  href,
  full,
}: {
  children: ReactNode;
  href?: string;
  full?: boolean;
}) {
  return (
    <motion.a
      href={href}
      className={`
        inline-flex items-center justify-center font-bold tracking-wide uppercase
        text-white rounded-md cursor-pointer text-sm px-8 py-4
        ${full ? "w-full" : ""}
      `}
      style={{ backgroundColor: C.red }}
      whileHover={{ backgroundColor: C.redHover, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.a>
  );
}

function OutlineButton({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center justify-center text-sm font-bold tracking-wide uppercase
        border-2 rounded-md px-8 py-4 cursor-pointer"
      style={{ borderColor: C.red, color: C.red }}
      whileHover={{ backgroundColor: C.red, color: "#FFFFFF" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.a>
  );
}

// ── Section wrapper ─────────────────────────
function Section({
  children,
  className = "",
  id,
  bg = C.bg,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  bg?: string;
}) {
  return (
    <section id={id} className={`relative py-16 md:py-24 px-6 ${className}`} style={{ backgroundColor: bg }}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ── FAQ item ────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: C.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left cursor-pointer"
      >
        <span className="text-base font-semibold" style={{ color: C.heading }}>{q}</span>
        <motion.svg
          className="w-5 h-5 flex-shrink-0 ml-4"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke={C.red}
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-base leading-relaxed" style={{ color: C.body }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Gun card (matching rentagun card style) ─
function GunCard({ gun, index }: { gun: (typeof COLLECTION)[0]; index: number }) {
  return (
    <motion.a
      href="/product-category/collectors-corner/"
      className="group block rounded-lg overflow-hidden cursor-pointer bg-white"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)",
      }}
      variants={fadeUp}
      custom={index * 0.08}
      whileHover={{
        y: -4,
        boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ backgroundColor: "#F0F0F0" }}>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </motion.div>
        {/* Availability badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          Available
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-bold" style={{ color: C.heading }}>{gun.name}</h3>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ml-3 bg-red-50" style={{ color: C.red }}>
            {gun.era}
          </span>
        </div>
        <p className="text-sm mb-4" style={{ color: C.bodyLight }}>{gun.note}</p>
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.bodyLight }}>Market Value</p>
            <p className="text-base font-bold" style={{ color: C.heading }}>{gun.value}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: C.bodyLight }}>Rental</p>
            <p className="text-lg font-bold" style={{ color: C.red }}>{gun.daily}</p>
          </div>
        </div>
        <p className="text-xs text-center mb-4" style={{ color: C.bodyLight }}>
          7-30 day rental &middot; Ships to your FFL
        </p>
        <div
          className="w-full text-center text-sm font-bold tracking-wide uppercase text-white py-3 rounded-md"
          style={{ backgroundColor: C.red }}
        >
          RENT THIS GUN
        </div>
      </div>
    </motion.a>
  );
}

// ═════════════════════════════════════════════
// MAIN PAGE
// ═════════════════════════════════════════════
export default function CollectorsCorner() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, color: C.body }}>

      {/* ── HERO (dark with forest bg placeholder) ── */}
      <div ref={heroRef}>
        <section className="relative min-h-[70vh] flex items-center justify-center px-6 overflow-hidden"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          {/* Background overlay gradient */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7))",
          }} />

          <motion.div className="relative z-10 text-center max-w-4xl mx-auto" style={{ opacity: heroOpacity }}>
            <motion.p
              className="text-xs tracking-[0.3em] uppercase mb-6 text-white/50"
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
            >
              A Rentagun Collection
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
              style={{ color: "#FFFFFF", fontFamily: "var(--font-bebas), sans-serif" }}
              variants={fadeUp} initial="hidden" animate="visible" custom={0.15}
            >
              Shoot the guns<br />you&apos;ve only <span style={{ color: C.red }}>heard about.</span>
            </motion.h1>

            <motion.p
              className="text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10 text-white/70"
              variants={fadeUp} initial="hidden" animate="visible" custom={0.3}
            >
              Discontinued. Hard to find. Impossible to buy new.
              We tracked them down — now you can rent them.
              Shipped to your FFL for 7-30 days.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
              variants={fadeUp} initial="hidden" animate="visible" custom={0.45}
            >
              <RedButton href="/product-category/collectors-corner/">Browse the Collection</RedButton>
              <motion.a
                href="#how-it-works"
                className="inline-flex items-center justify-center text-sm font-bold tracking-wide uppercase
                  border-2 border-white/30 text-white/80 rounded-md px-8 py-4 cursor-pointer"
                whileHover={{ borderColor: "rgba(255,255,255,0.6)", color: "#FFFFFF" }}
                transition={{ duration: 0.15 }}
              >
                How It Works
              </motion.a>
            </motion.div>

            <motion.p
              className="text-xs tracking-[0.15em] uppercase text-white/40"
              variants={fadeUp} initial="hidden" animate="visible" custom={0.55}
            >
              Licensed FFL &middot; ATF Compliant &middot; Protected Shipping &middot; Free Returns
            </motion.p>
          </motion.div>
        </section>
      </div>

      {/* ── WHAT'S IN THE CORNER ─────────── */}
      <Section>
        <motion.div
          className="text-center mb-12"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            What&apos;s in the Corner
          </h2>
          <p className="text-base" style={{ color: C.bodyLight }}>
            Rare and discontinued firearms, curated for shooters who know what they&apos;re looking at.
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-x-12 gap-y-6 mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}
        >
          {[
            { icon: "M5 13l4 4L19 7", text: "Pre-ban imports that aren't coming back" },
            { icon: "M5 13l4 4L19 7", text: "Discontinued models collectors hunt for years" },
            { icon: "M5 13l4 4L19 7", text: "Guns you've read about but never seen in person" },
            { icon: "M5 13l4 4L19 7", text: "The stuff your local shop doesn't have" },
          ].map((item, i) => (
            <motion.div key={i} className="flex items-start gap-3" variants={fadeUp} custom={i * 0.08}>
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke={C.red} strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <p className="text-base" style={{ color: C.body }}>{item.text}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-base leading-relaxed max-w-2xl mx-auto"
          style={{ color: C.bodyLight }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.35}
        >
          These aren&apos;t safe queens behind glass. Every firearm ships to your FFL, ready to shoot.
          7-30 days to put real rounds through something most people only see in YouTube videos.
        </motion.p>
      </Section>

      {/* ── COLLECTION GRID ──────────────── */}
      <Section bg={C.bgAlt}>
        <motion.div
          className="text-center mb-4"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            The Collection
          </h2>
          <p className="text-base mt-2" style={{ color: C.bodyLight }}>
            Rare and discontinued firearms available to rent right now.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        >
          {COLLECTION.map((gun, i) => (
            <GunCard key={gun.name} gun={gun} index={i} />
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0.3}
        >
          <RedButton href="/product-category/collectors-corner/">
            Browse the Full Collection
          </RedButton>
          <p className="text-sm mt-4" style={{ color: C.bodyLight }}>
            New pieces added as trade-ins qualify.
          </p>
        </motion.div>
      </Section>

      {/* ── THE PROBLEM ──────────────────── */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold leading-tight mb-8"
            style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            Ever dropped $2,000 on a gun<br className="hidden md:block" /> you ended up hating?
          </motion.h2>

          <motion.p
            className="text-base leading-relaxed mb-5" style={{ color: C.body }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
          >
            You watch the reviews. You read the forums. You handle it at the counter for 30 seconds.
            Then you buy it, take it to the range, and realize the balance is wrong, the trigger pull
            isn&apos;t what you expected, or it just doesn&apos;t feel like yours.
          </motion.p>

          <motion.p
            className="text-base leading-relaxed mb-8" style={{ color: C.body }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.15}
          >
            Now you&apos;re listing it on GunBroker for $400 less than you paid, waiting two weeks
            for a buyer who lowballs you anyway.
          </motion.p>

          <motion.div
            className="relative pl-6 py-4 mb-8 rounded-r-md" style={{ borderLeft: `4px solid ${C.red}`, backgroundColor: "#FFF5F5" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
          >
            <p className="text-lg md:text-xl font-bold leading-snug" style={{ color: C.heading }}>
              What if you could shoot it first?<br />Really shoot it. For a week.
            </p>
          </motion.div>

          <motion.p
            className="text-base" style={{ color: C.body }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.25}
          >
            That&apos;s what Collector&apos;s Corner is. 7-30 days with rare firearms.
            Shipped to your FFL. Free return shipping.
          </motion.p>
        </div>
      </Section>

      {/* ── DO THE MATH (Buy vs Rent — matching site style) ── */}
      <Section bg={C.bgAlt}>
        <motion.div
          className="text-center mb-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            Do the Math
          </h2>
          <p className="text-base mt-2" style={{ color: C.bodyLight }}>
            Don&apos;t waste $2,000+. Rent the exact gun you want.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-[1fr,auto,1fr] gap-0 items-stretch">
            {/* Buy Blind */}
            <motion.div
              className="rounded-l-lg p-8 flex flex-col justify-between"
              style={{ backgroundColor: C.darkBg }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
            >
              <div>
                <p className="text-xs tracking-[0.2em] uppercase mb-6 text-white/50 font-bold">Buying Blind</p>
                <p className="text-white/80 text-sm leading-relaxed mb-6">
                  $2,200 gun. Put 50 rounds through it. Hate the balance.
                  Sell it for $1,600.
                </p>
                <p className="text-white font-bold text-sm mb-2">Trusted - but only once you&apos;ve zeroed it</p>
                <p className="text-white font-bold text-sm mb-2">Clean, sight, and pack it yourself</p>
                <p className="text-white font-bold text-sm mb-2">One setup, stuck with it all year</p>
              </div>
              <div className="mt-6">
                <p className="text-white font-bold text-lg">
                  $1,500 - $2,500 + upfront
                </p>
                <div style={{ fontFamily: "var(--font-bebas), sans-serif", color: C.red }}
                  className="text-5xl md:text-6xl mt-2">
                  &ndash;$<Counter target={600} />
                </div>
              </div>
            </motion.div>

            {/* VS divider */}
            <motion.div
              className="hidden md:flex flex-col items-center justify-center px-6"
              style={{ backgroundColor: C.bgAlt }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.15}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm"
                style={{ backgroundColor: C.bg, color: C.heading, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                VS
              </div>
            </motion.div>

            {/* Rent First */}
            <motion.div
              className="rounded-r-lg p-8 flex flex-col justify-between"
              style={{ backgroundColor: C.red }}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
            >
              <div>
                <p className="text-xs tracking-[0.2em] uppercase mb-6 text-white/60 font-bold">Renting with Rentagun</p>
                <p className="text-white/90 text-sm leading-relaxed mb-6">
                  Same gun. $44/day rental. Shoot it for a week.
                  Know exactly what you&apos;re getting.
                </p>
                <p className="text-white font-bold text-sm mb-2">Pre-inspected and ready to shoot</p>
                <p className="text-white font-bold text-sm mb-2">Arrives ready. Just grab and go.</p>
                <p className="text-white font-bold text-sm mb-2">Pick the right gun for every mood</p>
              </div>
              <div className="mt-6">
                <p className="text-white font-bold text-lg">Starting at just</p>
                <div style={{ fontFamily: "var(--font-bebas), sans-serif" }}
                  className="text-5xl md:text-6xl text-white mt-2">
                  $<Counter target={308} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile VS */}
          <div className="flex md:hidden justify-center -my-4 relative z-10">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-sm bg-white"
              style={{ color: C.heading, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              VS
            </div>
          </div>
        </div>

        <motion.div
          className="text-center mt-10"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.3}
        >
          <p className="text-xl font-bold mb-2" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            Renting is cheaper than being wrong.
          </p>
          <p className="text-sm" style={{ color: C.bodyLight }}>
            7-30 days. Free return shipping. No questions asked.
          </p>
        </motion.div>
      </Section>

      {/* ── HOW IT WORKS (matching site red circle icons) ── */}
      <Section id="how-it-works">
        <motion.div
          className="text-center mb-14"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            How It Works
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              className="text-center"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.1}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white"
                style={{ backgroundColor: C.red }}
              >
                {step.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: C.heading }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.bodyLight }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── WHY SHOOTERS LOVE THIS ───────── */}
      <Section bg={C.bgAlt}>
        <motion.div
          className="text-center mb-12"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            Why Shooters Love This
          </h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={stagger}
        >
          {[
            {
              title: "Guns You Can't Buy New",
              body: "Discontinued. Out of production. Pre-ban. Firearms people hunt for years on GunBroker and never find in the right condition. We have them ready to ship.",
              icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
            },
            {
              title: "Real Time Behind the Trigger",
              body: "Not a 15-minute range rental. 7-30 days. Take it to the range as many times as you want. Break it down. Clean it. Learn how it actually runs.",
              icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              title: "Ships to Your FFL",
              body: "Pick your preferred FFL at checkout. We handle the transfer paperwork and protected shipping both ways. Prepaid return label in the box.",
              icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4",
            },
            {
              title: "No Commitment",
              body: "Shoot it. Enjoy it. Send it back. That's the whole deal. Free return shipping, no questions asked.",
              icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-white rounded-lg p-8 h-full"
              style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)" }}
              variants={fadeUp} custom={i * 0.1}
              whileHover={{
                y: -3,
                boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: "#FFF0F0" }}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={C.red} strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: C.heading }}>{card.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.body }}>{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* ── TRADE-IN ─────────────────────── */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6"
            style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            Gun in the safe collecting dust?
          </motion.h2>

          <motion.p
            className="text-base leading-relaxed mb-3" style={{ color: C.body }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
          >
            Trade it in for store credit. Use it toward any rental in the collection.
          </motion.p>

          <motion.p
            className="text-base leading-relaxed mb-3" style={{ color: C.body }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.15}
          >
            We evaluate condition and current market value, then make you an offer within 48 hours.
            Unique and discontinued trade-ins get added to Collector&apos;s Corner for other shooters to experience.
          </motion.p>

          <motion.p
            className="text-base font-bold mb-8" style={{ color: C.heading }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
          >
            Your old gun becomes someone else&apos;s range day.
          </motion.p>

          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.25}
          >
            <OutlineButton>Start Trade-In</OutlineButton>
          </motion.div>
        </div>
      </Section>

      {/* ── FAQ ───────────────────────────── */}
      <Section bg={C.bgAlt}>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            Questions
          </motion.h2>

          <motion.div
            className="bg-white rounded-lg overflow-hidden"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
          >
            <div className="px-6">
              {FAQS.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── YES, THIS IS LEGAL ───────────── */}
      <Section>
        <motion.div
          className="text-center mb-10"
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
        >
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}>
            Yes, This Is Legal.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
          {[
            { title: "All transfers go through licensed FFL dealers", icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
            { title: "You complete ATF Form 4473 + background check", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
            { title: "Packages are tracked, logged, and insured", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="flex flex-col items-center"
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i * 0.1}
            >
              <svg className="w-10 h-10 mb-4" fill="none" viewBox="0 0 24 24" stroke={C.heading} strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <p className="text-sm font-bold" style={{ color: C.heading }}>{item.title}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="text-center text-sm mt-8" style={{ color: C.bodyLight }}
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.3}
        >
          Not just legal. Professional. Compliant. Trusted.
        </motion.p>
      </Section>

      {/* ── FINAL CTA ────────────────────── */}
      <section className="relative py-20 md:py-28 px-6 text-center" style={{ backgroundColor: C.bgAlt }}>
        <div className="max-w-3xl mx-auto">
          <motion.p
            className="text-base mb-4" style={{ color: C.bodyLight }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
          >
            Rare firearms. Ready to ship.
          </motion.p>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
            style={{ color: C.heading, fontFamily: "var(--font-bebas), sans-serif" }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.1}
          >
            Shoot the guns you&apos;ve<br />only <span style={{ color: C.red }}>heard about.</span>
          </motion.h2>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.2}
          >
            <RedButton href="/product-category/collectors-corner/">
              Browse the Collection
            </RedButton>
          </motion.div>
          <motion.p
            className="text-sm mt-5" style={{ color: C.bodyLight }}
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0.3}
          >
            Free return shipping. No questions asked.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
