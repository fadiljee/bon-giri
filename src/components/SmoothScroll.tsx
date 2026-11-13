"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const handleScrollToEvent = (e: Event) => {
      const target = (e as CustomEvent<string>).detail;
      if (target) {
        lenis.scrollTo(target, { duration: 1.05 });
      }
    };

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { duration: 1.05 });
    };

    window.addEventListener("bongiri:scrollto", handleScrollToEvent);
    document.addEventListener("click", handleAnchorClick);

    return () => {
      window.removeEventListener("bongiri:scrollto", handleScrollToEvent);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      return;
    }

    if (!window.location.hash && lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }

    const ctx = gsap.context(() => {
      const revealEls = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      revealEls.forEach((el, idx) => {
        const delay = Math.min((idx % 4) * 0.06, 0.18);
        gsap.fromTo(
          el,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            delay,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }, [pathname]);

  return <>{children}</>;
}
