import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Interfaces
interface CardData {
  title: string;
  desc: string;
  img: string;
}

interface PositionData {
  height: number;
  z: number;
  rotateY: number;
  y: number;
  clip: string;
}

const Carousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [cardInfo, setCardInfo] = useState({ title: '', desc: '' });
  const [isDragging, setIsDragging] = useState(false);

  const dragStateRef = useRef({
    startX: 0,
    dragDistance: 0,
    processedSteps: 0,
    threshold: 60
  });

  const cloneRef = useRef<HTMLDivElement | null>(null);

  const positions: PositionData[] = [
    {
      height: 495,
      z: 135,
      rotateY: 35,
      y: 0,
      clip: "polygon(0px 0px, 100% 8%, 100% 92%, 0px 100%)"
    },
    {
      height: 420,
      z: 66,
      rotateY: 15,
      y: 0,
      clip: "polygon(0px 0px, 100% 7%, 100% 93%, 0px 100%)"
    },
    {
      height: 310,
      z: 0,
      rotateY: 0,
      y: 0,
      clip: "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    },
    {
      height: 420,
      z: 66,
      rotateY: -15,
      y: 0,
      clip: "polygon(0px 7%, 100% 0px, 100% 100%, 0px 93%)"
    },
    {
      height: 495,
      z: 135,
      rotateY: -35,
      y: 0,
      clip: "polygon(0px 8%, 100% 0px, 100% 100%, 0px 92%)"
    }
  ];

  const cards: CardData[] = [
    {
      title: "Water Security",
      desc: "Enhancing water management and access across Eritrea through innovative conservation, efficient irrigation systems, and sustainable groundwater management practices.",
      img: "https://c1.wallpaperflare.com/preview/975/262/367/field-arable-agriculture-landscape.jpg"
    },
    {
      title: "Climate-Resilient Agriculture",
      desc: "Building climate-resilient agricultural systems with drought-resistant crops, sustainable farming practices, and support for rural communities.",
      img: "https://c4.wallpaperflare.com/wallpaper/115/424/884/water-falls-time-lapse-photo-wallpaper-preview.jpg"
    },
    {
      title: "Renewable Energy",
      desc: "Promoting clean energy solutions including solar, wind, and geothermal power to drive sustainable development and reduce carbon emissions.",
      img: "https://c1.wallpaperflare.com/preview/864/407/832/windmill-turbine-renewable-resource.jpg"
    },
    {
      title: "Coastal Resilience",
      desc: "Protecting coastal communities and ecosystems through sustainable fisheries, marine conservation, and climate adaptation strategies.",
      img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=800&fit=crop"
    },
    {
      title: "Forest Conservation",
      desc: "Preserving and restoring forest ecosystems through reforestation initiatives, community-based conservation, and biodiversity protection.",
      img: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&h=800&fit=crop"
    }
  ];

  const [cardOrder, setCardOrder] = useState<number[]>([0, 1, 2, 3, 4]);

  useEffect(() => {
    applyPositions();
  }, [cardOrder]);

  const applyPositions = () => {
    cardsRef.current.forEach((card, index: number) => {
      if (!card) return;
      const pos = positions[index] || positions[positions.length - 1];
      gsap.set(card, {
        height: pos.height,
        clipPath: pos.clip,
        transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`
      });
    });
  };

  const expandCard = (index: number) => {
    if (expandedCard !== null || isDragging) return;

    const card = cardsRef.current[index];
    if (!card) return;

    const cardData = cards[cardOrder[index]];

    setExpandedCard(index);
    setCardInfo({ title: cardData.title, desc: cardData.desc });

    const rect = card.getBoundingClientRect();

    const clone = card.cloneNode(true) as HTMLDivElement;
    const staticTitle = clone.querySelector('.static-card-title');
    if (staticTitle) staticTitle.remove();

    const overlay = clone.querySelector('.hover-overlay');
    if (overlay) overlay.remove();

    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "1000";
    clone.style.transform = "none";

    document.body.appendChild(clone);
    cloneRef.current = clone;

    gsap.set(card, { opacity: 0 });

    const maxHeight = window.innerHeight * 0.8;
    const finalWidth = Math.min(500, window.innerWidth - 40);
    const finalHeight = Math.min(650, maxHeight);
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    gsap.to(clone, {
      width: finalWidth,
      height: finalHeight,
      left: centerX - finalWidth / 2,
      top: centerY - finalHeight / 2,
      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
      duration: 0.8,
      ease: "power2.out"
    });
  };

  const closeCard = () => {
    if (expandedCard === null) return;

    const card = cardsRef.current[expandedCard];
    if (!card) return;

    const clone = cloneRef.current;
    if (!clone) return;

    const pos = positions[expandedCard] || positions[positions.length - 1];
    const rect = card.getBoundingClientRect();

    gsap.to(clone, {
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      clipPath: pos.clip,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        clone.remove();
        gsap.set(card, { opacity: 1 });
        setExpandedCard(null);
        cloneRef.current = null;
      }
    });
  };

  const rotate = (direction: "next" | "prev") => {
    if (expandedCard !== null) return;

    cardsRef.current.forEach((card, index: number) => {
      if (!card) return;
      let newIndex: number;
      if (direction === "next") {
        newIndex = (index - 1 + 5) % 5;
      } else {
        newIndex = (index + 1) % 5;
      }

      const pos = positions[newIndex] || positions[positions.length - 1];

      gsap.set(card, { clipPath: pos.clip });

      gsap.to(card, {
        height: pos.height,
        duration: 0.5,
        ease: "power2.out"
      });

      gsap.to(card, {
        transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    setCardOrder(prev => {
      if (direction === "next") {
        const newOrder = [...prev];
        const first = newOrder.shift();
        if (first !== undefined) newOrder.push(first);
        return newOrder;
      } else {
        const newOrder = [...prev];
        const last = newOrder.pop();
        if (last !== undefined) newOrder.unshift(last);
        return newOrder;
      }
    });
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (expandedCard !== null) return;
    setIsDragging(true);
    dragStateRef.current.startX = e.type.includes("mouse") ? (e as React.MouseEvent).clientX : (e as React.TouchEvent).touches[0].clientX;
    dragStateRef.current.dragDistance = 0;
    dragStateRef.current.processedSteps = 0;
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.type.includes("mouse") ? (e as MouseEvent).clientX : (e as TouchEvent).touches[0].clientX;
    dragStateRef.current.dragDistance = currentX - dragStateRef.current.startX;

    const steps = Math.floor(Math.abs(dragStateRef.current.dragDistance) / dragStateRef.current.threshold);

    if (steps > dragStateRef.current.processedSteps) {
      const direction = dragStateRef.current.dragDistance > 0 ? "prev" : "next";
      rotate(direction);
      dragStateRef.current.processedSteps = steps;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && expandedCard !== null) {
        closeCard();
      } else if (e.key === "ArrowLeft" && expandedCard === null) {
        rotate("prev");
      } else if (e.key === "ArrowRight" && expandedCard === null) {
        rotate("next");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [expandedCard, isDragging]);

  return (
    <div className="py-20 px-4 bg-bg-secondary overflow-x-hidden">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap");

        .focus-areas-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 10;
        }

        .focus-areas-subtitle {
          color: #c9a227;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
          display: block;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .focus-areas-main-title {
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 700;
          color: #0d4a2e;
          line-height: 1.2;
          font-family: "Playfair Display", serif;
        }

        .slider-container {
          perspective: 1500px;
          perspective-origin: 50% 50%;
          cursor: grab;
          width: 100%;
          max-width: 1400px;
          height: 700px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .slider-container.dragging {
          cursor: grabbing;
        }

        .slider-track {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transform-style: preserve-3d;
          width: 100%;
          height: 100%;
          position: absolute;
        }

        .slider-track.blurred .portfolio-card:not(.expanded) {
          filter: blur(8px);
          transition: filter 0.6s ease;
        }

        .portfolio-card {
          flex-shrink: 0;
          width: 240px;
          background: white;
          overflow: hidden;
          transform-style: preserve-3d;
          position: relative;
          cursor: pointer;
          transition: box-shadow 0.3s ease;
          will-change: transform, height, clip-path;
        }

        .portfolio-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to right,
            rgba(13, 74, 46, 0.2),
            transparent 30%,
            transparent 70%,
            rgba(13, 74, 46, 0.2)
          );
          transform: translateZ(-8px);
          pointer-events: none;
        }

        .portfolio-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #f5f3ef;
          transform: translateZ(-16px);
          box-shadow: 0 0 40px rgba(13, 74, 46, 0.2);
          pointer-events: none;
        }

        .portfolio-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          position: relative;
          z-index: 1;
        }

        /* Updated styles for the centered title overlay */
        .static-card-title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 85%;
          padding: 12px 8px;
          background: rgba(0, 0, 0, 0.65);
          border-radius: 4px;
          color: white;
          z-index: 3;
          text-align: center;
          backdrop-filter: blur(2px);
        }

        .static-card-title h3 {
          margin: 0;
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          font-family: 'Inter', -apple-system, sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          line-height: 1.3;
        }

        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(13, 74, 46, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 4;
        }

        .portfolio-card:hover .hover-overlay {
          opacity: 1;
        }

        .hover-overlay span {
          color: #c9a227;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          padding: 0 10px;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .card-info-panel {
          position: fixed;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%) translateY(20px);
          text-align: center;
          opacity: 0;
          pointer-events: none;
          z-index: 1001;
          max-width: 600px;
          width: 90%;
          padding: 2rem;
          background: #0d4a2e;
          color: white;
          box-shadow: 4px 3px 18px 4px rgba(0,0,0,0.15);
          min-width: 300px;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: 8px;
        }

        .card-info-panel.visible {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }

        .card-info-panel h2 {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 700;
          color: #c9a227;
          margin-bottom: 16px;
          font-family: "Playfair Display", serif;
        }

        .card-info-panel p {
          font-size: clamp(14px, 2vw, 18px);
          color: #f5f3ef;
          line-height: 1.7;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .close-btn-portfolio {
          position: fixed;
          top: 40px;
          right: 40px;
          width: 60px;
          height: 60px;
          background: white;
          border: 2px solid #0d4a2e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1002;
          opacity: 0;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 25px rgba(13, 74, 46, 0.2);
        }

        .close-btn-portfolio.visible {
          opacity: 1;
          pointer-events: all;
        }

        .close-btn-portfolio:hover {
          background: #0d4a2e;
          color: #c9a227;
          transform: rotate(90deg) scale(1.1);
          border-color: #0d4a2e;
        }

        .close-btn-portfolio svg {
          width: 24px;
          height: 24px;
          color: #0d4a2e;
        }

        .close-btn-portfolio:hover svg {
          color: #c9a227;
        }

        @media (max-width: 768px) {
          .slider-container {
            height: 500px;
          }
          .close-btn-portfolio {
            top: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
          }
          .card-info-panel {
            bottom: 40px;
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="focus-areas-header">
        <p className="focus-areas-subtitle">Strategic Priorities</p>
        <h1 className="focus-areas-main-title">Key Focus Areas</h1>
      </div>

      <div
        ref={containerRef}
        className={`slider-container ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      >
        <div ref={trackRef} className={`slider-track ${expandedCard !== null ? 'blurred' : ''}`}>
          {cardOrder.map((cardIndex, position) => (
            <div
              key={`card-${position}`}
              ref={el => cardsRef.current[position] = el}
              className="portfolio-card"
              onClick={() => expandCard(position)}
            >
              <img src={cards[cardIndex].img} alt={cards[cardIndex].title} />
              
              <div className="static-card-title">
                <h3>{cards[cardIndex].title}</h3>
              </div>
              
              <div className="hover-overlay">
                <span>View Details</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`close-btn-portfolio ${expandedCard !== null ? 'visible' : ''}`}
        onClick={closeCard}
        aria-label="Close details"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className={`card-info-panel ${expandedCard !== null ? 'visible' : ''}`}>
        <h2>{cardInfo.title}</h2>
        <p>{cardInfo.desc}</p>
      </div>
    </div>
  );
};

export default Carousel;