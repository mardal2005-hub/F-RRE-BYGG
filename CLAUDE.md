# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page marketing site for **Førre Bygg**, a builder/contractor (byggmester) in Tysvær, Norway. Static HTML/CSS/JS, no framework, no build process, no package.json. Content and UI copy are in Norwegian (Bokmål).

## Faste arbeidsregler (design og utvikling)

Dette prosjektet er en premium, konverteringsrettet nettside for en norsk bedrift. Disse reglene gjelder for alt design- og kodearbeid her, og går foran generiske vaner — les dem før du gjør større endringer.

**Arbeidsflyt**
- Før større design- eller kodeendringer: les og forstå relevant eksisterende struktur (HTML-seksjon, CSS-regler, JS-logikk som berøres) før du skriver noe.
- Ikke gjør tilfeldige eller generiske AI-endringer. Alt skal være en bevisst beslutning for *dette* prosjektet, ikke en standardløsning.
- Bevar det som allerede fungerer godt. Endre det kun når endringen er en tydelig forbedring — ikke omskriv for omskrivingens skyld.
- Ved vage designoppgaver: tenk gjennom målgruppe, merkevare, konvertering, visuell retning og eksisterende design *før* du implementerer. Ikke gjett deg til en løsning.
- Ved større redesign: skisser en kort intern designplan (seksjonsstruktur, visuell retning, hva som endres og hvorfor) før du bygger.
- Gjør arbeidet ferdig ordentlig. Ikke stopp ved en halvferdig løsning eller lever noe som "nesten" fungerer.

**Designstandard**
- Siden skal føles premium, profesjonell og menneskedesignet — aldri som en generisk AI-generert mal.
- Unngå: tilfeldige gradients, overdreven glassmorphism, for mange "kort", og effekter uten funksjon.
- Typografi, spacing, farger, layout og visuelt hierarki skal være bevisste og konsistente — bruk designtokens i `css/styles.css` (`:root`), ikke hardkodede engangsverdier.
- Bruk luft/spacing presist — ikke for trangt, ikke fylt med tomrom uten hensikt.
- Hver seksjon skal ha én tydelig funksjon. Ikke gjør alle seksjoner like — skap variasjon og rytme i layout fra seksjon til seksjon.
- Hero skal være sterk og kommunisere verdi umiddelbart.
- CTA-er skal være tydelige og strategisk plassert — ikke tilfeldig duplisert eller utvannet.
- Unngå overdreven border-radius og annet som gir "template"-utseende.
- Ikke legg til dekorasjon bare for å fylle tomrom.

**Responsivt design**
- Sjekk alltid desktop, tablet og mobil for enhver visuell endring.
- Mobil er ikke en nedprioritert kopi av desktop — den skal fungere like godt som sitt eget layout.
- Ingen overflow, kolliderende elementer, for liten tekst, eller knapper/lenker som er vanskelige å treffe.
- Navigasjon, spacing og seksjonsrekkefølge skal fungere godt på små skjermer, ikke bare klemmes sammen.

**Kvalitetssjekk før noe erklæres ferdig**
1. Gå gjennom relevante filer og kontroller at implementasjonen er konsekvent (samme mønster, samme tokens, ingen glemte rester).
2. Se etter visuelle og funksjonelle feil.
3. Sjekk responsive problemer (desktop/tablet/mobil).
4. Se etter unødvendig eller duplisert kode.
5. Kontroller at lenker, knapper og skjema faktisk fungerer.
6. Bruk screenshot/visuell inspeksjon der det er mulig for å kritisk vurdere resultatet.
7. Hvis endringen berører `<head>`, tekstinnhold eller bilder: gå gjennom SEO-sjekklisten under «SEO / structured data».
8. Still spørsmålet: «Ser dette faktisk ut som arbeid fra et profesjonelt webbyrå?»
9. Hvis svaret er nei — forbedre det før du sier deg ferdig.

**Verktøy å bruke aktivt i dette arbeidet**
Disse er allerede tilgjengelige skills (ingen installasjon nødvendig) — bruk dem proaktivt i stedet for å stole på generiske vaner:
- `frontend-design` — ved enhver ny seksjon, redesign eller vag designoppgave, for å treffe en bevisst visuell retning i stedet for et templat-utseende.
- `ui-ux-pro-max` — som konkret motpart til «Responsivt design» og «Designstandard» over: typografi/fargeparring, tilgjengelighet, spacing og responsivt layout.
- `code-review` (`/code-review`) — etter større endringer i `index.html`/`css/styles.css`/`js/main.js`, for å fange duplisert eller inkonsistent kode (punkt 1 og 4 over).
- `run` — for å faktisk starte siden lokalt og verifisere at en endring virker i praksis før den kalles ferdig, ikke bare anta det fra koden.

