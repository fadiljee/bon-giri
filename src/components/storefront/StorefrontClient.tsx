"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCart } from "@/context/CartContext";
import {
  BusinessInfo,
  PACKAGE_OPTIONS,
  QUALITY_POINTS,
  SHOWCASE_STAGES,
  StorefrontVariant,
  formatRupiah,
} from "@/data/storefront";
import HeroCanvas from "./HeroCanvas";
import SpecsCanvas from "./SpecsCanvas";
import BagDrawer from "./BagDrawer";

interface StorefrontClientProps {
  variants: StorefrontVariant[];
  business: BusinessInfo;
}

function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function getThemeServerSnapshot(): "light" | "dark" {
  return "light";
}

export default function StorefrontClient({ variants, business }: StorefrontClientProps) {
  const { addToCart, totalItems, isInitialized } = useCart();

  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getThemeServerSnapshot);
  const [activeVariantIdx, setActiveVariantIdx] = useState(0);
  const [activePkgIdx, setActivePkgIdx] = useState(0);
  const [isBagOpen, setIsBagOpen] = useState(false);

  // Showcase state
  const [showcaseIdx, setShowcaseIdx] = useState(0);
  const [captionBlurred, setCaptionBlurred] = useState(false);

  // Comparison slider state
  const [splitPct, setSplitPct] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Bento wireframe hover
  const [bentoHovered, setBentoHovered] = useState(false);

  const heroTiltRef = useRef<HTMLDivElement | null>(null);
  const heroShadowRef = useRef<HTMLDivElement | null>(null);
  const showcaseSectionRef = useRef<HTMLElement | null>(null);
  const showcaseFrameRefs = useRef<(HTMLDivElement | null)[]>([]);
  const showcaseTriggerRef = useRef<ScrollTrigger | null>(null);
  const craftGridRef = useRef<HTMLDivElement | null>(null);
  const comparisonRef = useRef<HTMLDivElement | null>(null);
  const lastStageRef = useRef(0);

  const activeVariant = variants[activeVariantIdx] || variants[0];
  const activePkg = PACKAGE_OPTIONS[activePkgIdx] || PACKAGE_OPTIONS[0];
  const configuredPrice = activeVariant.price * activePkg.multiplier;

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    const meta = document.querySelector('meta[name="color-scheme"]');
    if (meta) meta.setAttribute("content", next);
    try {
      localStorage.setItem("bongiri-theme", next);
    } catch {
      // ignore storage errors
    }
  };

  // Hero 3D Pointer Tilt with spring damping
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isCoarse) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let velX = 0;
    let velY = 0;
    let rafId = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      targetRotY = nx * 14;
      targetRotX = -ny * 10;
    };

    const tick = () => {
      velX = (velX + (targetRotX - curRotX) * 0.08) * 0.82;
      velY = (velY + (targetRotY - curRotY) * 0.08) * 0.82;
      curRotX += velX;
      curRotY += velY;

      if (heroTiltRef.current) {
        heroTiltRef.current.style.transform = `rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
      }
      if (heroShadowRef.current) {
        heroShadowRef.current.style.transform = `translateX(${(-curRotY * 1.4).toFixed(1)}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  // GSAP ScrollTrigger: Pinned 4-Stage Showcase & Bento Stagger
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Pinned 4-stage clip-path wipe
      if (showcaseSectionRef.current) {
        const frames = showcaseFrameRefs.current;
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: showcaseSectionRef.current,
            start: "top top",
            end: "+=280%",
            pin: true,
            scrub: 0.65,
            onUpdate: (self) => {
              const t = self.progress * 3.5;
              let nextStage = 0;
              if (t >= 3.07) nextStage = 3;
              else if (t >= 2.02) nextStage = 2;
              else if (t >= 0.97) nextStage = 1;

              if (nextStage !== lastStageRef.current) {
                lastStageRef.current = nextStage;
                setCaptionBlurred(true);
                setTimeout(() => {
                  setShowcaseIdx(nextStage);
                  setCaptionBlurred(false);
                }, 100);
              }
            },
          },
        });

        showcaseTriggerRef.current = tl.scrollTrigger || null;

        if (frames[1]) {
          tl.fromTo(
            frames[1],
            { clipPath: "inset(0 0 0 100%)" },
            { clipPath: "inset(0 0 0 0%)", ease: "none", duration: 0.8 },
            0.25
          );
        }
        if (frames[2]) {
          tl.fromTo(
            frames[2],
            { clipPath: "inset(0 0 0 100%)" },
            { clipPath: "inset(0 0 0 0%)", ease: "none", duration: 0.8 },
            1.3
          );
        }
        if (frames[3]) {
          tl.fromTo(
            frames[3],
            { clipPath: "inset(0 0 0 100%)" },
            { clipPath: "inset(0 0 0 0%)", ease: "none", duration: 0.8 },
            2.35
          );
        }
        tl.to({}, { duration: 0.35 }, 3.15);
      }

      // 2. Bento staggered reveal
      if (craftGridRef.current) {
        const cards = craftGridRef.current.querySelectorAll(".bento-card");
        gsap.from(cards, {
          y: 28,
          scale: 0.96,
          opacity: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: craftGridRef.current,
            start: "top 82%",
            once: true,
          },
        });
      }
    });

    return () => {
      ctx.revert();
    };
  }, []);

  const jumpToShowcaseStage = (index: number) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !showcaseTriggerRef.current) {
      setShowcaseIdx(index);
      lastStageRef.current = index;
      return;
    }

    const st = showcaseTriggerRef.current;
    const targets = [0.05, 1.08 / 3.5, 2.13 / 3.5, 3.18 / 3.5];
    const scrollTarget = st.start + (st.end - st.start) * targets[index];
    window.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.scrollIntoView({ behavior: "auto" });
      return;
    }
    window.dispatchEvent(new CustomEvent("bongiri:scrollto", { detail: `#${id}` }));
  };

  // Comparison Slider Pointer Handlers
  const updateSplitFromPointer = (clientX: number) => {
    if (!comparisonRef.current) return;
    const rect = comparisonRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setSplitPct(Math.max(0, Math.min(100, pct)));
  };

  const handleComparisonPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    updateSplitFromPointer(e.clientX);
  };

  const handleComparisonPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateSplitFromPointer(e.clientX);
  };

  const handleComparisonPointerUp = () => {
    setIsDragging(false);
  };

  const handleComparisonKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setSplitPct((prev) => Math.max(0, prev - 8));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setSplitPct((prev) => Math.min(100, prev + 8));
    }
  };

  const handleAddConfiguredToBag = () => {
    addToCart(
      {
        id: `${activeVariant.id}__${activePkg.id}`,
        name: `${activeVariant.shortName} (${activePkg.label} · ${activePkg.weightLabel})`,
        slug: activeVariant.slug,
        price: configuredPrice,
        image: activeVariant.image,
        categoryName: activeVariant.categoryName,
      },
      1
    );
    setIsBagOpen(true);
  };

  const activeShowcase = SHOWCASE_STAGES[showcaseIdx] || SHOWCASE_STAGES[0];
  const isEdge = splitPct <= 2 || splitPct >= 98;

  return (
    <div className="relative min-h-screen">
      {/* Subtle 24x24 radial dot film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
        style={{ backgroundColor: "var(--accent)", color: "var(--accent-text)" }}
      >
        Lewati ke konten utama
      </a>

      {/* Fixed Header (64px) */}
      <header id="site-header" className="site-header">
        <div className="sf-container h-full flex items-center justify-between gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5 min-h-[44px] font-bold tracking-tight text-base"
            style={{ color: "var(--text-primary)" }}
          >
            <Image
              src="/images/logo-sm.png"
              alt="Logo Bon Giri"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
            <span>Bon Giri</span>
          </a>

          <nav aria-label="Navigasi utama" className="nav-links-desktop flex items-center gap-7">
            {[
              { label: "Galeri", href: "#showcase" },
              { label: "Perbandingan", href: "#perbandingan" },
              { label: "Detail", href: "#craft" },
              { label: "Pesan", href: "#order" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium py-2 transition-colors hover:opacity-80"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Aktifkan mode gelap" : "Aktifkan mode terang"}
              aria-pressed={theme === "dark"}
              className="sf-icon-btn"
            >
              {theme === "light" ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              )}
            </button>

            <button
              id="bag-trigger"
              type="button"
              onClick={() => setIsBagOpen(true)}
              aria-label={`Buka tas belanja, ${isInitialized ? totalItems : 0} item`}
              aria-expanded={isBagOpen}
              aria-controls="bag-drawer"
              className="relative inline-flex items-center gap-2 min-h-[44px] px-4 text-sm font-medium transition-colors"
              style={{
                borderRadius: "var(--radius-pill)",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span>Tas</span>
              <span
                className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-xs font-mono font-medium"
                style={{
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-text)",
                }}
              >
                {isInitialized ? totalItems : 0}
              </span>
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        {/* SECTION 1: ASYMMETRIC SPLIT HERO */}
        <section id="hero" className="relative overflow-hidden">
          <HeroCanvas theme={theme} />

          <div className="sf-container relative z-10 hero-grid">
            <div className="hero-copy space-y-6">
              <h1 className="hero-title" style={{ color: "var(--text-primary)" }}>
                Stik Keju Tenggiri.
              </h1>

              <p
                className="text-lg leading-relaxed"
                style={{ color: "var(--text-secondary)", maxWidth: "42ch" }}
              >
                Camilan gurih renyah berbahan keju premium dan tepung tulang ikan tenggiri kaya kalsium khas Pangkalpinang, Bangka Belitung.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection("order")}
                  className="sf-btn-primary"
                >
                  Pesan Sekarang
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("showcase")}
                  className="sf-btn-ghost"
                >
                  Lihat Detail
                </button>
              </div>
            </div>

            <div className="hero-stage-col flex flex-col items-center gap-6">
              <div className="hero-stage w-full max-w-[460px] flex flex-col items-center">
                <div
                  ref={heroTiltRef}
                  className="hero-tilt-target relative w-full aspect-square flex items-center justify-center p-4"
                  style={{ willChange: "transform" }}
                >
                  <Image
                    src={activeVariant.image}
                    alt={activeVariant.fullName}
                    width={720}
                    height={720}
                    priority
                    className="w-full h-full object-contain"
                    style={{
                      borderRadius: "var(--radius-card)",
                      filter: "drop-shadow(0 28px 42px rgba(5, 8, 7, 0.36))",
                    }}
                  />
                </div>

                {/* Floor Shadow */}
                <div
                  ref={heroShadowRef}
                  aria-hidden="true"
                  className="w-3/5 h-4 -mt-3 rounded-full blur-md opacity-25"
                  style={{ backgroundColor: "var(--text-primary)" }}
                />
              </div>

              {/* Quick Variant Swatches synced with #order */}
              <div
                role="radiogroup"
                aria-label="Pilih varian rasa Bon Giri"
                className="hero-swatches inline-flex items-center gap-1.5 p-1.5"
              >
                {variants.map((variant, idx) => {
                  const selected = idx === activeVariantIdx;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setActiveVariantIdx(idx)}
                      className="pill-option inline-flex items-center gap-2 min-h-[44px] px-3.5 text-xs font-medium transition-colors"
                      style={{
                        borderRadius: "var(--radius-pill)",
                        backgroundColor: selected ? "var(--surface-elevated)" : "transparent",
                        border: `1px solid ${selected ? "var(--border-strong)" : "transparent"}`,
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: variant.swatchColor }}
                      />
                      <span>{variant.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: PINNED 4-STAGE ENVIRONMENTAL SHOWCASE */}
        <section id="showcase" ref={showcaseSectionRef} aria-label="Galeri varian Bon Giri">
          <div className="showcase-viewport">
            {SHOWCASE_STAGES.map((stage, idx) => {
              const isVisibleFallback = idx <= showcaseIdx;
              return (
                <div
                  key={stage.id}
                  ref={(el) => {
                    showcaseFrameRefs.current[idx] = el;
                  }}
                  className="absolute inset-0"
                  style={{
                    zIndex: idx + 1,
                    clipPath: idx === 0 || isVisibleFallback ? "inset(0 0 0 0%)" : "inset(0 0 0 100%)",
                  }}
                >
                  <Image
                    src={stage.image}
                    alt={stage.alt}
                    fill
                    sizes="100vw"
                    className="showcase-img"
                  />
                </div>
              );
            })}

            {/* Bottom Caption Overlay */}
            <div className="absolute inset-x-0 bottom-0 z-20 sf-container pb-10 sm:pb-14 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div
                className="space-y-3 transition-all duration-100"
                style={{
                  filter: captionBlurred ? "blur(3px)" : "blur(0px)",
                  opacity: captionBlurred ? 0.55 : 1,
                }}
              >
                <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "#d7dfd9" }}>
                  0{showcaseIdx + 1} / 04 · {activeShowcase.label}
                </p>
                <h2 className="caption-title" style={{ color: "#f4f6f5", maxWidth: "16ch" }}>
                  {activeShowcase.title}
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "#dde5e0", maxWidth: "46ch" }}>
                  {activeShowcase.subtitle}
                </p>
              </div>

              {/* Stage Indicator Dots */}
              <div
                role="tablist"
                aria-label="Pilih tahap galeri varian"
                className="inline-flex items-center gap-1 p-1 self-start sm:self-end"
                style={{
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "rgba(18, 24, 21, 0.72)",
                  border: "1px solid rgba(239, 243, 241, 0.16)",
                  backdropFilter: "blur(14px)",
                }}
              >
                {SHOWCASE_STAGES.map((stage, idx) => {
                  const active = idx === showcaseIdx;
                  return (
                    <button
                      key={stage.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-label={`Tampilkan ${stage.label}`}
                      onClick={() => jumpToShowcaseStage(idx)}
                      className="min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <span
                        className="block h-2 transition-all duration-300"
                        style={{
                          width: active ? "24px" : "8px",
                          borderRadius: "var(--radius-pill)",
                          backgroundColor: active ? "#f4f6f5" : "rgba(244, 246, 245, 0.4)",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: INTERACTIVE COMPARISON SLIDER */}
        <section id="perbandingan" className="py-20 sm:py-28">
          <div className="sf-container thermal-grid">
            <div>
              <div
                ref={comparisonRef}
                className="comparison-frame"
                onPointerDown={handleComparisonPointerDown}
                onPointerMove={handleComparisonPointerMove}
                onPointerUp={handleComparisonPointerUp}
                onPointerCancel={handleComparisonPointerUp}
              >
                {/* Base Layer: Balado */}
                <Image
                  src="/images/products/balado.webp"
                  alt="Bon Giri Stik Keju Pedas Balado 100g"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />

                {/* Clipped Layer: Original */}
                <div
                  className="comparison-cold absolute inset-0"
                  style={{
                    clipPath: `inset(0 ${100 - splitPct}% 0 0)`,
                    transition: isDragging ? "none" : "clip-path 380ms var(--ease-out)",
                  }}
                >
                  <Image
                    src="/images/products/original.webp"
                    alt="Bon Giri Stik Keju Original 100g"
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                  />
                </div>

                {/* Labels */}
                <span
                  className="absolute top-4 left-4 z-10 px-3 py-1.5 text-xs font-mono font-medium"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: "rgba(18, 24, 21, 0.78)",
                    color: "#f4f6f5",
                  }}
                >
                  Original
                </span>
                <span
                  className="absolute top-4 right-4 z-10 px-3 py-1.5 text-xs font-mono font-medium"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: "rgba(18, 24, 21, 0.78)",
                    color: "#f4f6f5",
                  }}
                >
                  Pedas Balado
                </span>

                {/* Vertical Divider & Accessible Slider Handle */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Geser pembanding varian Original dan Pedas Balado"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(splitPct)}
                  onKeyDown={handleComparisonKeyDown}
                  className={`comparison-divider absolute inset-y-0 z-20 flex items-center justify-center ${
                    isEdge ? "is-edge" : ""
                  }`}
                  style={{
                    left: `${splitPct}%`,
                    transform: "translateX(-50%)",
                    transition: isDragging ? "none" : "left 380ms var(--ease-out), opacity 180ms ease",
                  }}
                >
                  <div className="w-px h-full" style={{ backgroundColor: "#f4f6f5" }} />
                  <div
                    className="absolute w-11 h-11 flex items-center justify-center"
                    style={{
                      borderRadius: "var(--radius-pill)",
                      backgroundColor: "#f4f6f5",
                      color: "#111614",
                      boxShadow: "0 4px 16px rgba(10, 14, 12, 0.35)",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="section-title" style={{ color: "var(--text-primary)" }}>
                Dua Karakter Rasa.
              </h2>

              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Bandingkan karakter gurih keju murni pada varian Original dengan balutan bumbu rempah pedas sedang pada varian Balado. Keduanya memakai adonan tepung tulang ikan tenggiri yang sama.
              </p>

              {/* Segmented Control */}
              <div
                role="tablist"
                aria-label="Pilih tampilan perbandingan"
                className="inline-flex flex-wrap p-1 gap-1 max-w-full"
                style={{
                  borderRadius: "var(--radius-pill)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={splitPct >= 95}
                  onClick={() => setSplitPct(100)}
                  className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: splitPct >= 95 ? "var(--accent)" : "transparent",
                    color: splitPct >= 95 ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  Original
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={splitPct > 5 && splitPct < 95}
                  onClick={() => setSplitPct(50)}
                  className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: splitPct > 5 && splitPct < 95 ? "var(--accent)" : "transparent",
                    color: splitPct > 5 && splitPct < 95 ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  50 : 50
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={splitPct <= 5}
                  onClick={() => setSplitPct(0)}
                  className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                  style={{
                    borderRadius: "var(--radius-pill)",
                    backgroundColor: splitPct <= 5 ? "var(--accent)" : "transparent",
                    color: splitPct <= 5 ? "var(--accent-text)" : "var(--text-primary)",
                  }}
                >
                  Pedas Balado
                </button>
              </div>

              {/* 2 Real Key Metrics */}
              <div
                className="grid grid-cols-2 gap-6 pt-5"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div>
                  <p className="metric-value" style={{ color: "var(--text-primary)" }}>
                    100 g
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Berat bersih per kemasan
                  </p>
                </div>
                <div>
                  <p className="metric-value" style={{ color: "var(--text-primary)" }}>
                    Rp10.000
                  </p>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
                    Harga satuan langsung UMKM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: ASYMMETRIC 3-TILE EDITORIAL BENTO GRID */}
        <section id="craft" className="py-16 sm:py-24">
          <div className="sf-container space-y-10">
            <div className="max-w-xl space-y-3">
              <h2 className="section-title" style={{ color: "var(--text-primary)" }}>
                Bahan Lokal, Proses Higienis.
              </h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Bon Giri lahir dari Kelompok Laboratorium Kewirausahaan (KLK) Universitas Bangka Belitung untuk mengolah tulang ikan tenggiri menjadi sumber kalsium alami.
              </p>
            </div>

            <div ref={craftGridRef} className="bento-grid">
              {/* Tile 1: Tall Left */}
              <article className="bento-card bento-tall group">
                <Image
                  src="/images/products/rumput-laut.webp"
                  alt="Kemasan dan tekstur Stik Keju Ikan Tenggiri Bon Giri"
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-cover bento-media-zoom"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10, 14, 12, 0.84) 0%, rgba(10, 14, 12, 0.25) 48%, transparent 100%)",
                  }}
                />
                <div className="relative z-10 h-full flex flex-col justify-end p-6 sm:p-8">
                  <h3 className="bento-title" style={{ color: "#f4f6f5" }}>
                    Tepung Tulang Ikan Tenggiri.
                  </h3>
                  <p className="text-sm mt-2 leading-relaxed max-w-md" style={{ color: "#dde5e0" }}>
                    Memanfaatkan melimpahnya ikan tenggiri Bangka Belitung menjadi stik keju kaya kalsium tanpa bau amis.
                  </p>
                </div>
              </article>

              {/* Tile 2: Top Right */}
              <article className="bento-card bento-top p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <h3 className="bento-title" style={{ color: "var(--text-primary)" }}>
                    Komitmen Kualitas
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {QUALITY_POINTS.slice(0, 4).map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "var(--accent)" }}
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>

              {/* Tile 3: Bottom Right (Canvas 2D Rotating Wireframe + Specs) */}
              <article
                className="bento-card bento-bottom p-6 sm:p-7 flex items-center justify-between gap-4"
                onPointerEnter={() => setBentoHovered(true)}
                onPointerLeave={() => setBentoHovered(false)}
              >
                <div className="space-y-3 z-10">
                  <h3 className="bento-title" style={{ color: "var(--text-primary)" }}>
                    Produksi & Jam Layanan
                  </h3>
                  <dl className="space-y-1.5 text-xs font-mono" style={{ color: "var(--text-secondary)" }}>
                    <div>
                      <dt className="inline">Lokasi: </dt>
                      <dd className="inline" style={{ color: "var(--text-primary)" }}>{business.address}</dd>
                    </div>
                    <div>
                      <dt className="inline">Operasional: </dt>
                      <dd className="inline" style={{ color: "var(--text-primary)" }}>{business.openingHours}</dd>
                    </div>
                    <div>
                      <dt className="inline">Instagram: </dt>
                      <dd className="inline" style={{ color: "var(--text-primary)" }}>@{business.instagramHandle}</dd>
                    </div>
                  </dl>
                </div>

                <div className="w-32 h-32 sm:w-40 sm:h-40 shrink-0">
                  <SpecsCanvas theme={theme} hovered={bentoHovered} />
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* SECTION 5: INTERACTIVE ORDER CONFIGURATOR */}
        <section id="order" className="py-20 sm:py-28">
          <div className="sf-container order-grid">
            {/* Dynamic Preview Panel */}
            <div className="order-preview relative overflow-hidden flex items-center justify-center p-8">
              <div
                className="relative w-full h-full transition-transform duration-300"
                style={{
                  transform: `scale(${activePkg.previewScale})`,
                  transitionTimingFunction: "var(--ease-out)",
                }}
              >
                <Image
                  src={activeVariant.image}
                  alt={activeVariant.fullName}
                  fill
                  sizes="(max-width: 1024px) 100vw, 48vw"
                  className="object-contain"
                />
              </div>
            </div>

            {/* Configurator Controls */}
            <div className="space-y-7">
              <div className="space-y-2">
                <h2 className="section-title" style={{ color: "var(--text-primary)" }}>
                  {activeVariant.shortName}
                </h2>
                <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {activeVariant.description}
                </p>
              </div>

              {/* Variant Selector */}
              <div className="space-y-2.5">
                <span className="block text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  1. Pilih Varian Rasa
                </span>
                <div role="radiogroup" aria-label="Pilih varian rasa" className="flex flex-wrap gap-2">
                  {variants.map((variant, idx) => {
                    const selected = idx === activeVariantIdx;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setActiveVariantIdx(idx)}
                        className="pill-option inline-flex items-center gap-2 min-h-[44px] px-4 text-sm font-medium transition-colors"
                        style={{
                          borderRadius: "var(--radius-pill)",
                          backgroundColor: selected ? "var(--surface-elevated)" : "transparent",
                          border: `1px solid ${selected ? "var(--border-strong)" : "var(--border)"}`,
                          color: "var(--text-primary)",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: variant.swatchColor }}
                        />
                        <span>{variant.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Package Selector */}
              <div className="space-y-2.5">
                <span className="block text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  2. Pilih Paket Kemasan
                </span>
                <div role="radiogroup" aria-label="Pilih paket kemasan" className="flex flex-wrap gap-2">
                  {PACKAGE_OPTIONS.map((pkg, idx) => {
                    const selected = idx === activePkgIdx;
                    return (
                      <button
                        key={pkg.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => setActivePkgIdx(idx)}
                        className="pill-option min-h-[44px] px-4 text-sm font-medium transition-colors"
                        style={{
                          borderRadius: "var(--radius-pill)",
                          backgroundColor: selected ? "var(--surface-elevated)" : "transparent",
                          border: `1px solid ${selected ? "var(--border-strong)" : "var(--border)"}`,
                          color: "var(--text-primary)",
                        }}
                      >
                        {pkg.label} ({pkg.weightLabel})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3 Concise Spec Rows */}
              <dl style={{ borderTop: "1px solid var(--border)" }}>
                {[
                  { label: "Berat Bersih", value: activePkg.weightLabel },
                  { label: "Karakter Rasa", value: activeVariant.spiceLevel },
                  { label: "Asal Produksi", value: business.address },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3 text-sm"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <dt style={{ color: "var(--text-secondary)" }}>{spec.label}</dt>
                    <dd className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>
                      {spec.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* Price & Add to Bag CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <span className="block text-xs font-mono uppercase" style={{ color: "var(--text-secondary)" }}>
                    Total Harga
                  </span>
                  <span className="order-price" style={{ color: "var(--text-primary)" }}>
                    {formatRupiah(configuredPrice)}
                  </span>
                </div>

                <button
                  type="button"
                  disabled={!activeVariant.isAvailable}
                  onClick={handleAddConfiguredToBag}
                  className="sf-btn-primary disabled:opacity-50"
                >
                  {activeVariant.isAvailable ? "Tambah ke Tas" : "Stok Sedang Habis"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="sf-container flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-sm">
          <div className="space-y-1">
            <p className="font-bold" style={{ color: "var(--text-primary)" }}>
              Bon Giri · Stik Keju Ikan Tenggiri
            </p>
            <p style={{ color: "var(--text-secondary)" }}>
              {business.address} · {business.openingHours}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link href="/katalog" className="min-h-[44px] inline-flex items-center underline" style={{ color: "var(--text-secondary)" }}>
              Katalog Lengkap
            </Link>
            <Link href="/pesanan" className="min-h-[44px] inline-flex items-center underline" style={{ color: "var(--text-secondary)" }}>
              Riwayat Pesanan
            </Link>
            <a
              href={`https://instagram.com/${business.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center underline"
              style={{ color: "var(--text-secondary)" }}
            >
              @{business.instagramHandle}
            </a>
          </div>
        </div>
      </footer>

      {/* Slide-Over Bag Drawer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        waNumber={business.whatsappNumber}
        onExploreOrder={() => scrollToSection("order")}
      />
    </div>
  );
}
