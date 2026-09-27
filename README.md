# Zainab Koubaa — Personal academic website

A responsive static academic website with a plum, rose, and white theme. Content is based on the supplied CV; the layout is inspired by the academic structure of https://faresgr.github.io/. This is an independent implementation, not a modification of that repository.

## Preview

Open `dist/index.html` in a browser, or run:

```sh
python3 -m http.server 8765 --directory dist
```

## Edit

- `dist/index.html`: biography, research, publications, experience, and contact links.
- `dist/style.css`: colors, typography, and responsive layouts.
- `dist/assets/zainab-koubaa-cv.pdf`: original supplied CV.
- `dist/assets/favicon.svg`: monogram icon.

The site has no dependencies or build step. Upload the contents of `dist` to a static web host. For GitHub Pages, put these contents at the publishing root of the selected repository. No existing GitHub repository was modified.

## Review notes

The current role, publication metadata, and awards are transcribed from the supplied CV. The original CV remains downloadable. The supplied professional portrait is included as `dist/assets/zainab-koubaa.png`. English copy is adapted from the French CV; confirm the preferred translations of academic positions before public release.

## Publication status

A private Sites project was registered, but no deployment was completed because the local Sites plugin disappeared during the session. The project ID is retained in `.openai/hosting.json` so publication can resume without creating a duplicate.

## English and French

Use the EN / FR links in the navigation to change language. Each page links to its equivalent in the other language. Homepage section links retain the section when switching. The French homepage is `dist/fr/index.html`; the English homepage is `dist/index.html`. Edit both when changing profile content. Shared styles and images live in `dist/style.css` and `dist/assets/`.

The French site translates the research titles for readability and keeps official journal and conference names. The downloadable CV is the original supplied French PDF in both versions.

## Write a bilingual blog post / Écrire un article bilingue

1. Copy `posts/_template.md` to `posts/my-first-post.md` for the English version.
2. Copy `posts/_template.fr.md` to `posts/my-first-post.fr.md` for the French version. Use the same filename before `.fr.md` so both versions are linked.
3. Fill in each language’s title and summary, and use the same date in both files. Keep quotes around these values. Write the corresponding text below the second `---` line.
4. Leave `draft: true` while writing. Set `draft: false` in **both files** when both translations are ready. A draft in either file keeps the whole pair off the site. If a published file lacks its translation, the build reports a helpful error.
5. Run `npm ci` once, then `npm run build` after editing posts. Preview the updated English and French pages locally.
6. Upload the updated `dist` folder to your host. Building locally does not publish online.

En français : dupliquez les deux modèles, rédigez chaque version, puis passez `draft` à `false` dans les deux fichiers lorsque les traductions sont prêtes. Lancez ensuite `npm run build` et publiez le dossier `dist` actualisé.

For photos, place the image in `dist/assets/` and use `![Description](../assets/photo.jpg)` in either Markdown file; the build adjusts the French path automatically.

The templates and draft posts never appear on the public blog. Posts are sorted by date, newest first. The filename becomes the URL, so avoid renaming it after publishing. Dates are labels, not scheduled publication dates. Only trusted authors should edit Markdown; embedded HTML is supported. Translations are written by the author, not generated automatically.

The blog starts empty so no sample text is presented as Zainab’s writing. Generated pages live in `dist/blog` and `dist/fr/blog`; edit Markdown in `posts`, not generated HTML. Node.js 22 or newer is recommended.
