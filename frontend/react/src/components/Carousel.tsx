import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Carousel = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const [expandedCard, setExpandedCard] = useState(null);
  const [cardInfo, setCardInfo] = useState({ title: '', desc: '' });
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef({
    startX: 0,
    dragDistance: 0,
    processedSteps: 0,
    threshold: 60
  });
  const cloneRef = useRef(null);

  const positions = [
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

  const cards = [
    {
      title: "Beverage Branding",
      desc: "Fresh and vibrant packaging design for premium juice products with natural ingredients",
      img: "https://images.unsplash.com/photo-1546548970-71785318a17b?w=600&h=800&fit=crop"
    },
    {
      title: "Apparel Design",
      desc: "Minimalist fashion collection with sustainable materials and modern aesthetics",
      img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=800&fit=crop"
    },
    {
      title: "Luxury Packaging",
      desc: "Premium product packaging with attention to detail and sophisticated finishes",
      img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=800&fit=crop"
    },
    {
      title: "Cosmetics Brand",
      desc: "Clean beauty brand identity with elegant and timeless design approach",
      img: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&h=800&fit=crop"
    },
    {
      title: "Fashion Editorial",
      desc: "Editorial photography and art direction for contemporary fashion magazine",
      img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=800&fit=crop"
    }
  ];

  const [cardOrder, setCardOrder] = useState([0, 1, 2, 3, 4]);

  useEffect(() => {
    applyPositions();
  }, [cardOrder]);

  const applyPositions = () => {
    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      const pos = positions[index] || positions[positions.length - 1];
      gsap.set(card, {
        height: pos.height,
        clipPath: pos.clip,
        transform: `translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) translateY(${pos.y}px)`
      });
    });
  };

  const expandCard = (index) => {
    if (expandedCard !== null || isDragging) return;

    const card = cardsRef.current[index];
    const cardData = cards[cardOrder[index]];
    
    setExpandedCard(index);
    setCardInfo({ title: cardData.title, desc: cardData.desc });

    const rect = card.getBoundingClientRect();
    
    const clone = card.cloneNode(true);
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
    const clone = cloneRef.current;
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

  const rotate = (direction) => {
    if (expandedCard !== null) return;

    cardsRef.current.forEach((card, index) => {
      if (!card) return;
      let newIndex;
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
        newOrder.push(first);
        return newOrder;
      } else {
        const newOrder = [...prev];
        const last = newOrder.pop();
        newOrder.unshift(last);
        return newOrder;
      }
    });
  };

  const handleDragStart = (e) => {
    if (expandedCard !== null) return;
    setIsDragging(true);
    dragStateRef.current.startX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
    dragStateRef.current.dragDistance = 0;
    dragStateRef.current.processedSteps = 0;
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.type.includes("mouse") ? e.clientX : e.touches[0].clientX;
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
    const handleKeyDown = (e) => {
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
    <div className="py-20 px-4 bg-gray-50 overflow-x-hidden">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
        
        .portfolio-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
          z-index: 10;
        }

        .portfolio-subtitle {
          color: #ff6b35;
          font-size: 14px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
          display: block;
        }

        .portfolio-main-title {
          font-size: clamp(28px, 5vw, 56px);
          font-weight: 900;
          color: #0a0a0a;
          line-height: 1.1;
          font-family: "Poppins", sans-serif;
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
            rgba(0, 0, 0, 0.15),
            transparent 30%,
            transparent 70%,
            rgba(0, 0, 0, 0.15)
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
          background: #e0e0e0;
          transform: translateZ(-16px);
          box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);
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

        .hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 2;
        }

        .portfolio-card:hover .hover-overlay {
          opacity: 1;
        }

        .hover-overlay span {
          color: white;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-align: center;
          padding: 0 10px;
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
          background: #ff6b35;
          color: white;
          box-shadow: 4px 3px 18px 4px rgba(0,0,0,0.1);
          min-width: 300px;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-info-panel.visible {
          opacity: 1;
          pointer-events: all;
          transform: translateX(-50%) translateY(0);
        }

        .card-info-panel h2 {
          font-size: clamp(24px, 4vw, 36px);
          font-weight: 900;
          color: #0a0a0a;
          margin-bottom: 16px;
          font-family: "Poppins", sans-serif;
        }

        .card-info-panel p {
          font-size: clamp(14px, 2vw, 18px);
          color: #080808;
          line-height: 1.6;
          font-family: "Poppins", sans-serif;
        }

        .close-btn-portfolio {
          position: fixed;
          top: 40px;
          right: 40px;
          width: 60px;
          height: 60px;
          background: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1002;
          opacity: 0;
          pointer-events: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .close-btn-portfolio.visible {
          opacity: 1;
          pointer-events: all;
        }

        .close-btn-portfolio:hover {
          background: #ff6b35;
          color: white;
          transform: rotate(90deg) scale(1.1);
        }

        .close-btn-portfolio svg {
          width: 24px;
          height: 24px;
          color: #0a0a0a;
        }
        
        .close-btn-portfolio:hover svg {
          color: white;
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

      <div className="portfolio-header">
        <p className="portfolio-subtitle">Behind creativity</p>
        <h1 className="portfolio-main-title">Curious what else we've created?</h1>
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
              <div className="hover-overlay">
                <span>Click to see more</span>
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