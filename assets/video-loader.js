(function () {
    var mobile = window.matchMedia('(max-width: 768px)').matches;

    document.querySelectorAll('video[data-src]').forEach(function (video) {
        var src = (mobile && video.getAttribute('data-src-mobile')) || video.getAttribute('data-src');
        var loaded = false;

        function play() {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
        }

        function show() {
            if (!loaded) {
                loaded = true;
                video.src = src;
            }
            play();
        }

        if (!('IntersectionObserver' in window)) {
            show();
            return;
        }

        new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) show();
                else video.pause();
            });
        }, { rootMargin: '150px' }).observe(video);
    });
})();
