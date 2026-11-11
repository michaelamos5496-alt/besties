// Shared GSAP motion for the Besties sub-pages (news, articles, podcast, contact, shop preview, campaign page).
// The homepage and older pages keep their own inline GSAP. Requires gsap + ScrollTrigger (cdnjs, 3.12.5).
// Principles: subtle rise + fade, one easing, short durations, staggered groups, nothing hidden without JS,
// and no motion at all for visitors who prefer reduced motion.
(function () {
    'use strict';
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out' });

    // Only the properties GSAP animates are cleared afterwards, so inline styles and CSS hover effects survive.
    var CLEAR = 'opacity,transform,visibility,transition';

    function list(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (el) {
            return !el.closest('.lightbox');
        });
    }

    // Page-load intro for above-the-fold headers.
    function intro(selector, opts) {
        var els = list(selector);
        if (!els.length) return;
        opts = opts || {};
        gsap.fromTo(els,
            { y: opts.y || 26, opacity: 0, transition: 'none' },
            { y: 0, opacity: 1, duration: opts.duration || 0.8, stagger: opts.stagger || 0.12, delay: opts.delay || 0.05,
              onComplete: function () { gsap.set(els, { clearProps: CLEAR }); } });
    }

    // Scroll reveal: elements start hidden, then rise in (staggered together when they enter at the same time).
    function reveal(selector, opts) {
        var els = list(selector);
        if (!els.length) return;
        opts = opts || {};
        var y = opts.y || 30;
        gsap.set(els, { opacity: 0, y: y, transition: 'none' });
        ScrollTrigger.batch(els, {
            start: opts.start || 'top 90%',
            once: true,
            onEnter: function (batch) {
                gsap.to(batch, {
                    opacity: 1, y: 0, duration: opts.duration || 0.75, stagger: opts.stagger || 0.1, overwrite: true,
                    onComplete: function () { gsap.set(batch, { clearProps: CLEAR }); }
                });
            }
        });
    }

    // Hero images ease in slightly scaled-up, for a calm, premium settle.
    function settle(selector) {
        var els = list(selector);
        if (!els.length) return;
        gsap.fromTo(els,
            { opacity: 0, scale: 1.04, transition: 'none' },
            { opacity: 1, scale: 1, duration: 1.1, delay: 0.25, onComplete: function () { gsap.set(els, { clearProps: CLEAR }); } });
    }

    // ----- Intros (above the fold) -----
    intro('.article-header > *, .news-header > *, .header > *, .ca-hero-grid > div > *');
    settle('.article-image');
    intro('.news-tabs-wrap', { y: 16, delay: 0.35 });
    settle('.ca-hero-art');

    // ----- Scroll reveals -----
    reveal('.article-body > *:not(.nominee-grid):not(.sika-photos)', { y: 24, stagger: 0.08 });
    reveal('.nominee-grid > *, .sika-photos > *, .article-gallery .gallery-item', { y: 34 });
    reveal('.article-gallery h2, .gallery-view-more-wrapper, .article-actions > *', { y: 20 });
    reveal('.news-grid > .post-card');
    reveal('.pod-story, .pod-grid > *');
    reveal('.product');
    reveal('.contact-main > *');
    reveal('.ca-section .ca-h2, .ca-section .ca-sub, .ca-way, .ca-code, .ca-share .ca-btn, .ca-disclaimer');

    // Late-loading images shift layout; keep trigger positions accurate.
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
