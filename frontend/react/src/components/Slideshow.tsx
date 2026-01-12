import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// TypeScript declarations for external libraries
declare global {
  interface Window {
    $: any;
    jQuery: any;
    TweenMax: any;
    Power3: any;
  }
}

const Slideshow = () => {
  const navigate = useNavigate();
  const slideshowRef = useRef(null);

  useEffect(() => {
    // Load external scripts
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js';
    document.head.appendChild(gsapScript);

    const jqueryScript = document.createElement('script');
    jqueryScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js';
    document.head.appendChild(jqueryScript);

    // Wait for scripts to load
    const initSlideshow = () => {
      if (!window.$ || !window.TweenMax) {
        setTimeout(initSlideshow, 100);
        return;
      }

      const $ = window.$;
      const TweenMax = window.TweenMax;
      const Power3 = window.Power3;
      const slideshowDuration = 4000;
      const slideshow = $('.main-content .slideshow');
      const windowHeight = $(window).height();

      function slideshowSwitch(slideshow: any, index: any, auto: any) {
        if (slideshow.data('wait')) return;

        var slides = slideshow.find('.slide');
        var activeSlide = slides.filter('.is-active');
        var activeSlideImage = activeSlide.find('.image-container');
        var newSlide = slides.eq(index);
        var newSlideImage = newSlide.find('.image-container');
        var newSlideContent = newSlide.find('.slide-content');
        var newSlideElements = newSlide.find('.caption > *');
        if (newSlide.is(activeSlide)) return;

        newSlide.addClass('is-new');
        var timeout = slideshow.data('timeout');
        clearTimeout(timeout);
        slideshow.data('wait', true);
        var transition = slideshow.attr('data-transition');
        if (transition == 'fade') {
          newSlide.css({
            display: 'block',
            zIndex: 2
          });
          newSlideImage.css({
            opacity: 0
          });

          TweenMax.to(newSlideImage, 1, {
            alpha: 1,
            onComplete: function() {
              newSlide.addClass('is-active').removeClass('is-new');
              activeSlide.removeClass('is-active');
              newSlide.css({ display: '', zIndex: '' });
              newSlideImage.css({ opacity: '' });
              slideshow.find('.pagination').trigger('check');
              slideshow.data('wait', false);
              if (auto) {
                timeout = setTimeout(function() {
                  slideshowNext(slideshow, false, true);
                }, slideshowDuration);
                slideshow.data('timeout', timeout);
              }
            }
          });
        } else {
          var newSlideRight: any;
          var newSlideLeft: any;
          var newSlideImageRight: any;
          var newSlideImageLeft: any;
          var newSlideImageToRight: any;
          var newSlideImageToLeft: any;
          var newSlideContentLeft: any;
          var newSlideContentRight: any;
          var activeSlideImageLeft: any;

          if (newSlide.index() > activeSlide.index()) {
            newSlideRight = 0;
            newSlideLeft = 'auto';
            newSlideImageRight = -slideshow.width() / 8;
            newSlideImageLeft = 'auto';
            newSlideImageToRight = 0;
            newSlideImageToLeft = 'auto';
            newSlideContentLeft = 'auto';
            newSlideContentRight = 0;
            activeSlideImageLeft = -slideshow.width() / 4;
          } else {
            newSlideRight = '';
            newSlideLeft = 0;
            newSlideImageRight = 'auto';
            newSlideImageLeft = -slideshow.width() / 8;
            newSlideImageToRight = '';
            newSlideImageToLeft = 0;
            newSlideContentLeft = 0;
            newSlideContentRight = 'auto';
            activeSlideImageLeft = slideshow.width() / 4;
          }

          newSlide.css({
            display: 'block',
            width: 0,
            right: newSlideRight,
            left: newSlideLeft,
            zIndex: 2
          });

          newSlideImage.css({
            width: slideshow.width(),
            right: newSlideImageRight,
            left: newSlideImageLeft
          });

          newSlideContent.css({
            width: slideshow.width(),
            left: newSlideContentLeft,
            right: newSlideContentRight
          });

          activeSlideImage.css({
            left: 0
          });

          TweenMax.set(newSlideElements, { y: 20, force3D: true });
          TweenMax.to(activeSlideImage, 1, {
            left: activeSlideImageLeft,
            ease: Power3.easeInOut
          });

          TweenMax.to(newSlide, 1, {
            width: slideshow.width(),
            ease: Power3.easeInOut
          });

          TweenMax.to(newSlideImage, 1, {
            right: newSlideImageToRight,
            left: newSlideImageToLeft,
            ease: Power3.easeInOut
          });

          TweenMax.staggerFromTo(newSlideElements, 0.8, { alpha: 0, y: 60 }, {
            alpha: 1,
            y: 0,
            ease: Power3.easeOut,
            force3D: true,
            delay: 0.6
          }, 0.1, function() {
            newSlide.addClass('is-active').removeClass('is-new');
            activeSlide.removeClass('is-active');
            newSlide.css({
              display: '',
              width: '',
              left: '',
              zIndex: ''
            });

            newSlideImage.css({
              width: '',
              right: '',
              left: ''
            });

            newSlideContent.css({
              width: '',
              left: ''
            });

            newSlideElements.css({
              opacity: '',
              transform: ''
            });

            activeSlideImage.css({
              left: ''
            });

            slideshow.find('.pagination').trigger('check');
            slideshow.data('wait', false);
            if (auto) {
              timeout = setTimeout(function() {
                slideshowNext(slideshow, false, true);
              }, slideshowDuration);
              slideshow.data('timeout', timeout);
            }
          });
        }
      }

      function slideshowNext(slideshow: any, previous: any, auto: any) {
        var slides = slideshow.find('.slide');
        var activeSlide = slides.filter('.is-active');
        var newSlide = null;
        if (previous) {
          newSlide = activeSlide.prev('.slide');
          if (newSlide.length === 0) {
            newSlide = slides.last();
          }
        } else {
          newSlide = activeSlide.next('.slide');
          if (newSlide.length == 0)
            newSlide = slides.filter('.slide').first();
        }

        slideshowSwitch(slideshow, newSlide.index(), auto);
      }

      function homeSlideshowParallax() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > windowHeight) return;
        var inner = slideshow.find('.slideshow-inner');
        var newHeight = windowHeight - (scrollTop / 2);
        var newTop = scrollTop * 0.8;

        inner.css({
          transform: 'translateY(' + newTop + 'px)',
          height: newHeight
        });
      }

      $('.slide').addClass('is-loaded');

      $('.slideshow .arrows .arrow').on('click', function(this: any) {
        slideshowNext($(this).closest('.slideshow'), $(this).hasClass('prev'), true);
      });

      $('.slideshow .pagination .item').on('click', function(this: any) {
        slideshowSwitch($(this).closest('.slideshow'), $(this).index(), true);
      });

      $('.slideshow .pagination').on('check', function(this: any) {
        var slideshow = $(this).closest('.slideshow');
        var pages = $(this).find('.item');
        var index = slideshow.find('.slides .is-active').index();
        pages.removeClass('is-active');
        pages.eq(index).addClass('is-active');
      });

      $('.slideshow .btn').on('click', function(this: any, e: any) {
        e.preventDefault();
        var href = $(this).attr('href');
        if (href) {
          navigate(href);
        }
      });

      var timeout = setTimeout(function() {
        slideshowNext(slideshow, false, true);
      }, slideshowDuration);

      slideshow.data('timeout', timeout);

      if ($('.main-content .slideshow').length > 1) {
        $(window).on('scroll', homeSlideshowParallax);
      }
    };

    gsapScript.onload = () => {
      jqueryScript.onload = () => {
        initSlideshow();
      };
    };

    return () => {
      if (window.$) {
        window.$('.slideshow').data('timeout') && clearTimeout(window.$('.slideshow').data('timeout'));
        window.$(window).off('scroll');
        window.$('.slideshow .arrows .arrow').off('click');
        window.$('.slideshow .pagination .item').off('click');
        window.$('.slideshow .pagination').off('check');
        window.$('.slideshow .btn').off('click');
      }
    };
  }, [navigate]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&family=Oswald:wght@300;400&display=swap');


        .btn {
            display: inline-block;
            padding: 13px 20px;
            color: #fff;
            text-decoration: none;
            position: relative;
            background: transparent;
            border: 1px solid #e1e1e1;
            font: 12px/1.2 "Oswald", sans-serif;
            letter-spacing: 0.4em;
            text-align: center;
            text-indent: 2px;
            text-transform: uppercase;
            transition: color 0.1s linear 0.05s;
            cursor: pointer;
        }

        .btn::before {
            content: "";
            display: block;
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 1px;
            background: #e1e1e1;
            z-index: 1;
            opacity: 0;
            transition: height 0.2s ease, top 0.2s ease, opacity 0s linear 0.2s;
        }

        .btn::after {
            transition: border 0.1s linear 0.05s;
        }

        .btn .btn-inner {
            position: relative;
            z-index: 2;
        }

        .btn:hover {
            color: #373737;
            transition: color 0.1s linear 0s;
        }

        .btn:hover::before {
            top: 0;
            height: 100%;
            opacity: 1;
            transition: height 0.2s ease, top 0.2s ease, opacity 0s linear 0s;
        }

        .btn:hover::after {
            border-color: #373737;
            transition: border 0.1s linear 0s;
        }

        .slideshow {
            overflow: hidden;
            position: relative;
            width: 100%;
            height: 100vh;
            z-index: 1;
        }

        .slideshow .slideshow-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .slideshow .slides {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .slideshow .slide {
            display: none;
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .slideshow .slide.is-active {
            display: block;
        }

        .slideshow .slide.is-loaded {
            opacity: 1;
        }

        .slideshow .slide .caption {
            padding: 0 100px;
        }

        .slideshow .slide .image-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-position: center;
            z-index: 1;
            background-size: cover;
            image-rendering: optimizeQuality;
        }

        .slideshow .slide .image-container::before {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
        }

        .slideshow .slide .image {
            width: 100%;
            object-fit: cover;
            height: 100%;
        }

        .slideshow .slide-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .slideshow .slide .title {
            margin: 0 auto 15px;
            max-width: 1000px;
            font: 300 50px/1.2 "Oswald", sans-serif;
            letter-spacing: 0.35em;
            text-transform: uppercase;
        }

        .slideshow .slide .text {
            margin: 0 auto;
            max-width: 1000px;
            font-size: 18px;
            line-height: 1.4;
        }

        .slideshow .slide .btn {
            margin: 15px 0 0;
            border-color: #fff;
        }

        .slideshow .slide .btn::before {
            background: #fff;
        }

        .slideshow .pagination {
            position: absolute;
            bottom: 35px;
            left: 0;
            width: 100%;
            height: 12px;
            cursor: default;
            z-index: 2;
            text-align: center;
        }

        .slideshow .pagination .item {
            display: inline-block;
            padding: 15px 5px;
            position: relative;
            width: 46px;
            height: 32px;
            cursor: pointer;
            text-indent: -999em;
            z-index: 1;
        }

        .slideshow .pagination .item + .page {
            margin-left: -2px;
        }

        .slideshow .pagination .item::before {
            content: "";
            display: block;
            position: absolute;
            top: 15px;
            left: 5px;
            width: 36px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            transition: background 0.2s ease;
        }

        .slideshow .pagination .item::after {
            width: 0;
            background: #fff;
            z-index: 2;
            transition: width 0.2s ease;
        }

        .slideshow .pagination .item:hover::before,
        .slideshow .pagination .item.is-active::before {
            background-color: #fff;
        }

        .slideshow .arrows .arrow {
            margin: -33px 0 0;
            padding: 20px;
            position: absolute;
            top: 50%;
            cursor: pointer;
            z-index: 3;
        }

        .slideshow .arrows .prev {
            left: 30px;
        }

        .slideshow .arrows .prev:hover .svg {
            left: -10px;
        }

        .slideshow .arrows .next {
            right: 30px;
        }

        .slideshow .arrows .next:hover .svg {
            left: 10px;
        }

        .slideshow .arrows .svg {
            position: relative;
            left: 0;
            width: 14px;
            height: 26px;
            fill: #fff;
            transition: left 0.2s ease;
        }
        
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            border: 0;
        }
      `}</style>

      <main className="main-content">
        <section className="slideshow" ref={slideshowRef}>
          <div className="slideshow-inner">
            <div className="slides">
              <div className="slide is-active">
                <div className="slide-content">
                  <div className="caption">
                    <div className="title">Readiness Eritrea</div>
                    <div className="text">
                      <p>National Designated Authority - Advancing climate action, building resilience, and securing a sustainable future for Eritrea through Green Climate Fund</p>
                    </div>
                    <a href="/mission" className="btn">
                      <span className="btn-inner">Learn More</span>
                    </a>
                  </div>
                </div>
                <div className="image-container">
                  <img src="/readiness eritrea.jpg" alt="" className="image" />
                </div>
              </div>
              <div className="slide">
                <div className="slide-content">
                  <div className="caption">
                    <div className="title">Climate Finance</div>
                    <div className="text">
                      <p>Facilitating access to climate finance and supporting transformative projects that enhance climate resilience across Eritrea</p>
                    </div>
                    <a href="/gcf-project" className="btn">
                      <span className="btn-inner">Learn More</span>
                    </a>
                  </div>
                </div>
                <div className="image-container">
                  <img src="/climate finance.jpg" alt="" className="image" />
                </div>
              </div>
              <div className="slide">
                <div className="slide-content">
                  <div className="caption">
                    <div className="title">Sustainable Development</div>
                    <div className="text">
                      <p>Building climate-resilient communities through strategic partnerships and effective climate finance mechanisms</p>
                    </div>
                    <a href="/sustainable-development" className="btn">
                      <span className="btn-inner">Learn More</span>
                    </a>
                  </div>
                </div>
                <div className="image-container">
                  <img src="/Sustainable Development.jpg" alt="" className="image" />
                </div>
              </div>
            </div>
      
            <div className="arrows">
              <div className="arrow prev">
                <span className="svg svg-arrow-left">
                  <svg version="1.1" id="svg4-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enableBackground="new 0 0 14 26" xmlSpace="preserve">
                    <path d="M13,26c-0.256,0-0.512-0.098-0.707-0.293l-12-12c-0.391-0.391-0.391-1.023,0-1.414l12-12c0.391-0.391,1.023-0.391,1.414,0s0.391,1.023,0,1.414L2.414,13l11.293,11.293c0.391,0.391,0.391,1.023,0,1.414C13.512,25.902,13.256,26,13,26z"/>
                  </svg>
                  <span className="alt sr-only"></span>
                </span>
              </div>
              <div className="arrow next">
                <span className="svg svg-arrow-right">
                  <svg version="1.1" id="svg5-Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="26px" viewBox="0 0 14 26" enableBackground="new 0 0 14 26" xmlSpace="preserve">
                    <path d="M1,0c0.256,0,0.512,0.098,0.707,0.293l12,12c0.391,0.391,0.391,1.023,0,1.414l-12,12c-0.391,0.391-1.023,0.391-1.414,0s-0.391-1.023,0-1.414L11.586,13L0.293,1.707c-0.391-0.391-0.391-1.023,0-1.414C0.488,0.098,0.744,0,1,0z"/>
                  </svg>
                  <span className="alt sr-only"></span>
                </span>
              </div>
            </div>
          </div> 
        </section>
      </main>
    </>
  );
};

export default Slideshow;