/* Førre Bygg — interaksjon
   Meny · sticky nav · scroll-reveal · galleri-filter · skjema · år */
(function () {
  'use strict';
  var doc = document;

  /* ---- Språk: velg tekster ut fra <html lang> ---- */
  var isEn = (doc.documentElement.getAttribute('lang') || '').toLowerCase().indexOf('en') === 0;
  var T = isEn ? {
    mailOpen: 'Opening your email app …',
    sending: 'Sending …',
    thanks: 'Thank you! We’ll be in touch as soon as we can.',
    error: 'Something went wrong. Please call us, or try again.',
    lblName: 'Name: ', lblEmail: 'Email: ', lblPhone: 'Phone: ',
    subject: 'Enquiry from website – '
  } : {
    mailOpen: 'Åpner e-postprogrammet ditt …',
    sending: 'Sender …',
    thanks: 'Takk! Vi tar kontakt så snart vi kan.',
    error: 'Noe gikk galt. Ring oss gjerne, eller prøv igjen.',
    lblName: 'Navn: ', lblEmail: 'E-post: ', lblPhone: 'Telefon: ',
    subject: 'Forespørsel fra nettside – '
  };

  /* ---- År i footer ---- */
  var yr = doc.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Mobilmeny ---- */
  var toggle = doc.getElementById('navToggle');
  var nav = doc.getElementById('primaryNav');
  function closeMenu() {
    doc.body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = doc.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---- Sticky header: skygge når man scroller ---- */
  var header = doc.querySelector('.site-header');
  if (header) {
    var mark = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    window.addEventListener('scroll', mark, { passive: true });
    mark();
  }

  /* ---- Logo/«Førre Bygg» → rull til toppen på forsiden ----
     Headeren er sticky, så nettleseren tror #hjem alltid er i visning og
     hopper ikke. Vi ruller derfor manuelt til toppen. */
  if (doc.getElementById('hjem')) {
    [].slice.call(doc.querySelectorAll('a[href="#hjem"]')).forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        closeMenu();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
      });
    });
  }

  /* ---- CTA → hopp til skjema og sett fokus på første felt ---- */
  var navnField = doc.getElementById('navn');
  function focusForm() {
    if (!navnField) return;
    // vent til smooth-scroll er i gang, så feltet ikke «rykker» siden
    setTimeout(function () {
      try { navnField.focus({ preventScroll: true }); } catch (e) { navnField.focus(); }
    }, 500);
  }
  [].slice.call(doc.querySelectorAll('a[href$="#kontakt"], a[href="#kontakt"]')).forEach(function (a) {
    a.addEventListener('click', function () {
      // kun når vi allerede er på forsiden (samme dokument)
      if (doc.getElementById('kontakt')) focusForm();
    });
  });
  // ankomst direkte via #kontakt i URL
  if (window.location.hash === '#kontakt') focusForm();

  /* ---- Flytende «Be om tilbud»-knapp ---- */
  var floatCta = doc.getElementById('ctaFloat');
  var hero = doc.querySelector('.hero');
  var kontakt = doc.getElementById('kontakt');
  if (floatCta && 'IntersectionObserver' in window) {
    var pastHero = false, atForm = false;
    var sync = function () {
      floatCta.classList.toggle('is-visible', pastHero && !atForm);
    };
    if (hero) {
      new IntersectionObserver(function (e) {
        pastHero = !e[0].isIntersecting; sync();
      }, { threshold: 0 }).observe(hero);
    } else { pastHero = true; }
    if (kontakt) {
      new IntersectionObserver(function (e) {
        atForm = e[0].isIntersecting; sync();
      }, { threshold: 0 }).observe(kontakt);
    }
    sync();
  }

  /* ---- Scroll-reveal ---- */
  var reveals = [].slice.call(doc.querySelectorAll('.reveal:not(.is-in)'));
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Galleri-filter ---- */
  var filters = [].slice.call(doc.querySelectorAll('.filter-btn'));
  var projects = [].slice.call(doc.querySelectorAll('#gallery .project'));
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      projects.forEach(function (p) {
        var show = f === 'all' || p.getAttribute('data-cat') === f;
        p.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---- Google Analytics: registrer innsendt henvendelse som lead ---- */
  function trackLead(method) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          currency: 'NOK',
          value: 0,
          method: method || 'contact_form',
          language: (doc.documentElement.getAttribute('lang') || '')
        });
      }
    } catch (e) {}
  }

  /* ---- Kontaktskjema ---- */
  var form = doc.getElementById('contactForm');
  var status = doc.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return; // la nettleseren vise feil
      var action = form.getAttribute('action') || '';
      // Ingen skjematjeneste satt opp ennå → fall tilbake til e-post
      if (action.indexOf('your-form-id') !== -1) {
        e.preventDefault();
        var navn = encodeURIComponent((form.navn.value || '').trim());
        var epost = encodeURIComponent((form.epost.value || '').trim());
        var tlf = encodeURIComponent((form.telefon.value || '').trim());
        var melding = encodeURIComponent((form.melding.value || '').trim());
        var body = T.lblName + navn + '%0D%0A' + T.lblEmail + epost + '%0D%0A' + T.lblPhone + tlf + '%0D%0A%0D%0A' + melding;
        window.location.href = 'mailto:Forrebygg@outlook.com?subject=' + encodeURIComponent(T.subject + decodeURIComponent(navn)) + '&body=' + body;
        if (status) { status.textContent = T.mailOpen; status.className = 'form-status ok'; }
        trackLead('email');
        return;
      }
      // Ekte Formspree-endepunkt → send i bakgrunnen
      e.preventDefault();
      if (status) { status.textContent = T.sending; status.className = 'form-status'; }
      fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (r.ok) {
            form.reset();
            if (status) { status.textContent = T.thanks; status.className = 'form-status ok'; }
            trackLead('contact_form');
          } else { throw new Error('feil'); }
        })
        .catch(function () {
          if (status) { status.textContent = T.error; status.className = 'form-status err'; }
        });
    });
  }

  /* ---- Bilder-lightbox (galleriside) ---- */
  var lb = doc.getElementById('lightbox');
  if (lb) {
    var lbImg = lb.querySelector('.lightbox__img');
    var lbCap = lb.querySelector('.lightbox__cap');
    var photos = [].slice.call(doc.querySelectorAll('.photo'));
    var lbIdx = 0;
    function lbRender() {
      var img = photos[lbIdx].querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.currentSrc || img.src;
      lbImg.alt = img.alt || '';
      if (lbCap) lbCap.textContent = img.alt || '';
    }
    function lbOpen(i) { lbIdx = i; lbRender(); lb.classList.add('is-open'); doc.body.classList.add('lb-open'); }
    function lbClose() { lb.classList.remove('is-open'); doc.body.classList.remove('lb-open'); }
    function lbGo(d) { lbIdx = (lbIdx + d + photos.length) % photos.length; lbRender(); }
    photos.forEach(function (p, i) { p.addEventListener('click', function () { lbOpen(i); }); });
    var btnClose = lb.querySelector('.lightbox__close');
    var btnPrev = lb.querySelector('.lightbox__prev');
    var btnNext = lb.querySelector('.lightbox__next');
    if (btnClose) btnClose.addEventListener('click', lbClose);
    if (btnPrev) btnPrev.addEventListener('click', function (e) { e.stopPropagation(); lbGo(-1); });
    if (btnNext) btnNext.addEventListener('click', function (e) { e.stopPropagation(); lbGo(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lbClose(); });
    doc.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbGo(-1);
      else if (e.key === 'ArrowRight') lbGo(1);
    });
  }

  /* ---- Cookie-samtykke (GDPR / Consent Mode) ---- */
  var CC_KEY = 'ffb-consent';
  var ccT = isEn ? {
    text: 'We use cookies for anonymous statistics about how the website is used. Analytics is only activated if you accept.',
    accept: 'Accept', decline: 'Decline', settings: 'Cookies', label: 'Cookie consent'
  } : {
    text: 'Vi bruker informasjonskapsler til anonym statistikk om hvordan nettsiden brukes. Statistikk aktiveres kun hvis du godtar.',
    accept: 'Godta', decline: 'Avslå', settings: 'Informasjonskapsler', label: 'Samtykke til informasjonskapsler'
  };
  function ccSet(val) {
    try { localStorage.setItem(CC_KEY, val); } catch (e) {}
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { 'analytics_storage': val === 'accepted' ? 'granted' : 'denied' });
    }
  }
  function ccBuild() {
    if (doc.querySelector('.cookie')) return;
    var d = doc.createElement('div');
    d.className = 'cookie';
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-label', ccT.label);
    d.innerHTML = '<p>' + ccT.text + '</p><div class="cookie__row">' +
      '<button class="btn btn--ghost" type="button" data-cc="decline">' + ccT.decline + '</button>' +
      '<button class="btn btn--ink" type="button" data-cc="accept">' + ccT.accept + '</button></div>';
    doc.body.appendChild(d);
    requestAnimationFrame(function () { d.classList.add('is-in'); });
    d.addEventListener('click', function (e) {
      var b = e.target.closest('[data-cc]');
      if (!b) return;
      ccSet(b.getAttribute('data-cc') === 'accept' ? 'accepted' : 'declined');
      d.classList.remove('is-in');
      setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 400);
    });
  }
  var ccStored;
  try { ccStored = localStorage.getItem(CC_KEY); } catch (e) {}
  if (ccStored !== 'accepted' && ccStored !== 'declined') ccBuild();
  // Footer-lenke for å endre samtykke senere
  var ccFooter = doc.querySelector('.footer__bottom');
  if (ccFooter) {
    var ccLink = doc.createElement('a');
    ccLink.href = '#';
    ccLink.className = 'cookie-link';
    ccLink.textContent = ccT.settings;
    ccLink.addEventListener('click', function (e) {
      e.preventDefault();
      try { localStorage.removeItem(CC_KEY); } catch (err) {}
      ccBuild();
    });
    ccFooter.appendChild(ccLink);
  }
})();
