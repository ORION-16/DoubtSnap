import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Default easing
export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  bounce: 'back.out(1.4)',
};

/**
 * Custom character-split text reveal animation.
 * Splits text into individual <span> elements and staggers them in.
 * This replaces the paid GSAP SplitText plugin.
 */
export function splitTextIntoChars(element) {
  if (!element) return [];
  const text = element.textContent;
  element.textContent = '';
  element.setAttribute('aria-label', text);

  const chars = [];
  for (const char of text) {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    span.style.willChange = 'transform, opacity';
    span.setAttribute('aria-hidden', 'true');
    element.appendChild(span);
    chars.push(span);
  }
  return chars;
}

/**
 * Animate a text element with a character-by-character reveal.
 * Returns the GSAP timeline for chaining.
 */
export function animateTextReveal(element, options = {}) {
  const {
    delay = 0,
    duration = 0.8,
    stagger = 0.03,
    ease = EASE.out,
    y = 40,
    rotateX = 0,
  } = options;

  const chars = splitTextIntoChars(element);

  return gsap.fromTo(
    chars,
    {
      opacity: 0,
      y,
      rotateX,
    },
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration,
      stagger,
      ease,
      delay,
    }
  );
}

/**
 * Scroll-triggered fade-in animation.
 */
export function scrollReveal(elements, options = {}) {
  const {
    y = 60,
    duration = 1,
    stagger = 0.15,
    ease = EASE.out,
    start = 'top 85%',
  } = options;

  return gsap.fromTo(
    elements,
    { opacity: 0, y },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger,
      ease,
      scrollTrigger: {
        trigger: elements[0] || elements,
        start,
        toggleActions: 'play none none none',
      },
    }
  );
}

export { gsap, ScrollTrigger, useGSAP };
