# Førre Bygg – nettside (demo)

Moderne, profesjonell demo-nettside for byggfirmaet **Førre Bygg** – oppføring,
oppgradering og utbedring av bolig, hytte og garasje.

Bygget som en statisk side (HTML, CSS og litt JavaScript) uten rammeverk eller
byggeprosess. Det gir rask lastetid og gjør den enkel å hoste hvor som helst.

> **Demo-merknad:** Innholdet bygger på informasjon som kan bekreftes offentlig
> (foretaksnavn, org.nr og adresse fra foretaksregisteret) samt tjenester og
> tekst avtalt for demoen. Telefon og e-post er **plassholdere** og må byttes ut
> med reelle opplysninger før lansering.

## Struktur

```
.
├── index.html            # Hele forsiden (hero, tjenester, referanser, om oss, kontakt, CTA, footer)
├── css/styles.css        # All styling (palett: hvit/lys, mørk blå, varm sand/tre)
├── js/main.js            # Meny, galleri-filter, scroll-animasjon og skjemahåndtering
├── assets/img/           # Logo/favicon, hero, om-oss og plassholderbilder (SVG)
│   └── projects/         # Her legges ekte prosjektbilder (.jpg)
├── robots.txt            # SEO
├── sitemap.xml           # SEO
└── .nojekyll             # Sikrer at alle filer serveres på GitHub Pages
```

## Kjøre lokalt

```bash
python3 -m http.server 8000
# åpne http://localhost:8000
```

## Innhold som må fylles inn før lansering

| Hva | Hvor | Merket med |
|-----|------|-----------|
| **Telefon** | `index.html` (kontakt + footer), `js/main.js` | `+47 XXX XX XXX` / `tel:+47XXXXXXXX`, attributt `data-placeholder` |
| **E-post** | `index.html` (kontakt + footer), `js/main.js` | `post@forrebygg.no`, attributt `data-placeholder` |
| **Skjematjeneste** | `index.html` (`<form action=...>`) | `formspree.io/f/your-form-id` |

Søk i koden etter `data-placeholder` og `your-form-id` for å finne dem raskt.

## Bytte inn ekte bilder

Bildene i galleriet og hero er tydelige plassholdere (SVG). De byttes inn uten å
endre HTML – bare legg en fil med riktig navn i mappen, så vises fotoet automatisk:

| Plassering | Filnavn (legg inn ekte foto) | Reserve vises til fotoet er på plass |
|-----------|------------------------------|--------------------------------------|
| Hero (øverst) | `assets/img/hero-photo.webp` (allerede lagt inn) | `assets/img/hero.svg` |
| Om oss | `assets/img/about.jpg` | `assets/img/about.svg` |
| Referanser | `assets/img/projects/bolig-1.jpg`, `oppussing-1.jpg`, `tilbygg-1.jpg`, `andre-1.jpg`, `bolig-2.jpg`, `oppussing-2.jpg` | tilhørende `ph-*.svg` |

Hvert `<img>` har en `onerror`-reserve, så siden ser aldri «tom» ut. Anbefalt
bildestørrelse: liggende, ca. 1600×1000 px eller større. Vil du legge til flere
prosjekter, kopiér et `<article class="project ...">`-element og sett `data-cat`
til `bolig`, `oppussing`, `tilbygg` eller `andre`.

## Kontaktskjema

Skjemaet fungerer ut av boksen: uten en skjematjeneste åpner det kundens
e-postprogram med en ferdig utfylt melding. For å motta forespørsler automatisk,
opprett et skjema hos [Formspree](https://formspree.io) og bytt ut
`action="https://formspree.io/f/your-form-id"` i `index.html` med din egen URL.
JavaScript sender da skjemaet i bakgrunnen og viser en takkemelding.

## Design

- Palett: hvit/lys bakgrunn, mørk blå (`#0e2740` / `#12324f`) og varm sand/tre (`#c9a678`)
- Typografi: **Fraunces** (overskrifter) og **Inter** (brødtekst/UI)
- Diskrete scroll-animasjoner, med hensyn til `prefers-reduced-motion`
- Responsivt for mobil, tablet og desktop
- SEO: meta-tagger, Open Graph, strukturert data (GeneralContractor), sitemap og robots.txt

## Publisere (med HTTPS)

Siden er statisk og kan publiseres gratis med automatisk HTTPS via **GitHub Pages**,
**Netlify**, **Vercel** eller **Cloudflare Pages**.
