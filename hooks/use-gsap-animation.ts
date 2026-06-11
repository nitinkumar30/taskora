"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useGsapFadeIn(ref: React.RefObject<HTMLElement | null>, options?: {
  delay?: number;
  duration?: number;
  y?: number;
  stagger?: number;
}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.children;
    if (children.length > 0 && options?.stagger) {
      gsap.fromTo(
        children,
        { opacity: 0, y: options?.y ?? 20 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.5,
          delay: options?.delay ?? 0,
          stagger: options.stagger,
          ease: "power3.out",
        }
      );
    } else {
      gsap.fromTo(
        el,
        { opacity: 0, y: options?.y ?? 20 },
        {
          opacity: 1,
          y: 0,
          duration: options?.duration ?? 0.5,
          delay: options?.delay ?? 0,
          ease: "power3.out",
        }
      );
    }
  }, [ref, options]);
}

export function useGsapCounter(
  ref: React.RefObject<HTMLElement | null>,
  targetValue: number,
  duration: number = 1
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { textContent: 0 },
      {
        textContent: targetValue,
        duration,
        ease: "power2.out",
        snap: { textContent: 1 },
      }
    );
  }, [ref, targetValue, duration]);
}

export function useGsapReveal(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, [ref]);
}
