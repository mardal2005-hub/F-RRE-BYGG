# Førre Bygg – nettside

Moderne, konverteringsrettet nettside for **Førre Bygg** – byggefirma i Tysvær på
Haugalandet. Oppføring, oppgradering og utbedring av bolig, hytte og garasje.

Bygget som en rask, statisk side (HTML, CSS og litt JavaScript) uten rammeverk eller
byggeprosess. Enkel å hoste hvor som helst, med automatisk HTTPS på GitHub Pages,
Netlify eller lignende.

## Designretning

Redaksjonell «premium»-stil: dempet varm palett (papirhvit · nær-sort · messing/sand),
elegant serif (Fraunces) kombinert med ren sans (Inter), stor fotografi, mye luft og
diskrete animasjoner ved scrolling. Ingen unødvendige effekter.

## Struktur

```
.
├── index.html            # Hele forsiden
├── css/styles.css        # Designsystem og all styling
├── js/main.js            # Meny, sticky nav, scroll-reveal, galleri-filter, skjema
├── assets/img/           # Hero-foto, favicon, plassholdere for prosjekt-/om-bilder
├── personvern.html       # Personvern
├── robots.txt · sitemap.xml
└── .nojekyll
```

Seksjoner: Hero → Om (intro) → Tjenester → Referanser (galleri m/ filter) →
Slik jobber vi → Om oss → CTA-bånd → Kontakt → Footer.

## Kjøre lokalt

```bash
python3 -m http.server 8000
# åpne http://localhost:8000
```

## Bytte inn ekte innhold

| Hva | Hvor | Merket med |
|-----|------|-----------|
| **Hero-foto** | `assets/img/hero-photo.webp` (allerede lagt inn) | fallback: `assets/img/hero.svg` |
| **Prosjektbilder** | legg filer i `assets/img/projects/` med navnene i `index.html` (`bolig-1.jpg`, `oppussing-1.jpg`, `tilbygg-1.jpg`, `andre-1.jpg`, `bolig-2.jpg`, `oppussing-2.jpg`) | fallback: `assets/img/ph-*.svg` |
| **Om oss-bilde** | `assets/img/about.jpg` | fallback: `assets/img/about.svg` |
| **Telefon / e-post** | søk etter `data-placeholder` i `index.html` | `+47 XXX XX XXX` / `post@forrebygg.no` |

Alle bilder har `onerror`-fallback til en plassholder, så siden ser aldri «tom» ut før
ekte foto er på plass. Prosjektbildene byttes inn uten å endre oppsettet.

### Kontaktskjema

Skjemaet fungerer ut av boksen: uten en skjematjeneste åpner det kundens e-postprogram
med en ferdig utfylt melding. For å motta forespørsler automatisk, opprett et skjema hos
[Formspree](https://formspree.io) og bytt ut `your-form-id` i `action` på `#contactForm`.

## Bekreftet informasjon

Adresse (Lyngvegen 7C, 5563 Førresfjorden) og org.nr (929 226 208) er hentet fra
offentlig foretaksregister. Telefon og e-post er plassholdere til de bekreftes.

## SEO / lokal synlighet

- Tittel, meta-beskrivelse og nøkkelord rettet mot Tysvær/Haugalandet
- Open Graph for deling
- Strukturert data (`GeneralContractor`) med adresse, `areaServed` og fagområder
- `sitemap.xml`, `robots.txt`, semantisk HTML og god ytelse (preload av hero, `lazy` på bilder)
