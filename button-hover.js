// Elastic hover for buttons: springy scale-up on enter, quicker eased settle on leave.
// Mirrors the GSAP easeReverse demo (elastic.out(1.2, 0.3), exit at 2.5x) using a
// plain tween back to 1, since the site runs GSAP 3.12.5 which has no easeReverse.
(function () {
    var SELECTOR = [
        '.btn', '.cta-btn', '.hero-cta-btn', '.event-btn', '.featured-btn',
        '.join-cta-btn', '.contact-btn', '.footer-contact-btn',
        '.apply-submit-btn', '.add-to-cart-btn', '.checkout-btn'
    ].join(',');
    var ENTER_DURATION = 1.2;
    var EXIT_SPEED = 2.5;

    if (!window.matchMedia('(hover: hover)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function init() {
        // The CSS hover rules use transition: all and translateY; keep only the colour
        // transitions so they don't fight the GSAP scale.
        var style = document.createElement('style');
        style.textContent = SELECTOR.split(',').join(',\n') +
            ' { transition-property: background-color, color, border-color, box-shadow, opacity !important; }';
        document.head.appendChild(style);

        function target(el) {
            var btn = el && el.closest ? el.closest(SELECTOR) : null;
            if (!btn || btn.disabled || btn.classList.contains('disabled') ||
                btn.getAttribute('aria-disabled') === 'true') return null;
            return btn;
        }

        document.addEventListener('mouseover', function (e) {
            var btn = target(e.target);
            if (!btn || btn.contains(e.relatedTarget)) return;
            // Wide buttons would spill past their container at 1.35x.
            var scale = btn.offsetWidth > 220 ? 1.06 : 1.35;
            gsap.to(btn, { scale: scale, y: 0, duration: ENTER_DURATION, ease: 'elastic.out(1.2, 0.3)', overwrite: 'auto' });
        });

        document.addEventListener('mouseout', function (e) {
            var btn = target(e.target);
            if (!btn || btn.contains(e.relatedTarget)) return;
            gsap.to(btn, { scale: 1, y: 0, duration: ENTER_DURATION / EXIT_SPEED, ease: 'power2.out', overwrite: 'auto' });
        });
    }

    if (window.gsap) {
        init();
    } else {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
        s.onload = init;
        document.head.appendChild(s);
    }
})();
