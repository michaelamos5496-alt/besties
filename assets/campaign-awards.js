// Creators Awards 2026 campaign: copy-to-clipboard buttons + sticky vote bar visibility.
(function () {
    'use strict';

    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta);
        return ok;
    }

    function copyText(text) {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
        }
        return Promise.resolve(fallbackCopy(text));
    }

    document.querySelectorAll('[data-copy]').forEach(function (btn) {
        var original = btn.textContent;
        var timer;
        btn.addEventListener('click', function () {
            copyText(btn.getAttribute('data-copy')).then(function (ok) {
                btn.textContent = ok ? 'Copied! ✓' : 'Press Ctrl/Cmd+C';
                btn.classList.toggle('is-copied', ok);
                clearTimeout(timer);
                timer = setTimeout(function () { btn.textContent = original; btn.classList.remove('is-copied'); }, 2000);
            });
        });
    });

    // Hide the sticky bar while the hero's own Vote Now button is on screen.
    var bar = document.getElementById('caSticky');
    var heroCta = document.getElementById('caHeroVote');
    if (bar && heroCta && 'IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
            bar.classList.toggle('is-hidden', entries[0].isIntersecting);
        }).observe(heroCta);
    }
})();
