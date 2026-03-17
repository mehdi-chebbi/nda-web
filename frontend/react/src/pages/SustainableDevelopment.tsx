import React, { useEffect, useRef, useState } from 'react';

// Define types for our data structures to satisfy TypeScript
interface WrapperData {
  section: HTMLElement;
  wrapper: HTMLElement;
}

interface ComparatorData {
  comp: HTMLElement;
  pct: HTMLElement;
  section: HTMLElement;
  layerCount: number;
  wrapper: HTMLElement | null;
  indicators?: HTMLButtonElement[];
}

// Reusable Card Component
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl shadow-lg ${className}`}>
    {children}
  </div>
);

// Stat Card Component
const StatCard = ({ icon, value, label, delay = "" }: { icon: string; value: string; label: string; delay?: string }) => (
  <div className={`stat-card transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${delay}`}>
    <span className="stat-icon">{icon}</span>
    <span className="stat-value">{value}</span>
    <span className="stat-label">{label}</span>
  </div>
);

// Impact Card Component
const ImpactCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="impact-card group">
    <div className="impact-icon-wrapper group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="impact-title">{title}</h3>
    <p className="impact-description">{description}</p>
  </div>
);

const SustainableDevelopment = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger hero animation on mount
    setIsVisible(true);

    /* -------------------------------------------------------------------------- */
    /* JAVASCRIPT LOGIC (Converted to useEffect with TS Types)                   */
    /* -------------------------------------------------------------------------- */
    (function () {
      "use strict";
      let velocity = 0;
      const ease = 0.12;
      const friction = 0.92;
      
      const sections = document.querySelectorAll(".scroll-section");
      const sectionsLen = sections.length;
      const wrappers: WrapperData[] = [];
      const comparatorData: ComparatorData[] = [];
      
      let i: number;
      let s: Element;
      let w: Element | null;
      let c: Element | null;
      let p: Element | null;

      for (i = 0; i < sectionsLen; i++) {
        s = sections[i];
        w = s.querySelector(".comparator-wrapper");
        if (w) wrappers.push({ section: s as HTMLElement, wrapper: w as HTMLElement });
        
        c = s.querySelector(".comparator");
        if (!c) continue;
        
        p = c.querySelector(".comparison-percentage");
        if (p) {
          const layers = c.querySelectorAll(".image-layer");
          comparatorData.push({
            comp: c as HTMLElement,
            pct: p as HTMLElement,
            section: s as HTMLElement,
            layerCount: layers.length,
            wrapper: w as HTMLElement | null
          });
        }
      }

      const wrappersLen = wrappers.length;
      const compLen = comparatorData.length;
      let d: ComparatorData;
      let v: number;

      function createStageIndicators() {
        for (i = 0; i < compLen; i++) {
          d = comparatorData[i];
          const nav = document.createElement("div");
          nav.className = "stage-nav";

          const indicators: HTMLButtonElement[] = [];
          for (let j = 0; j < d.layerCount; j++) {
            const indicator = document.createElement("button");
            indicator.className = "stage-indicator";
            indicator.setAttribute("aria-label", `Go to stage ${j + 1}`);
            indicator.dataset.stage = j.toString();
            indicator.dataset.comparatorIndex = i.toString();
            indicators.push(indicator);
            nav.appendChild(indicator);
          }

          d.comp.appendChild(nav);
          d.indicators = indicators;
        }
      }

      function getComparatorDuration(): number {
        const style = getComputedStyle(document.documentElement);
        const duration = style.getPropertyValue("--comparator-duration").trim();
        return (parseFloat(duration) * window.innerHeight) / 100;
      }

      let targetScrollPosition: number | null = null;
      const scrollEase = 0.08;

      function scrollToStage(comparatorIndex: number, stageIndex: number) {
        const data = comparatorData[comparatorIndex];
        if (!data) return;

        const offset = data.section.offsetTop;
        const duration = getComparatorDuration();
        const stageCount = data.layerCount;

        stageIndex = Math.max(0, Math.min(stageIndex, stageCount - 1));

        const stageDuration = duration / (stageCount - 1);
        targetScrollPosition = offset + stageDuration * stageIndex;
      }

      function onIndicatorClick(e: MouseEvent) {
        const btn = (e.target as HTMLElement).closest(".stage-indicator");
        if (!btn) return;

        const stage = parseInt((btn as HTMLElement).dataset.stage || "0", 10);
        const compIndex = parseInt((btn as HTMLElement).dataset.comparatorIndex || "0", 10);

        scrollToStage(compIndex, stage);
      }

      function updateOffsets() {
        for (i = 0; i < wrappersLen; i++) {
          const wObj = wrappers[i];
          wObj.wrapper.style.setProperty(
            "--comparator-offset",
            wObj.section.offsetTop + "px"
          );
        }
      }

      function onWheel(e: WheelEvent) {
        e.preventDefault();
        targetScrollPosition = null;
        velocity += e.deltaY;
      }

      let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

      function onResize() {
        targetScrollPosition = null;

        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          updateOffsets();
        }, 150);
      }

      function onMouseDown(e: MouseEvent) {
        if (!(e.target as HTMLElement).closest(".comparator-wrapper")) {
          targetScrollPosition = null;
        }
      }

      function frame() {
        if (targetScrollPosition !== null) {
          const current = window.scrollY;
          const delta = targetScrollPosition - current;

          if (Math.abs(delta) > 1) {
            window.scrollBy(0, delta * scrollEase);
          } else {
            targetScrollPosition = null;
          }
        }

        velocity *= friction;
        if (velocity > 0.2 || velocity < -0.2) {
          window.scrollBy(0, velocity * ease);
        }

        for (i = 0; i < compLen; i++) {
          d = comparatorData[i];
          v =
            parseFloat(
              getComputedStyle(d.comp).getPropertyValue("--scroll-progress")
            ) || 0;
          d.pct.textContent = (Math.round(v) + "").padStart(2, "0") + "%";

          const currentStage = Math.round((v / 100) * (d.layerCount - 1));
          if (d.indicators) {
            d.indicators.forEach((indicator, idx) => {
              indicator.classList.toggle("active", idx === currentStage);
            });
          }
        }
        requestAnimationFrame(frame);
      }

      // Initialize
      createStageIndicators();
      updateOffsets();
      requestAnimationFrame(frame);

      // Event Listeners
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("resize", onResize, { passive: true });
      window.addEventListener("mousedown", onMouseDown, { passive: true });
      document.addEventListener("click", onIndicatorClick);

      // Cleanup function
      return () => {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("mousedown", onMouseDown);
        document.removeEventListener("click", onIndicatorClick);
      };
    })();
  }, []);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <style>{`
        /* Import modern fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap');
        
        /* -------------------------------------------------------------------------- */
        /* CSS PROPERTIES (Kept original logic)                                      */
        /* -------------------------------------------------------------------------- */
        @property --scroll-progress {
            inherits: true;
            initial-value: 0;
            syntax: "<number>";
        }

        @property --layer-index {
            syntax: "<integer>";
            inherits: true;
            initial-value: 1;
        }

        @property --layer-count {
            syntax: "<integer>";
            inherits: true;
            initial-value: 1;
        }

        @property --divider-index {
            syntax: "<integer>";
            inherits: true;
            initial-value: 1;
        }

        @property --divider-count {
            syntax: "<integer>";
            inherits: true;
            initial-value: 1;
        }

        @layer reset,
        base,
        typography,
        layout,
        comparator,
        navigation,
        links,
        cards;

        @layer reset {
            *,
            *::after,
            *::before {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }

            html {
                color-scheme: light;
                -webkit-text-size-adjust: 100%;
                -moz-text-size-adjust: 100%;
                text-size-adjust: 100%;
                overflow-y: scroll;
            }
        }

        @layer base {
            :root {
                /* INSPIRED BY REACT COMPONENT: Emerald & Grays */
                --color-primary: #059669;      /* Emerald 600 */
                --color-primary-light: #ecfdf5; /* Emerald 50 */
                --color-secondary: #f59e0b;    /* Amber 500 */
                
                --color-white: #ffffff;
                --color-bg-page: #f9fafb;      /* Gray 50 */
                --color-bg-alt: #f3f4f6;       /* Gray 100 */
                
                --color-text-main: #111827;    /* Gray 900 */
                --color-text-muted: #6b7280;   /* Gray 500 */

                --space-md: 1rem;
                --space-lg: 1.5rem;
                --space-xl: 2rem;
                --space-xxl: 3rem;
                
                --line-tight: 1.2;
                --line-base: 1.5;
                --line-loose: 1.6;
                
                --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                --font-display: 'Poppins', 'Inter', -apple-system, sans-serif;
                
                /* Aligned with React component sizes to match rest of site */
                --ts-xxs: 0.75rem;   /* 12px - matches text-xs */
                --ts-xs: 0.875rem;   /* 14px - matches text-sm */
                --ts-sm: 1rem;        /* 16px - between text-sm and text-base */
                --ts-base: 1.125rem;  /* 18px - matches text-lg */
                --ts-md: 1.25rem;     /* 20px - matches text-xl */
                --ts-lg: 1.125rem;    /* 18px - matches text-lg (body text) */
                --ts-xl: 1.875rem;    /* 30px - matches text-3xl */
                --ts-xxl: 2.25rem;    /* 36px - matches text-4xl */
                --ts-xxxl: 2.25rem;   /* 36px - matches text-4xl (was 50.6px!) */

                /* Original Animation Variables (kept for logic) */
                --comparator-duration: 200vh;
                --comparator-offset: 35vh;
                --comparator-max-width: 56.25rem;
                --comparator-max-height: 100vh;
                --comparator-aspect-ratio: 3/2;
                
                accent-color: var(--color-primary);
            }

            @media (max-width: 48em) {
                :root {
                    --comparator-aspect-ratio: 3/4;
                }
            }

            ::selection {
                background: var(--color-primary-light);
                color: var(--color-text-main);
            }

            body {
                background-color: var(--color-bg-page);
                color: var(--color-text-main);
                font-family: var(--font-sans);
                font-size: var(--ts-base);
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                line-height: var(--line-base);
                min-block-size: 100vh;
                padding-block-start: var(--space-xl);
                text-rendering: optimizeLegibility;
            }
        }

        @layer typography {
            :where(section, article) > * + * {
                margin-block-start: var(--space-lg);
            }

            :is(h1, h2, h3, h4, h5, h6) {
                font-family: var(--font-display);
                font-weight: 700;
                letter-spacing: -0.02em;
                line-height: var(--line-tight);
                color: var(--color-text-main);
            }

            h1 {
                font-size: 3.5rem;
                font-weight: 800;
                letter-spacing: -0.04em;
                margin-block-end: var(--space-lg);
                text-align: center;
                color: var(--color-primary);
                line-height: 1.1;
            }
            
            @media (min-width: 48em) {
                h1 {
                    font-size: 4.5rem;
                }
            }
            
            h2 {
                font-size: 2rem;
                font-weight: 700;
                line-height: 1.2;
            }
            
            @media (min-width: 48em) {
                h2 {
                    font-size: 2.5rem;
                }
            }
            
            h3 {
                font-size: 1.5rem;
                font-weight: 600;
                line-height: 1.3;
            }
            
            h4 {
                font-size: 1.25rem;
                font-weight: 600;
                line-height: 1.4;
            }

            p {
                hyphens: auto;
                line-height: 1.7;
                text-wrap: pretty;
                word-wrap: break-word;
                color: var(--color-text-muted);
                font-size: 1.125rem;
                font-weight: 400;
            }

            code {
                background: var(--color-bg-alt);
                border-radius: 0.25em;
                font-family: ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Monaco,
                    Consolas, monospace;
                font-size: 0.9em;
                padding: 0.125em 0.25em;
                color: var(--color-primary);
            }

            a {
                color: var(--color-primary);
                text-decoration: none;
                font-weight: 600;
                position: relative;
            }

            a::after {
                content: '';
                position: absolute;
                width: 100%;
                height: 2px;
                bottom: -2px;
                left: 0;
                background-color: var(--color-primary);
                transform: scaleX(0);
                transform-origin: bottom right;
                transition: transform 0.25s ease-out;
            }

            a:hover::after {
                transform: scaleX(1);
                transform-origin: bottom left;
            }

            small {
                font-size: var(--ts-sm);
            }
        }

        @layer layout {
            @supports not ((animation-timeline: scroll()) and (z-index: sibling-count())) {
                .intro::before {
                    background: #374151;
                    border-radius: 0.5rem;
                    color: #fff;
                    content: "Your browser doesn't support the advanced CSS features required for this interactive layout. Please use the latest Chrome or Edge.";
                    display: block;
                    font-size: var(--ts-base);
                    font-weight: 600;
                    margin-block: var(--space-xl);
                    padding: var(--space-md);
                    position: relative;
                }
            }

            .intro {
                display: block;
                inline-size: calc(100% - var(--space-xl));
                margin: 0 auto;
                max-inline-size: 56.25rem;
                padding-block-end: var(--space-xxl);
                position: relative;
            }

            /* Container for the new card grids */
            .grid-container {
                inline-size: calc(100% - var(--space-xl));
                margin: 0 auto;
                max-inline-size: 80rem; /* Wider than intro text */
                padding-block: var(--space-xxl);
            }

            .scroll-section {
                block-size: calc(var(--comparator-duration) + 100vh);
                position: relative;
            }

            .spacer {
                block-size: 50vh;
            }

            .scroll-indicator {
                font-family: var(--font-sans);
                font-size: var(--ts-sm);
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: var(--color-text-muted);
                max-inline-size: 100%;
                text-align: center;
                opacity: 0.8;
            }

            /* Hero Animation */
            .hero-section {
                transition: all 1s ease-out;
            }

            .hero-hidden {
                opacity: 0;
                transform: translateY(-2.5rem);
            }

            .hero-visible {
                opacity: 1;
                transform: translateY(0);
            }

            .tagline-badge {
                display: inline-block;
                background-color: rgba(5, 150, 105, 0.1);
                border-radius: 9999px;
                padding: 0.5rem 1.25rem;
                font-size: var(--ts-xs);
                text-transform: uppercase;
                letter-spacing: 0.1em;
                font-weight: 700;
                color: var(--color-primary);
                margin-bottom: var(--space-md);
            }

            .hero-title {
                font-size: 3.5rem;
                font-weight: 800;
                color: var(--color-primary);
                margin-bottom: var(--space-lg);
                text-align: center;
                letter-spacing: -0.04em;
                line-height: 1.1;
            }

            @media (min-width: 48em) {
                .hero-title {
                    font-size: 5rem;
                }
            }

            .hero-subtitle {
                font-size: 1.25rem;
                max-width: 48rem;
                margin: 0 auto var(--space-xl);
                color: var(--color-text-muted);
                text-align: center;
            }

            /* Staggered animation delays */
            .delay-200 {
                animation-delay: 200ms;
            }

            .delay-300 {
                animation-delay: 300ms;
            }

            .delay-500 {
                animation-delay: 500ms;
            }

            .delay-700 {
                animation-delay: 700ms;
            }

            .animate-fade-in {
                animation: fadeInUp 1s ease-out forwards;
                opacity: 0;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(2rem);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }

        @layer comparator {
            .comparator-container {
                align-items: center;
                block-size: 100vh;
                display: flex;
                inset-block-start: 0;
                justify-content: center;
                overflow: hidden;
                position: sticky;
            }

            .comparator-wrapper {
                animation: comparator-3d-flip linear both;
                animation-range: calc(var(--comparator-offset) - 50vh)
                    calc(var(--comparator-offset) + var(--comparator-duration) + 50vh);
                animation-timeline: scroll(root);
                aspect-ratio: var(--comparator-aspect-ratio);
                border-radius: 1rem;
                inline-size: 100%;
                margin-inline: var(--space-md);
                max-block-size: var(--comparator-max-height);
                max-inline-size: var(--comparator-max-width);
                overflow: hidden;
                position: relative;
                background-color: var(--color-white);
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                border: 1px solid var(--color-bg-alt);
                transition: transform 0.3s ease;
            }

            .comparator-wrapper:hover {
                transform: scale(1.02);
            }

            .comparator-wrapper.flip-reverse {
                animation-name: comparator-3d-flip-reverse;
            }

            .comparator {
                animation: progress-calc linear both;
                animation-range: var(--comparator-offset)
                    calc(var(--comparator-offset) + var(--comparator-duration));
                animation-timeline: scroll(root);
                block-size: 100%;
                display: grid;
                inline-size: 100%;
                position: relative;
            }

            .image-layers,
            .divider-lines {
                grid-area: 1 / -1;
                display: grid;
                position: relative;
            }

            .image-layer {
                display: grid;
                grid-area: 1 / -1;
                position: relative;
                z-index: calc(sibling-count() - sibling-index() + 1);
            }

            .image-layer:not(:last-child) {
                --layer-index: sibling-index();
                --layer-count: sibling-count();
                --layer-start: calc((var(--layer-index) - 1) / (var(--layer-count) - 1));
                --layer-end: calc(var(--layer-index) / (var(--layer-count) - 1));

                animation: clip-reveal linear both;
                animation-timeline: scroll(root);
                animation-range: calc(
                        var(--comparator-offset) + (var(--comparator-duration) * var(--layer-start))
                    )
                    calc(
                        var(--comparator-offset) + (var(--comparator-duration) * var(--layer-end))
                    );
            }

            picture {
                grid-area: 1 / -1;
                max-block-size: var(--comparator-max-height);
                inline-size: 100%;
                block-size: 100%;
                display: block;
            }

            .image-layer img {
                block-size: 100%;
                display: block;
                inline-size: 100%;
                object-fit: cover;
                object-position: center;
                aspect-ratio: var(--comparator-aspect-ratio);
                background: var(--color-bg-alt);
            }

            .divider-line {
                --divider-index: sibling-index();
                --divider-count: sibling-count();
                --layer-start: calc((var(--divider-index) - 1) / var(--divider-count));
                --layer-end: calc(var(--divider-index) / var(--divider-count));

                background: transparent;
                block-size: 100%;
                border-inline-start: 2px solid var(--color-white);
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
                grid-area: 1 / -1;
                inline-size: 2px;
                pointer-events: none;
                position: relative;
                z-index: calc(20 - var(--divider-index));

                animation: divider-move linear both;
                animation-timeline: scroll(root);
                animation-range: calc(
                        var(--comparator-offset) + (var(--comparator-duration) * var(--layer-start))
                    )
                    calc(
                        var(--comparator-offset) + (var(--comparator-duration) * var(--layer-end))
                    );
            }

            .comparator-overlay {
                block-size: 100%;
                display: flex;
                flex-direction: column;
                grid-area: 1 / -1;
                inline-size: 100%;
                max-block-size: var(--comparator-max-height);
                position: relative;
                transform: translateZ(30px);
            }

            .label {
                backdrop-filter: blur(0.375rem);
                background: rgba(255, 255, 255, 0.85);
                border: 1px solid rgba(255,255,255,0.5);
                border-radius: 2rem;
                color: var(--color-primary);
                font-size: var(--ts-xs);
                font-weight: 700;
                inline-size: fit-content;
                letter-spacing: 0.05em;
                margin-block: var(--space-md) auto;
                margin-inline: var(--space-md) auto;
                padding: 0.5rem 1rem;
                pointer-events: none;
                position: relative;
                text-transform: uppercase;
                white-space: nowrap;
                z-index: 11;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            .image-text {
                animation: text-reveal 0.6s ease-out both;
                animation-range: var(--comparator-offset)
                    calc(var(--comparator-offset) + 20vh);
                animation-timeline: scroll(root);
                margin-block: auto var(--space-md);
                margin-inline: var(--space-md) auto;
                pointer-events: none;
                position: relative;
                white-space: nowrap;
                z-index: 10;
                text-align: center;
            }

            .image-text h2 {
                font-size: var(--ts-xl);
                font-weight: 800;
                letter-spacing: -0.02em;
                line-height: 1.2;
                margin: 0;
                color: var(--color-white);
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }

            .image-text h3 {
                font-size: var(--ts-md);
                font-weight: 500;
                line-height: 1.4;
                margin: 0;
                color: var(--color-white);
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            }

            .comparison-percentage {
                background: rgba(255, 255, 255, 0.9);
                color: var(--color-primary);
                bottom: var(--space-md);
                font-size: var(--ts-sm);
                font-variant-numeric: tabular-nums;
                font-weight: 700;
                line-height: 1.4;
                pointer-events: none;
                position: absolute;
                right: var(--space-md);
                z-index: 20;
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }

            @keyframes comparator-3d-flip {
                0% {
                    opacity: 0.5;
                    transform: perspective(1200px) rotateX(10deg) rotateY(-10deg) rotateZ(-3deg)
                        scale(0.95);
                }
                15%,
                85% {
                    opacity: 1;
                    transform: perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                        scale(1);
                }
                100% {
                    opacity: 0.5;
                    transform: perspective(1200px) rotateX(-10deg) rotateY(10deg) rotateZ(3deg)
                        scale(0.95);
                }
            }

            @keyframes comparator-3d-flip-reverse {
                0% {
                    opacity: 0.5;
                    transform: perspective(1200px) rotateX(-10deg) rotateY(10deg) rotateZ(3deg)
                        scale(0.95);
                }
                15%,
                85% {
                    opacity: 1;
                    transform: perspective(1200px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)
                        scale(1);
                }
                100% {
                    opacity: 0.5;
                    transform: perspective(1200px) rotateX(10deg) rotateY(-10deg) rotateZ(-3deg)
                        scale(0.95);
                }
            }

            @keyframes progress-calc {
                from {
                    --scroll-progress: 0;
                }
                to {
                    --scroll-progress: 100;
                }
            }

            @keyframes clip-reveal {
                from {
                    clip-path: inset(0 0 0 0);
                }
                to {
                    clip-path: inset(0 100% 0 0);
                }
            }

            @keyframes divider-move {
                0% {
                    inset-inline-start: 100%;
                    opacity: 0;
                }
                2% {
                    opacity: 1;
                }
                98% {
                    opacity: 1;
                }
                100% {
                    inset-inline-start: 0%;
                    opacity: 0;
                }
            }

            @keyframes text-reveal {
                0% {
                    opacity: 0;
                    transform: translateY(20px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        }

        @layer cards {
            /* NEW STYLES TO MIMIC REACT COMPONENT */

            /* 1. Stats Grid */
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                gap: var(--space-lg);
            }

            @media (min-width: 48em) {
                .stats-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .stat-card {
                background-color: var(--color-white);
                padding: var(--space-lg);
                border-radius: 0.75rem; /* rounded-xl */
                border: 2px solid rgba(5, 150, 105, 0.2); /* primary/20 */
                transition: all 0.3s ease;
                text-align: center;
                cursor: default;
            }

            .stat-card:hover {
                transform: scale(1.05);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                border-color: rgba(5, 150, 105, 0.4);
            }

            .stat-icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
                display: block;
            }

            .stat-value {
                font-size: 1.875rem;
                font-weight: 800;
                color: var(--color-primary);
                margin-bottom: 0.25rem;
                display: block;
            }

            .stat-label {
                font-size: 0.875rem;
                font-weight: 500;
                color: var(--color-text-muted);
                display: block;
            }

            /* 2. Impact Grid */
            .impact-grid {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                gap: var(--space-lg);
            }

            @media (min-width: 48em) {
                .impact-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
            }

            .impact-card {
                background-color: var(--color-white);
                padding: var(--space-lg);
                border-radius: 0.75rem;
                border: 2px solid #f3f4f6; /* border-gray-100 */
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
            }

            .impact-card:hover {
                border-color: rgba(245, 158, 11, 0.3); /* secondary/30 */
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .impact-icon-wrapper {
                font-size: 2rem;
                margin-bottom: 1rem;
                transition: transform 0.3s ease;
                display: inline-block;
            }

            .impact-card:hover .impact-icon-wrapper {
                transform: scale(1.1);
            }

            .impact-title {
                font-size: 1.375rem;
                font-weight: 700;
                color: var(--color-primary);
                margin-bottom: 0.75rem;
                letter-spacing: -0.02em;
            }

            .impact-description {
                font-size: 1rem;
                color: var(--color-text-muted);
                line-height: 1.6;
            }

            /* 3. Mission Box (The text in a square style) */
            .mission-box {
                background-color: rgba(5, 150, 105, 0.1); /* primary/10 */
                border-left: 4px solid var(--color-primary);
                border-radius: 0 0.75rem 0.75rem 0;
                padding: var(--space-lg);
                margin-top: var(--space-lg);
            }

            .mission-box p {
                margin-bottom: 1rem;
                color: var(--color-text-main);
                font-weight: 500;
            }

            .mission-box p:last-child {
                margin-bottom: 0;
            }

            /* 4. Climate Reality Card */
            .climate-reality-card {
                position: relative;
                overflow: hidden;
            }

            .blob-decoration {
                position: absolute;
                border-radius: 50%;
                filter: blur(100px);
                opacity: 0.3;
                pointer-events: none;
            }

            .blob-top-right {
                top: -50px;
                right: -50px;
                width: 400px;
                height: 400px;
                background-color: rgba(5, 150, 105, 0.05);
            }

            .blob-bottom-left {
                bottom: -50px;
                left: -50px;
                width: 400px;
                height: 400px;
                background-color: rgba(245, 158, 11, 0.05);
            }

            .pulse-text {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }

            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.7;
                }
            }

            /* 5. Partnership Card */
            .partnership-card {
                background: linear-gradient(to bottom right, var(--color-white), rgba(5, 150, 105, 0.05));
            }

            .partnership-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--space-lg);
                margin-top: var(--space-xl);
            }

            @media (min-width: 48em) {
                .partnership-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
            }

            .partnership-item {
                background-color: var(--color-white);
                padding: var(--space-lg);
                border-radius: 0.75rem;
                border-left: 4px solid var(--color-secondary);
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: box-shadow 0.3s ease;
            }

            .partnership-item:hover {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }

            .partnership-item h4 {
                font-size: 1.25rem;
                font-weight: 700;
                color: var(--color-primary);
                margin-bottom: 0.5rem;
                letter-spacing: -0.01em;
            }

            .partnership-item p {
                font-size: 1rem;
                color: var(--color-text-muted);
                line-height: 1.6;
                margin: 0;
            }

            /* 6. CTA Button */
            .cta-button {
                display: inline-block;
                background-color: var(--color-primary);
                color: var(--color-white);
                padding: 1rem 2.5rem;
                border-radius: 9999px;
                font-weight: 700;
                font-size: var(--ts-base);
                text-decoration: none;
                transition: all 0.3s ease;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border: none;
                cursor: pointer;
            }

            .cta-button:hover {
                background-color: rgba(5, 150, 105, 0.9);
                transform: scale(1.05);
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            }

            .cta-button::after {
                display: none;
            }
        }

        @layer navigation {
            .stage-nav {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                position: absolute;
                right: var(--space-md);
                top: 50%;
                transform: translateY(-50%);
                z-index: 25;
                pointer-events: auto;
            }

            .stage-indicator {
                appearance: none;
                background: rgba(255,255,255,0.6);
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                height: 0.5rem;
                padding: 0;
                transition: all 0.2s ease;
                width: 0.5rem;
                box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            }

            .stage-indicator:hover {
                background: var(--color-primary);
                transform: scale(1.3);
            }

            .stage-indicator.active {
                background: var(--color-primary);
                height: 1rem;
            }

            .stage-indicator:focus-visible {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
            }

            @media (max-width: 48em) {
                .stage-nav {
                    flex-direction: row;
                    right: 50%;
                    top: auto;
                    bottom: calc(var(--space-md) * 3);
                    transform: translateX(50%);
                }

                .stage-indicator.active {
                    height: 0.5rem;
                    width: 1rem;
                }
            }
        }

        @layer links {
            .links-layer {
                inset-block-end: 0;
                inset-inline-end: 0;
                pointer-events: none;
                position: fixed;
                z-index: 1000;
            }

            .links {
                backdrop-filter: blur(0.375rem);
                background: rgba(255, 255, 255, 0.9);
                border-top-left-radius: 0.5rem;
                border: 1px solid var(--color-bg-alt);
                display: grid;
                font-size: 0.75rem;
                gap: 0;
                grid-auto-flow: column;
                line-height: 1.3;
                padding-block: 0.375rem;
                padding-inline: 0.625rem;
                pointer-events: auto;
            }

            .links a {
                border-inline-start: thin solid var(--color-text-muted);
                color: var(--color-text-main);
                padding-inline: 0.5rem;
                text-decoration: none;
                transition: color 0.25s ease, opacity 0.25s ease;
            }

            .links a:first-child {
                border: none;
            }

            .links a:hover,
            .links a:focus-visible {
                color: var(--color-primary);
                opacity: 0.85;
            }
        }
      `}</style>
      
      <main>
        <article>
            {/* Hero Header Section */}
            <section className={`intro hero-section ${isVisible ? 'hero-visible' : 'hero-hidden'}`}>
                <div style={{ textAlign: 'center' }}>
                    <span className="tagline-badge">🌍 Climate Action Now</span>
                    <h1 className="hero-title">Sustainable Development</h1>
                    <p className="hero-subtitle">
                        We're not just talking about change—we're MAKING it happen! Every single day, real people are transforming our land, protecting our communities, and building a future worth fighting for.
                    </p>
                </div>
            </section>

            {/* Stats Section */}
            <section className="grid-container animate-fade-in delay-200">
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h2 style={{color: 'var(--color-primary)', fontSize: 'var(--ts-xxl)', fontWeight: 800}}>
                        Look at What We've Already Accomplished! 🎯
                    </h2>
                    <p style={{maxWidth: '60ch', margin: '0 auto', color: 'var(--color-text-muted)'}}>
                        These aren't just numbers—they represent real families, real communities, and real hope. 
                        And we're just getting started!
                    </p>
                </div>
                <div className="stats-grid">
                    <StatCard icon="🌱" value="15+" label="Active Projects" />
                    <StatCard icon="👥" value="50K+" label="Lives Impacted" />
                    <StatCard icon="🌳" value="200K+" label="Trees Planted" />
                </div>
            </section>

            {/* Climate Change Reality Section */}
            <section className="grid-container animate-fade-in delay-300">
                <Card className="climate-reality-card p-8 md:p-12">
                    <div className="blob-decoration blob-top-right"></div>
                    <div className="blob-decoration blob-bottom-left"></div>
                    <div style={{position: 'relative', zIndex: 1}}>
                        <h2 style={{fontSize: 'var(--ts-xxl)', fontWeight: 800, marginBottom: 'var(--space-lg)', color: 'var(--color-text-main)'}}>
                            Climate Change is <span className="pulse-text" style={{color: 'var(--color-secondary)'}}>REAL</span>
                        </h2>
                        <p style={{fontSize: 'var(--ts-lg)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-lg)', lineHeight: 1.6}}>
                            Look around—the evidence is everywhere. Severe droughts. Coastal erosion. Deforestation. Disappearing water sources. These aren't just statistics or distant warnings—this is happening RIGHT NOW to our land, our neighbors, our children's future.
                        </p>
                        <p style={{fontSize: 'var(--ts-lg)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-xl)', lineHeight: 1.6}}>
                            The scientific consensus is overwhelming. Global temperatures are rising. Ice caps are melting. Sea levels are climbing. And the impacts on our communities are undeniable. But here's the thing: we're not sitting back and watching it happen.
                        </p>
                        <div className="mission-box">
                            <p>
                                💪 We're FIGHTERS, not victims. Eritrea's National Designated Authority is on the front lines every single day—launching resilience projects, driving sustainable development, forging powerful partnerships. We're reclaiming our land. We're protecting what matters. And we're building a future that our grandchildren will be proud of. This is OUR moment. This is OUR fight. And together? We're unstoppable.
                            </p>
                        </div>
                    </div>
                </Card>
            </section>

            <section>
                <p className="scroll-indicator">Scroll down ↓</p>
            </section>

            {/* Image Comparison 1 */}
            <section className="scroll-section">
                <div style={{textAlign: 'center', marginBottom: 'var(--space-xl)'}}>
                    <h2 style={{fontSize: 'var(--ts-xl)', fontWeight: 700, color: 'var(--color-primary)'}}>
                        🏔️ Highlands: From Drought to Recovery
                    </h2>
                </div>
                <div className="comparator-container">
                    <div className="comparator-wrapper">
                        <div className="comparator">
                            <div className="comparison-percentage"></div>
                            <div className="image-layers">
                                <div className="image-layer">
                                    <picture>
                                        <source media="(max-width: 48em)" srcSet="https://i.postimg.cc/Y03xpHkq/Chat-GPT-Image-3-janv-2026-12-32-26.png" />
                                        <img src="https://i.postimg.cc/Y03xpHkq/Chat-GPT-Image-3-janv-2026-12-32-26.png" decoding="async" fetchPriority="high" alt="Stage 1" />
                                    </picture>
                                    <div className="comparator-overlay">
                                        <span className="label">Before</span>
                                        <div className="image-text">
                                            <h2>Devastated</h2>
                                            <h3>— The harsh reality</h3>
                                        </div>
                                    </div>
                                </div>
                                <div className="image-layer">
                                    <picture>
                                        <source media="(max-width: 48em)" srcSet="https://i.postimg.cc/2ywxzDm3/Chat-GPT-Image-3-janv-2026-12-32-22.png" />
                                        <img src="https://i.postimg.cc/2ywxzDm3/Chat-GPT-Image-3-janv-2026-12-32-22.png" decoding="async" fetchPriority="high" alt="Stage 2" />
                                    </picture>
                                    <div className="comparator-overlay">
                                        <span className="label">After</span>
                                        <div className="image-text">
                                            <h2>Recovered</h2>
                                            <h3>— New growth emerges</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="divider-lines">
                                <div className="divider-line"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Impact Areas Section */}
            <section className="grid-container animate-fade-in delay-500">
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <h2 style={{color: 'var(--color-primary)', fontSize: 'var(--ts-xxl)', fontWeight: 800}}>
                        Our Impact Areas: Where We're Making Magic Happen ✨
                    </h2>
                    <p style={{maxWidth: '60ch', margin: '0 auto', color: 'var(--color-text-muted)'}}>
                        Climate change is complex, but our response is clear and powerful. We're attacking this 
                        challenge from every angle—water, agriculture, and community strength.
                    </p>
                </div>
                <div className="impact-grid">
                    <ImpactCard 
                        icon="💧"
                        title="Water Conservation"
                        description="We're not letting our communities go thirsty! Our sustainable water systems are turning the tide on drought—bringing life-giving water security to families who need it most."
                    />
                    <ImpactCard 
                        icon="🌾"
                        title="Sustainable Agriculture"
                        description="Our farmers are climate warriors! We're empowering them with smart farming techniques that don't just survive climate change—they THRIVE through it."
                    />
                    <ImpactCard 
                        icon="🏘️"
                        title="Community Resilience"
                        description="Strong communities = unstoppable future! We're building the capacity, infrastructure, and spirit our people need to face climate challenges head-on and come out winning."
                    />
                </div>
            </section>

            {/* Building Resilient Communities Section */}
            <section className="grid-container animate-fade-in delay-700">
                <Card className="partnership-card p-8 md:p-12">
                    <div style={{display: 'flex', alignItems: 'flex-start', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)'}}>
                        <span style={{fontSize: '3rem'}}>🤝</span>
                        <div>
                            <h2 style={{fontSize: 'var(--ts-xxl)', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '0.5rem'}}>
                                We're Stronger Together! 💪
                            </h2>
                            <p style={{fontSize: 'var(--ts-lg)', color: 'var(--color-text-muted)', margin: 0}}>
                                Building resilience through collaboration and innovation
                            </p>
                        </div>
                    </div>
                    <div className="partnership-grid">
                        <div className="partnership-item">
                            <h4>Strategic Partnerships</h4>
                            <p>
                                We're joining forces with international organizations, governments, and local communities to maximize our impact. Together, we're unstoppable!
                            </p>
                        </div>
                        <div className="partnership-item">
                            <h4>Climate Finance</h4>
                            <p>
                                We're securing the funding needed to scale up our projects and reach even more communities. Every dollar invested is a dollar invested in our future.
                            </p>
                        </div>
                    </div>
                </Card>
            </section>

            {/* Final CTA */}
            <section className="intro">
                <h2 style={{textAlign: 'center', fontSize: 'var(--ts-xxl)', fontWeight: 800, color: 'var(--color-primary)'}}>
                    Ready to Be Part of Something BIGGER?
                </h2>
                <p style={{textAlign: 'center', fontSize: 'var(--ts-lg)', marginBottom: 'var(--space-xl)'}}>
                    Every single action matters. Every person counts. Join us and let's make history together! 🚀
                </p>
                <div style={{textAlign: 'center'}}>
                    <a href="#" className="cta-button">See Our Projects →</a>
                </div>
            </section>
            <section className="spacer"></section>
        </article>
      </main>
    </div>
  );
};

export default SustainableDevelopment;