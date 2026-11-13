"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
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
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return <>{children}</>;
}
