"use client";

import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState, ReactNode, MouseEvent } from "react";

/* ─────────────────────────────────────────────
   COLLECTOR'S CORNER — Premium Landing Page
   Route: /collectors-corner
   All CTAs → /product-category/collectors-corner/
   ───────────────────────────────────────────── */

// ── Design tokens ───────────────────────────
const C = {
  bg: "#0A0F10",
  surface: "#111919",
  surfaceHover: "#182020",
  border: "rgba(255,255,255,0.06)",
  red: "#D32F2F",
  redGlow: "rgba(211,47,47,0.15)",
  redGlowHover: "rgba(211,47,47,0.3)",
  green: "#4CAF50",
  white: "#F5F5F5",
  gray: "#8A9A9E",
  grayLight: "#B0BEC5",
  grayDim: "rgba(138,154,158,0.5)",
};

// ── Animation variants ──────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(6px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardHover = {
  rest: {
    y: 0,
    boxShadow: "0 0 0px rgba(0,0,0,0)",
    borderColor: C.border,
  },
  hover: {
    y: -6,
    boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${C.redGlow}`,
    borderColor: "rgba(255,255,255,0.12)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

// ── Animated counter with blur-in ───────────
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
    <motion.span
      ref={ref}
      className={className}
      initial={{ filter: "blur(8px)", opacity: 0 }}
      animate={inView ? { filter: "blur(0px)", opacity: 1 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {prefix}
      {val}
      {suffix}
    </motion.span>
  );
}

// ── Grain overlay ───────────────────────────
function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        opacity: 0.012,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "256px 256px",
        mixBlendMode: "overlay",
      }}
    />
  );
}

// ── Gradient section divider ────────────────
function Divider() {
  return (
    <motion.div
      className="mx-auto h-px max-w-2xl"
      style={{
        background: `linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)`,
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

// ── Hero spotlight (follows mouse) ──────────
function HeroSpotlight({ children }: { children: ReactNode }) {
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.4);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <section
      className="relative min-h-[100vh] flex items-center justify-center px-6 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Parallax radial glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 40%, rgba(211,47,47,0.06) 0%, transparent 70%)`,
          x: useTransform(smoothX, [0, 1], [-20, 20]),
          y: useTransform(smoothY, [0, 1], [-15, 15]),
        }}
      />

      {/* Mouse-follow spotlight */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [smoothX, smoothY],
            ([x, y]: number[]) =>
              `radial-gradient(600px circle at ${(x as number) * 100}% ${(y as number) * 100}%, rgba(211,47,47,0.03) 0%, transparent 60%)`
          ),
        }}
      />

      {/* Vertical line accent */}
      <motion.div
        className="absolute left-1/2 top-0 w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, ${C.red}40, transparent)`,
        }}
        initial={{ height: 0 }}
        animate={{ height: 128 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      />

      {children}

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: `linear-gradient(to top, ${C.bg}, transparent)`,
        }}
      />
    </section>
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
    num: "01",
    title: "Pick Your Gun",
    desc: "Browse the collection. Every firearm lists current market value and daily rate.",
  },
  {
    num: "02",
    title: "We Ship to Your FFL",
    desc: "Select your preferred FFL at checkout. We handle transfer paperwork and protected shipping.",
  },
  {
    num: "03",
    title: "Shoot It",
    desc: "7-30 days. Take it to the range as many times as you want. Break it down. Clean it. Put real rounds through it.",
  },
  {
    num: "04",
    title: "Ship It Back",
    desc: "Done? Prepaid return label is in the box. Free return shipping. We handle the FFL transfer back.",
  },
];

const FAQS = [
  {
    q: "How much does it cost?",
    a: "2% of the gun's current market value per day. A $2,200 gun rents for $44/day. No hidden fees.",
  },
  {
    q: "How long is the rental period?",
    a: "7 to 30 days. You pick when you book. Enough time to actually shoot it - not just hold it at a counter.",
  },
  {
    q: "How do returns work?",
    a: "Prepaid return label in the box. Drop it off at FedEx. We handle the FFL transfer back. Free return shipping.",
  },
  {
    q: "What condition are these in?",
    a: "Every firearm is inspected and function-tested before it ships. Collector-grade pieces, well-maintained and ready to shoot.",
  },
  {
    q: "Can I trade in a gun?",
    a: "Most firearms, yes. We evaluate condition and market value, then make you a store credit offer within 48 hours.",
  },
  {
    q: "What if I want to buy it?",
    a: "Some pieces are available for purchase. Contact us. But most people rent for the experience.",
  },
];

