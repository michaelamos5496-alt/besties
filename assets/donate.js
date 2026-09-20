(function () {
    var CFG = window.BESTIES_CONFIG || {};
    var KEY = CFG.paystackKey || '';
    var WA = CFG.whatsapp || '';
    var READY = /^pk_(test|live)_/.test(KEY);
    var AMOUNTS = [50, 100, 200, 500];
    var MIN = 10;
    var paystackLoading = null;

    function money(n) { return 'GH₵' + Number(n).toLocaleString('en-US'); }

    function loadPaystack() {
        if (window.PaystackPop) return Promise.resolve();
        if (!paystackLoading) {
            paystackLoading = new Promise(function (resolve, reject) {
                var sc = document.createElement('script');
                sc.src = 'https://js.paystack.co/v2/inline.js';
                sc.onload = resolve;
                sc.onerror = function () { paystackLoading = null; reject(new Error('load')); };
                document.head.appendChild(sc);
            });
        }
        return paystackLoading;
    }

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
    function validPhone(v) { var d = v.replace(/[^0-9]/g, ''); return d.length >= 9 && d.length <= 15; }
    function newRef() { return 'DON-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase(); }

    var TEMPLATE =
        '<div class="bd">' +
        '<div data-view="form">' +
        '<h2 class="bd-title">Support Besties</h2>' +
        '<p class="bd-intro">Help us empower more girls. Choose an amount and give securely.</p>' +
        '<form class="bd-form" novalidate>' +
        '<div class="bd-amounts" role="radiogroup" aria-label="Donation amount"></div>' +
        '<div class="bd-field" data-field="custom" hidden><label>Amount (GH₵)</label><input type="number" inputmode="decimal" min="10" step="1" placeholder="Enter amount"><div class="bd-err">The minimum donation is GH₵10.</div></div>' +
        '<div class="bd-field" data-field="name"><label>Full name *</label><input type="text" maxlength="80" autocomplete="name"><div class="bd-err">Please enter your name.</div></div>' +
        '<div class="bd-field" data-field="email"><label>Email *</label><input type="email" maxlength="120" autocomplete="email" inputmode="email"><div class="bd-err">Please enter a valid email address.</div></div>' +
        '<div class="bd-field" data-field="phone"><label>Phone (optional)</label><input type="tel" maxlength="20" autocomplete="tel" inputmode="tel" placeholder="e.g. 024 123 4567"><div class="bd-err">Please enter a valid phone number.</div></div>' +
        '<button type="submit" class="bd-pay">Donate</button>' +
        '<div class="bd-error" role="alert" hidden></div>' +
        '</form>' +
        '<p class="bd-note">Secure payment by Paystack. Pay with card or mobile money.</p>' +
        '</div>' +
        '<div class="bd-done" data-view="done" hidden>' +
        '<div class="bd-tick" aria-hidden="true">✓</div>' +
        '<h3 data-role="thanks">Thank you!</h3>' +
        '<p data-role="summary"></p>' +
        '<div class="bd-ref" data-role="ref"></div>' +
        '<p class="bd-wa-note" data-role="note"></p>' +
        '<a class="bd-wa-link" data-role="wa" href="#" target="_blank" rel="noopener">WhatsApp did not open? Tap here.</a>' +
        '<button type="button" class="bd-again">Donate again</button>' +
        '</div>' +
        '</div>';

    function mount(host) {
        if (host.__bd) return host.__bd;
        host.innerHTML = TEMPLATE;
        var root = host.firstChild;
        var q = function (sel) { return root.querySelector(sel); };
        var api = {};
        host.__bd = api;

        if (!READY) {
            var off = document.createElement('div');
            off.className = 'bd-off';
            off.innerHTML = '<h2 class="bd-title">Support Besties</h2><p class="bd-intro">Online giving is not available right now.</p>';
            var a = document.createElement('a');
            a.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent("Hi Besties! I'd like to donate to support the girls. How can I give?");
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = 'Donate on WhatsApp';
            off.appendChild(a);
            root.innerHTML = '';
            root.appendChild(off);
            api.reset = function () {};
            return api;
        }

        var form = q('form');
        var wrap = q('.bd-amounts');
        var payBtn = q('.bd-pay');
        var errBox = q('.bd-error');
        var customField = q('[data-field="custom"]');
        var customInput = customField.querySelector('input');
        var selected = 100;
        var buttons = [];

        function currentAmount() {
            if (selected === 'other') { var n = parseFloat(customInput.value); return isFinite(n) ? Math.round(n * 100) / 100 : 0; }
            return selected;
        }
        function label() { var a = currentAmount(); payBtn.textContent = a >= MIN ? 'Donate ' + money(a) : 'Donate'; }

        AMOUNTS.concat(['other']).forEach(function (a) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'bd-amt' + (a === selected ? ' active' : '');
            b.setAttribute('role', 'radio');
            b.setAttribute('aria-checked', a === selected ? 'true' : 'false');
            b.textContent = a === 'other' ? 'Other' : money(a);
            b.addEventListener('click', function () {
                selected = a;
                buttons.forEach(function (x) { var on = x === b; x.classList.toggle('active', on); x.setAttribute('aria-checked', on ? 'true' : 'false'); });
                customField.hidden = a !== 'other';
                customField.classList.remove('invalid');
                if (a === 'other') customInput.focus();
                label();
            });
            buttons.push(b);
            wrap.appendChild(b);
        });
        customInput.addEventListener('input', function () { customField.classList.remove('invalid'); label(); });
        label();

        function field(name) { return q('[data-field="' + name + '"]'); }
        function input(name) { return field(name).querySelector('input'); }
        function flag(name, bad) { field(name).classList.toggle('invalid', bad); }
        ['name', 'email', 'phone'].forEach(function (n) { input(n).addEventListener('input', function () { flag(n, false); }); });
        form.addEventListener('focusin', function () { loadPaystack().catch(function () {}); }, { once: true });

        function showError(t) { errBox.textContent = t; errBox.hidden = !t; }

        function done(ref, v, amount) {
            q('[data-role="thanks"]').textContent = 'Thank you, ' + v.name.split(' ')[0] + '!';
            q('[data-role="summary"]').textContent = 'Your donation of ' + money(amount) + ' was received. Thank you for supporting the girls.';
            q('[data-role="ref"]').textContent = ref;
            var msg = ['Hi Besties! I have just made a donation.', '', 'Amount: ' + money(amount), 'Payment: Paid online (Paystack)', 'Reference: ' + ref, 'Name: ' + v.name, 'Email: ' + v.email]
                .concat(v.phone ? ['Phone: ' + v.phone] : []);
            var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg.join('\n'));
            q('[data-role="wa"]').href = url;
            q('[data-view="form"]').hidden = true;
            q('[data-view="done"]').hidden = false;
            var note = q('[data-role="note"]');
            var win = window.open(url, '_blank');
            if (win) {
                note.textContent = 'Your donation details are being sent to WhatsApp. Please tap Send in WhatsApp so we receive them.';
            } else {
                note.textContent = 'Sending your donation details to WhatsApp. Please tap Send in WhatsApp so we receive them.';
                setTimeout(function () { window.location.href = url; }, 1200);
            }
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (payBtn.disabled) return;
            var amount = currentAmount();
            var v = { name: input('name').value.trim(), email: input('email').value.trim(), phone: input('phone').value.trim() };
            var bad = { custom: selected === 'other' && !(amount >= MIN), name: v.name.length < 2, email: !validEmail(v.email), phone: !!v.phone && !validPhone(v.phone) };
            customField.classList.toggle('invalid', bad.custom);
            ['name', 'email', 'phone'].forEach(function (n) { flag(n, bad[n]); });
            var first = ['custom', 'name', 'email', 'phone'].filter(function (k) { return bad[k]; })[0];
            if (first) { field(first).querySelector('input').focus(); return; }
            if (!(amount >= MIN)) return;
            var ref = newRef();
            var parts = v.name.split(/\s+/);
            payBtn.disabled = true;
            payBtn.textContent = 'Opening payment...';
            showError('');
            function again() { payBtn.disabled = false; label(); }
            loadPaystack().then(function () {
                new window.PaystackPop().newTransaction({
                    key: KEY,
                    email: v.email,
                    amount: Math.round(amount * 100),
                    currency: 'GHS',
                    reference: ref,
                    firstName: parts[0],
                    lastName: parts.slice(1).join(' '),
                    phone: v.phone || undefined,
                    metadata: { custom_fields: [
                        { display_name: 'Type', variable_name: 'type', value: 'Donation' },
                        { display_name: 'Donor name', variable_name: 'donor_name', value: v.name },
                        { display_name: 'Phone', variable_name: 'phone', value: v.phone || '-' }
                    ] },
                    onSuccess: function (tx) { again(); done((tx && tx.reference) || ref, v, amount); },
                    onCancel: function () { again(); showError('Payment cancelled. You have not been charged.'); },
                    onError: function () { again(); showError('Payment could not be started. Please try again.'); }
                });
            }).catch(function () {
                again();
                showError('Could not load the payment window. Please check your connection and try again.');
            });
        });

        api.reset = function () {
            q('[data-view="done"]').hidden = true;
            q('[data-view="form"]').hidden = false;
            showError('');
            payBtn.disabled = false;
            label();
        };
        q('.bd-again').addEventListener('click', api.reset);
        return api;
    }

    window.BestiesDonate = { mount: mount, reset: function (host) { if (host && host.__bd) host.__bd.reset(); } };
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('[data-donate]').forEach(mount);
    });
})();
