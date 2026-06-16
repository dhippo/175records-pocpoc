# 175 records — site vitrine « LIGHTS OUT »

Site vitrine du collectif **175 records**. Concept : un club plongé dans le noir, ossature brutaliste monochrome, **la couleur ne vient que des soirées**. Trois pages, bilingue EN/FR (anglais natif), curseur-projecteur, animations originales.

## Lancer en local

Le site est statique (HTML/CSS/JS, aucune dépendance à installer).

**Option simple** : double-clique sur `index.html` pour l'ouvrir dans le navigateur.

**Option recommandée** (pour que tout fonctionne parfaitement, polices et transitions) : sers le dossier en local.

```bash
cd pocpoc
python3 -m http.server 5500
# puis ouvre http://localhost:5500
```

Ou avec Node :

```bash
cd pocpoc
npx serve .
```

## Structure

```
pocpoc/
  index.html      Home
  events.html     Events (cartes monochromes qui reprennent la DA de chaque soirée)
  about.html      About us
  assets/
    css/styles.css   Système de DA « LIGHTS OUT »
    js/main.js       Curseur-projecteur, révélation couleur, i18n, transitions
    img/             Affiches et photos optimisées
```

## Ce qui est implémenté

- **Curseur-projecteur** : un halo révèle la couleur et le grain des photos en noir et blanc.
- **Intro « le club s'allume »** + transitions de page « coupure de lumière ».
- **Events** : chaque soirée est en N&B, puis reprend sa DA d'origine au survol ; clic = fiche détaillée colorisée dans la DA de la soirée.
- **Bilingue EN/FR** : bascule dans le footer, anglais par défaut, choix mémorisé.
- **Grain**, vignette, marquee des signatures, parallaxe, révélations au scroll, étoile animée.
- **Accessibilité** : respect de `prefers-reduced-motion`, navigation clavier sur les cartes.

## Personnaliser

- **Textes** : éditer les attributs `data-en` / `data-fr` directement dans le HTML.
- **Couleur d'une soirée** : attribut `--ev` (style) + `data-color` sur la carte `.ev` dans `events.html`.
- **Liens** (Instagram, Shotgun, booking) : remplacer les `href="#"` dans les footers.
- **Polices** : chargées via Google Fonts (Archivo + Space Grotesk). Pour un usage 100% hors-ligne, télécharger et self-host.

## Notes

Concept et décisions de conception détaillés dans `../conception/`.
Visuels et photos sont ceux fournis par l'asso, recadrés et optimisés. Vérifier les droits avant mise en ligne publique.