// ── Buttons ─────────────────────────────────
function RedButton({
  children,
  href,
  large,
}: {
  children: ReactNode;
  href?: string;
  large?: boolean;
}) {
  return (
    <motion.a
      href={href}
      className={`
        inline-flex items-center justify-center font-semibold tracking-wide uppercase
        text-white rounded-sm cursor-pointer
        ${large ? "text-base px-12 py-5" : "text-sm px-8 py-4"}
      `}
      style={{
        backgroundColor: C.red,
        boxShadow: `0 0 30px ${C.redGlow}`,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 60px ${C.redGlowHover}`,
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
    >
      {children}
    </motion.a>
  );
}

function GhostButton({
  children,
  href,
}: {
  children: ReactNode;
  href?: string;
}) {
  return (
    <motion.a
      href={href}
      className="inline-flex items-center justify-center text-sm font-semibold tracking-wide uppercase
        border border-white/10 text-white/70 rounded-sm px-8 py-4 cursor-pointer"
      whileHover={{
        borderColor: "rgba(255,255,255,0.25)",
        color: "rgba(255,255,255,0.9)",
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
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
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative py-24 md:py-36 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ── FAQ item with AnimatePresence ───────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: C.border }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left cursor-pointer group"
      >
        <span
          className="text-base md:text-lg font-medium"
          style={{ color: C.white }}
        >
          {q}
        </span>
        <motion.svg
          className="w-5 h-5 flex-shrink-0 ml-4"
          animate={{ rotate: open ? 180 : 0, color: open ? C.red : C.gray }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p
              className="pb-6 text-base leading-relaxed"
              style={{ color: C.gray }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Gun card with spring hover ──────────────
function GunCard({ gun, index }: { gun: (typeof COLLECTION)[0]; index: number }) {
  return (
    <motion.a
      href="/product-category/collectors-corner/"
      className="group block rounded-sm overflow-hidden cursor-pointer"
      style={{
        backgroundColor: C.surface,
        border: `1px solid ${C.border}`,
      }}
      variants={{
        hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
        visible: {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          transition: {
            duration: 0.6,
            delay: index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -6,
        boxShadow: `0 24px 60px rgba(0,0,0,0.5), 0 0 50px ${C.redGlow}`,
        borderColor: "rgba(255,255,255,0.12)",
        backgroundColor: C.surfaceHover,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      }}
    >
      {/* Image placeholder with hover zoom */}
      <div
        className="relative aspect-[4/3] overflow-hidden"
        style={{ backgroundColor: "#0D1415" }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <svg
            className="w-12 h-12 opacity-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </motion.div>
        {/* Availability badge */}
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-medium"
          style={{ backgroundColor: "rgba(76,175,80,0.1)", color: C.green }}
        >
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: C.green }}
          />
          Available
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-semibold" style={{ color: C.white }}>
            {gun.name}
          </h3>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-sm flex-shrink-0 ml-3"
            style={{ backgroundColor: "rgba(211,47,47,0.1)", color: C.red }}
          >
            {gun.era}
          </span>
        </div>
        <p className="text-sm italic mb-4" style={{ color: C.grayDim }}>
          {gun.note}
        </p>
        <div className="flex items-end justify-between">
          <div>
            <p
              className="text-xs uppercase tracking-wider mb-0.5"
              style={{ color: C.grayDim }}
            >
              Market Value
            </p>
            <p className="text-base font-semibold" style={{ color: C.white }}>
              {gun.value}
            </p>
          </div>
          <div className="text-right">
            <p
              className="text-xs uppercase tracking-wider mb-0.5"
              style={{ color: C.grayDim }}
            >
              Rental
            </p>
            <p className="text-base font-semibold" style={{ color: C.red }}>
              {gun.daily}
            </p>
          </div>
        </div>
        <div
          className="mt-4 pt-4"
          style={{ borderTop: `1px solid ${C.border}` }}
        >
          <p
            className="text-xs text-center uppercase tracking-wider"
            style={{ color: C.grayDim }}
          >
            7-30 day rental&ensp;&middot;&ensp;Ships to your FFL
          </p>
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
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96]);

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: C.bg, color: C.gray }}
    >
      <Grain />

      {/* ── HERO ───────────────────────────── */}
      <div ref={heroRef}>
        <HeroSpotlight>
          <motion.div
            className="relative z-10 text-center max-w-4xl mx-auto"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <motion.p
              className="text-xs tracking-[0.35em] uppercase mb-8"
              style={{ color: C.grayDim }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              A Rentagun Collection
            </motion.p>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-bold leading-[0.92] mb-8"
              style={{
                color: C.white,
                fontFamily: "var(--font-bebas), sans-serif",
                letterSpacing: "0.01em",
              }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.15}
            >
              Shoot the guns
              <br />
              you&apos;ve only
              <br />
              <span style={{ color: C.red }}>heard about.</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-12"
              style={{ color: C.gray }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
            >
              Discontinued. Hard to find. Impossible to buy new.
              <br className="hidden md:block" />
              We tracked them down — now you can rent them.
              <br className="hidden md:block" />
              Shipped to your FFL for 7-30 days.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.45}
            >
              <RedButton href="/product-category/collectors-corner/">
                Browse the Collection
              </RedButton>
              <GhostButton href="#how-it-works">How It Works</GhostButton>
            </motion.div>

            <motion.p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: C.grayDim }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.55}
            >
              Licensed FFL&ensp;&middot;&ensp;ATF
              Compliant&ensp;&middot;&ensp;Protected
              Shipping&ensp;&middot;&ensp;Free Returns
            </motion.p>
          </motion.div>
        </HeroSpotlight>
      </div>

      <Divider />

      {/* ── WHAT'S IN THE CORNER ─────────── */}
      <Section>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
        >
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: C.red }}
          />
          <h2
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            What&apos;s in the Corner
          </h2>
        </motion.div>

        <motion.div
          className="max-w-xl mx-auto text-center space-y-4 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {[
            "Pre-ban imports that aren't coming back",
            "Discontinued models collectors have been hunting for years",
            "Guns you've read about in forums but never seen in person",
            "The stuff your local shop doesn't have and never will",
          ].map((line, i) => (
            <motion.p
              key={i}
              className="text-base md:text-lg"
              style={{ color: C.grayLight }}
              variants={fadeUp}
              custom={i * 0.08}
            >
              <span style={{ color: C.red }}>—</span>&ensp;{line}
            </motion.p>
          ))}
        </motion.div>

        <motion.p
          className="text-center text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
          style={{ color: C.gray }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.35}
        >
          These aren&apos;t safe queens behind glass. Every firearm ships to
          your FFL, ready to shoot. 7-30 days to put real rounds through
          something most people only see in YouTube videos.
        </motion.p>
      </Section>

      <Divider />

      {/* ── COLLECTION GRID ──────────────── */}
      <Section className="relative">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${C.border}, transparent)`,
          }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />

        <motion.div
          className="text-center mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          custom={0}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-4"
            style={{ color: C.grayDim }}
          >
            Currently Available
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            A Few Pieces from the Corner
          </h2>
        </motion.div>

        <motion.p
          className="text-center text-base mb-16 max-w-lg mx-auto"
          style={{ color: C.gray }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.1}
        >
          Rare and discontinued firearms available to rent right now.
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {COLLECTION.map((gun, i) => (
            <GunCard key={gun.name} gun={gun} index={i} />
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.3}
        >
          <RedButton href="/product-category/collectors-corner/" large>
            Browse the Full Collection
          </RedButton>
          <p className="text-sm mt-5" style={{ color: C.grayDim }}>
            New pieces added as trade-ins qualify.
          </p>
        </motion.div>
      </Section>

      <Divider />

      {/* ── THE PROBLEM ──────────────────── */}
      <Section>
        <div className="max-w-3xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-bold leading-tight mb-12"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Ever dropped $2,000 on a gun
            <br className="hidden md:block" /> you ended up hating?
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed mb-6"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            You watch the reviews. You read the forums. You handle it at the
            counter for 30 seconds. Then you buy it, take it to the range, and
            realize the balance is wrong, the trigger pull isn&apos;t what you
            expected, or it just doesn&apos;t feel like yours.
          </motion.p>

          <motion.p
            className="text-lg leading-relaxed mb-10"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.15}
          >
            Now you&apos;re listing it on GunBroker for $400 less than you paid,
            waiting two weeks for a buyer who lowballs you anyway.
          </motion.p>

          <motion.div
            className="relative pl-6 py-4 mb-8"
            style={{ borderLeft: `3px solid ${C.red}` }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            <p
              className="text-xl md:text-2xl font-medium leading-snug"
              style={{ color: C.white }}
            >
              What if you could shoot it first?
              <br />
              Really shoot it. For a week.
            </p>
          </motion.div>

          <motion.p
            className="text-base"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.25}
          >
            That&apos;s what Collector&apos;s Corner is. 7-30 days with rare
            firearms. Shipped to your FFL. Free return shipping.
          </motion.p>
        </div>
      </Section>

      <Divider />

      {/* ── DO THE MATH ──────────────────── */}
      <Section>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: C.red }}
          />
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            Do the Math
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {/* Buy Blind */}
          <motion.div
            className="rounded-sm p-8 relative"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderLeftColor: C.red,
              borderLeftWidth: "4px",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: C.grayDim }}
            >
              Buy Blind
            </p>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: C.gray }}
            >
              $2,200 gun. Put 50 rounds through it. Hate the balance. Sell it
              for $1,600. You just lost $600 and a week on GunBroker.
            </p>
            <div
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                color: C.red,
              }}
              className="text-5xl md:text-6xl"
            >
              &ndash;$
              <Counter target={600} />
            </div>
          </motion.div>

          {/* Rent First */}
          <motion.div
            className="rounded-sm p-8"
            style={{
              backgroundColor: C.surface,
              border: `1px solid ${C.border}`,
              borderLeftColor: C.green,
              borderLeftWidth: "4px",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            <p
              className="text-xs tracking-[0.2em] uppercase mb-4"
              style={{ color: C.grayDim }}
            >
              Rent First
            </p>
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: C.gray }}
            >
              Same gun. $44/day rental. Shoot it for a week. Know exactly what
              you&apos;re getting. Don&apos;t love it? Ship it back.
            </p>
            <div
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                color: C.green,
              }}
              className="text-5xl md:text-6xl"
            >
              $
              <Counter target={308} />
            </div>
          </motion.div>
        </div>

        <motion.div
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.3}
        >
          <p
            className="text-2xl md:text-4xl font-bold mb-3"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            Renting is cheaper than being wrong.
          </p>
          <p className="text-sm" style={{ color: C.grayDim }}>
            7-30 days. Free return shipping. No questions asked.
          </p>
        </motion.div>
      </Section>

      <Divider />

      {/* ── HOW IT WORKS ─────────────────── */}
      <Section id="how-it-works">
        <motion.div
          className="text-center mb-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <div
            className="w-8 h-px mx-auto mb-8"
            style={{ backgroundColor: C.red }}
          />
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            How It Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line (desktop) */}
          <motion.div
            className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px"
            style={{
              backgroundImage: `repeating-linear-gradient(to right, ${C.border} 0, ${C.border} 8px, transparent 8px, transparent 16px)`,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              className="text-center relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              custom={i * 0.12}
            >
              <p
                className="text-6xl md:text-7xl font-bold mb-4"
                style={{
                  fontFamily: "var(--font-bebas), sans-serif",
                  color: `${C.red}20`,
                }}
              >
                {step.num}
              </p>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: C.white }}
              >
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: C.gray }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0.5}
        >
          <p
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: C.grayDim }}
          >
            Unbox <span style={{ color: C.red }}>&rarr;</span> Inspect{" "}
            <span style={{ color: C.red }}>&rarr;</span> Range time{" "}
            <span style={{ color: C.red }}>&rarr;</span> Clean{" "}
            <span style={{ color: C.red }}>&rarr;</span> Ship back
          </p>
        </motion.div>
      </Section>

      <Divider />

      {/* ── WHY SHOOTERS LOVE THIS ───────── */}
      <Section>
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          <h2
            className="text-3xl md:text-5xl font-bold"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
          >
            Why Shooters Love This
          </h2>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={stagger}
        >
          {[
            {
              title: "Guns You Can't Buy New",
              body: "Discontinued. Out of production. Pre-ban. Firearms people hunt for years on GunBroker and never find in the right condition. We have them ready to ship.",
            },
            {
              title: "Real Time Behind the Trigger",
              body: "Not a 15-minute range rental. 7-30 days. Take it to the range as many times as you want. Break it down. Clean it. Learn how it actually runs.",
            },
            {
              title: "Ships to Your FFL",
              body: "Pick your preferred FFL at checkout. We handle the transfer paperwork and protected shipping both ways. Prepaid return label in the box.",
            },
            {
              title: "No Commitment",
              body: "Shoot it. Enjoy it. Send it back. That's the whole deal. Free return shipping, no questions asked.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-sm p-8 h-full"
              style={{
                backgroundColor: C.surface,
                border: `1px solid ${C.border}`,
              }}
              variants={fadeUp}
              custom={i * 0.1}
              whileHover={{
                borderColor: `${C.red}30`,
                boxShadow: `0 0 50px ${C.redGlow}`,
                transition: { type: "spring", stiffness: 200, damping: 20 },
              }}
            >
              <h3
                className="text-xl font-semibold mb-3"
                style={{ color: C.white }}
              >
                {card.title}
              </h3>
              <p
                className="text-base leading-relaxed"
                style={{ color: C.gray }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <Divider />

      {/* ── TRADE-IN ─────────────────────── */}
      <Section>
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-8"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Gun in the safe collecting dust?
          </motion.h2>

          <motion.p
            className="text-lg leading-relaxed mb-4"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            Trade it in for store credit. Use it toward any rental in the
            collection.
          </motion.p>

          <motion.p
            className="text-base leading-relaxed mb-4"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.15}
          >
            We evaluate condition and current market value, then make you an
            offer within 48 hours. Unique and discontinued trade-ins get added
            to Collector&apos;s Corner for other shooters to experience.
          </motion.p>

          <motion.p
            className="text-lg font-medium mb-10"
            style={{ color: C.white }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            Your old gun becomes someone else&apos;s range day.
          </motion.p>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.25}
          >
            <GhostButton>Start Trade-In</GhostButton>
          </motion.div>
        </div>
      </Section>

      <Divider />

      {/* ── FAQ ───────────────────────────── */}
      <Section>
        <div className="max-w-2xl mx-auto">
          <motion.h2
            className="text-3xl md:text-5xl font-bold mb-16 text-center"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Questions
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </div>
      </Section>

      <Divider />

      {/* ── FINAL CTA ────────────────────── */}
      <section className="relative py-32 md:py-44 px-6 text-center overflow-hidden">
        {/* Big radial glow */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 50% 60% at 50% 50%, rgba(211,47,47,0.08) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.p
            className="text-base md:text-lg mb-6"
            style={{ color: C.gray }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            Rare firearms. Ready to ship.
          </motion.p>
          <motion.h2
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10"
            style={{
              color: C.white,
              fontFamily: "var(--font-bebas), sans-serif",
              lineHeight: 0.95,
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.1}
          >
            Shoot the guns you&apos;ve
            <br />
            only heard about.
          </motion.h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.2}
          >
            <RedButton href="/product-category/collectors-corner/" large>
              Browse the Collection
            </RedButton>
          </motion.div>
          <motion.p
            className="text-sm mt-6"
            style={{ color: C.grayDim }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0.3}
          >
            Free return shipping. No questions asked.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
