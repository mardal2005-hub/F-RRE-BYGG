/* ============================================================
   FØRRE BYGG – interaksjon
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  function closeMenu() {
    document.body.classList.remove('nav-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Åpne meny'); }
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Lukk meny' : 'Åpne meny');
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  }

  /* ---------- Gallery filter ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var projects = document.querySelectorAll('.project');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      projects.forEach(function (p) {
        var show = filter === 'all' || p.getAttribute('data-cat') === filter;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- Scroll reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');

  function setStatus(msg, ok) {
    if (!status) return;
    status.textContent = msg;
    status.classList.add('is-visible');
    status.classList.toggle('is-ok', ok);
    status.classList.toggle('is-err', !ok);
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var data = new FormData(form);
      var action = form.getAttribute('action') || '';
      var configured = action && action.indexOf('your-form-id') === -1;

      if (configured) {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sender …'; }
        fetch(action, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (res) {
            if (res.ok) {
              form.reset();
              setStatus('Takk! Vi har mottatt henvendelsen din og tar kontakt så snart som mulig.', true);
            } else {
              setStatus('Noe gikk galt. Prøv igjen, eller ring oss direkte.', false);
            }
          })
          .catch(function () {
            setStatus('Noe gikk galt. Prøv igjen, eller ring oss direkte.', false);
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = 'Send forespørsel'; }
          });
      } else {
        // Ingen skjematjeneste satt opp ennå – åpne e-postklient som reserve.
        var navn = encodeURIComponent(data.get('navn') || '');
        var epost = encodeURIComponent(data.get('epost') || '');
        var tlf = encodeURIComponent(data.get('telefon') || '');
        var melding = encodeURIComponent(data.get('melding') || '');
        var body = 'Navn: ' + navn + '%0D%0AE-post: ' + epost + '%0D%0ATelefon: ' + tlf + '%0D%0A%0D%0A' + melding;
        window.location.href = 'mailto:post@forrebygg.no?subject=' +
          encodeURIComponent('Forespørsel fra nettsiden') + '&body=' + body;
        setStatus('Vi åpner e-postprogrammet ditt med henvendelsen klar til å sendes.', true);
      }
    });
  }
})();
