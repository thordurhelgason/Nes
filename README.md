# Nes Endurskoðun – vefsíða

Kyrrstæð (static) vefsíða. Engin byggingarskref, engin þriðja aðila umgjörð –
hægt er að hlaða möppunni beint upp á vefþjón eða static hýsingu.

## Möppuuppbygging

```
index.html          Forsíða
about.html          Um okkur
contact.html        Hafa samband (mailto-form)
skraning.html       Falin skráningarsíða með Microsoft Forms innfellingu
404.html            Villusíða
robots.txt          Leitarvélar
sitemap.xml         Veftré
assets/
  css/styles.css    Allt útlit (sameiginlegt fyrir allar síður)
  js/main.js        Valmynd, hausahæð, tengiliðaform
  img/              logo.png, favicon.ico, hero.jpg
```

## Uppsetning á vefþjóni

- `404.html` þarf að vera stillt sem villusíða hjá hýsingaraðila.
- Lénið er skilgreint á þremur stöðum og þarf að passa saman:
  `<link rel="canonical">` og `og:url` í hverri HTML-síðu, `sitemap.xml`
  og `Sitemap:` línan í `robots.txt`. Núverandi gildi er
  `https://www.nesendurskodun.is`.
- Uppfærið `<lastmod>` í `sitemap.xml` þegar efni breytist.

## Skráningarsíðan (skraning.html)

Síðan er ekki tengd úr valmynd og er merkt `noindex, nofollow`.
Microsoft Forms eyðublaðið er fellt inn með `<iframe>`; slóðina má skipta út í
`src`-eigindinni. Svör eru vistuð í OneDrive með *Responses ▸ Open in Excel*
í Microsoft Forms.

## Tengiliðaformið (contact.html)

Það er enginn bakendi á síðunni. Formið sannreynir innslátt og opnar síðan
póstforrit notandans (`mailto:`). Ef raunveruleg móttaka skeyta er nauðsynleg
þarf ytri þjónustu (t.d. Formspree, Netlify Forms eða Azure Function) – þá er
`submit`-meðhöndlunin í `assets/js/main.js` uppfærð.
