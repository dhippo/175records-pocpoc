# 175 records — site vitrine

Site vitrine du collectif **175 records** (association loi 1901, Paris, depuis 2025). Identité brutaliste éditoriale, **light mode natif** et **dark mode** (« LIGHTS OUT ») switchable, bilingue EN/FR, logo manuscrit, curseur-projecteur et animations originales.

## Lancer en local

Site statique (HTML/CSS/JS, aucune dépendance).

**Recommandé** (polices + transitions parfaites) :

```bash
cd pocpoc
python3 -m http.server 5500
# http://localhost:5500
```

Ou `npx serve .`. Sinon, double-clic sur `index.html`.

## Pages

```
index.html      Home — accroche, signatures, aperçu soirées, newsletter
events.html     Events — temps forts (affiches DA) + agenda complet des 13 dates
artists.html    Artists — fondateurs Val & Louise mis en avant, puis les résidents
about.html      About — histoire (since 2025), valeurs, presse, contact
support.html    Support — adhérer / don / partenaire + mentions légales
```

## Thème & langue

Light par défaut. Bascule **EN/FR** et **Light/Dark** dans le footer (à droite), mémorisée d'une visite à l'autre. Le dark mode est l'ancien concept « club dans le noir ».

## Interactions

Curseur-projecteur révélant la couleur des photos N&B ; intro logo « le club s'allume » ; transitions de page ; cartes Events qui reprennent la DA de chaque soirée (survol + fiche détail) ; agenda survol coloré ; marquee, parallaxe, révélations au scroll. Respecte `prefers-reduced-motion`.

## Logo

Vrai logo 175 (page 8 du portfolio) traité en **masque** (`assets/img/logo-mask.png`) : il prend automatiquement l'encre du thème via CSS, donc reste net en clair comme en sombre. Présent à l'intro, en header (haut-gauche) et en footer.

## À brancher avant mise en ligne (handoff)

- **Liens** : Instagram `@175record.s` est en place ; SoundCloud, Bandcamp, billetterie Shotgun et liens artistes sont des `#` / placeholders à renseigner.
- **Newsletter** : le formulaire est en façade (front). Le connecter à Brevo / Mailchimp.
- **Adhésion / dons** : les boutons pointent vers une future campagne **HelloAsso** (à créer). Les mentions légales (réduction fiscale, RGPD, paiement) sont des **placeholders à valider juridiquement**.
- **Photos** : visuels et portraits issus du portfolio / des affiches, recadrés. Vérifier les droits.
- **Contenus** : textes bilingues éditables via les attributs `data-en` / `data-fr` dans le HTML.

Décisions et contenus de référence : voir `../conception/` (notamment `07_iteration-2.md` et `08_contenus-reference.md`).
