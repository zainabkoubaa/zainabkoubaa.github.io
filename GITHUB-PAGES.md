# Publish on GitHub Pages

1. Sign into the GitHub account that will own the website.
2. Create a public repository named exactly `USERNAME.github.io`, replacing USERNAME with that account's GitHub username. If this repository already exists, inspect it before replacing anything.
3. Upload the project contents at the root of the repository: `dist`, `posts`, `scripts`, `package.json`, `package-lock.json`, `.gitignore`, `.github`, and the guides. Do not upload the ZIP file itself, an extra enclosing folder, `node_modules`, or `.openai`.
4. Ensure the branch is named `main`.
5. Under Settings → Pages → Build and deployment, choose GitHub Actions as the Source.
6. In Actions → Publish website, choose Run workflow on main (or rerun the first run if it happened before Pages was enabled).
7. After the build and deploy jobs succeed, open the URL shown in the deployment, normally `https://USERNAME.github.io/`.

If using GitHub's browser upload, Finder hides dot-folders such as `.github`; press Command+Shift+Period to show them. Confirm `.github/workflows/deploy.yml` appears in the repository. Alternatively, create that exact file through Add file → Create new file and paste the supplied workflow contents.

## Updates

Edit files on GitHub and commit to main; the workflow rebuilds and publishes automatically. Local `npm run build` is only needed for local preview.

For bilingual posts, create matching `posts/title.md` and `posts/title.fr.md` files using the templates. Keep `draft: true` until both versions exist and are ready, then set it to false in both files. A draft in either file keeps the pair off the rendered blog. Draft Markdown in a public repository is still publicly readable in the repository.

The downloadable CV includes the contact details from the supplied original. The website, CV, and files in a public repository will be public.