**Ved forbedringsforespørsler**
- Ikke velg den første, mest åpenbare løsningen automatisk.
- Vurder internt minst et par alternative løsninger.
- Velg den sterkeste løsningen for nettopp dette prosjektet, ikke den mest generiske.
- Prioriter kvalitet på resultatet fremfor minst mulig kode.
- Hvis en endring kan påvirke andre deler av siden (delte tokens, delte klasser, nav-lenker, seksjonsrekkefølge), sjekk konsekvensene før du leverer.

**Språk og kommunikasjon**
- Naturlig norsk bokmål tilpasset norske kunder — ikke direkteoversatt engelsk markedsføringsspråk.
- Unngå generisk AI-markedsføring og tomme superlativer ("markedsledende", "unik løsning" uten dekning).
- Skriv konkret, troverdig og tydelig — konkrete fordeler og fakta slår vage påstander.

## Running locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No install step, no bundler, no linter/test suite configured. Editing `index.html`, `css/styles.css`, or `js/main.js` directly and reloading the browser is the whole workflow.

## Architecture

Everything lives in three files:

- `index.html` — the entire page, as a sequence of `<section>` blocks in one `<main>`: Hero → intro → Tjenester (services) → Referanser (project gallery with client-side filter) → Slik jobber vi (process steps) → Om oss (about) → Kontakt (contact form) → Footer. Section order and anchor IDs (`#tjenester`, `#referanser`, `#om-oss`, `#kontakt`) are referenced by both the header nav and footer nav — keep them in sync if a section is renamed or reordered.
- `css/styles.css` — one file, no preprocessor. Starts with a `:root` design-token block (colors, fonts, container width, section spacing, easing) that everything else consumes — adjust tokens there rather than hardcoding values in individual rules. Design direction is "editorial premium": warm paper-white/near-black palette with a muted slate accent, Fraunces (serif, headings) + Inter (sans, UI/body).
- `js/main.js` — a single IIFE, no modules/dependencies. Handles: footer year, mobile nav toggle, sticky-header scroll state, scroll-reveal via `IntersectionObserver` (elements need class `reveal`, optionally `data-delay`), gallery category filter (`data-filter` buttons vs. `data-cat` project cards), and the contact form submit handler.

### Contact form behavior

`#contactForm` posts to a Formspree endpoint. As shipped, the `action` still contains the literal placeholder `your-form-id`; `js/main.js` detects that placeholder and falls back to opening the user's email client via a `mailto:` link with a pre-filled body instead of submitting. Once a real Formspree form ID is set in the `action` attribute, the JS automatically switches to a real `fetch` POST with inline success/error status text — no other code change needed.

### Placeholder content

Phone number, email, and several images (hero, about, project photos) are placeholders with graceful fallbacks:

- Images use `onerror` to fall back to hand-drawn SVG placeholders in `assets/img/` (e.g. `ph-bolig.svg`, `about.svg`) if the real photo file is missing.
- Phone/email placeholders are marked with `data-placeholder` attributes in `index.html` — search for that attribute to find every spot needing real contact info before launch.
- Address and org number (`929 226 208`) are real, sourced from the public business register; phone/email are not yet confirmed.

### Cache-busting

`<link>`/`<script>` tags for `styles.css` and `main.js` use manual `?v=N` query params (currently `v=22` and `v=3`). Bump these when shipping a change to that file so browsers/CDNs don't serve a stale cached copy.

### SEO / structured data

`index.html` `<head>` carries a `GeneralContractor` JSON-LD block, Open Graph tags, and a canonical URL pointing at `https://forrebygg.no/`. Keep these in sync with any changes to business info (address, services, name) made elsewhere on the page.

There is no dedicated SEO tool in this workflow — check these manually whenever `<head>`, headings, images, or the sitemap are touched:

- `<title>` and `meta description` still accurately reflect the page content and stay within normal length limits (title ~50–60 chars, description ~150–160 chars) — don't let them silently drift out of sync with copy changes.
- Exactly one `<h1>` per page, and heading levels (`h1`→`h2`→`h3`) stay in logical order — don't skip levels or add a second `h1` for styling convenience.
- Every real `<img>` has descriptive, non-generic `alt` text (already the pattern in the gallery); purely decorative SVGs stay `aria-hidden`.
- The `GeneralContractor` JSON-LD block matches the visible contact info, service list, and address exactly — a mismatch here is worse than no structured data at all.
- Open Graph title/description/image and `canonical` still match the current page content.
- `sitemap.xml` and `robots.txt` reflect the actual pages that exist (e.g. if a new top-level page is added alongside `index.html`).
- New content keeps the existing local-SEO focus (Tysvær/Haugalandet) rather than drifting into generic phrasing.
- No new render-blocking resources were added above the fold; images added follow the existing `loading="lazy"` + `onerror` fallback pattern except genuinely above-the-fold assets (hero), which should stay preloaded like `hero-poster.jpg`.
