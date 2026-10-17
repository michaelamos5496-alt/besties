(function () {
    document.querySelectorAll('[data-swipe]').forEach(function (el) {
        var n = el.children.length;
        if (n < 2 || n > 8 || el.hasAttribute("data-swipe-nodots")) return;
        var dots = document.createElement('div');
        dots.className = 'swipe-dots';
        dots.setAttribute('aria-hidden', 'true');
        for (var i = 0; i < n; i++) dots.appendChild(document.createElement('span'));
        el.parentNode.insertBefore(dots, el.nextSibling);
        var list = dots.children;
        list[0].classList.add('active');
        el.addEventListener('scroll', function () {
            var first = el.firstElementChild;
            var gap = parseFloat(getComputedStyle(el).columnGap) || 16;
            var i = Math.round(el.scrollLeft / (first.offsetWidth + gap));
            for (var k = 0; k < list.length; k++) list[k].classList.toggle('active', k === i);
        }, { passive: true });
    });
})();
