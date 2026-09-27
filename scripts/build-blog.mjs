import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';

const root = path.resolve(import.meta.dirname, '..');
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const words = {
 en: {skip:'Skip to content',home:'Zainab Koubaa home',nav:'Main navigation',language:'Language',about:'About',research:'Research',teaching:'Teaching',back:'Back to home',all:'← All posts',read:'Read post →',eyebrow:'NOTES & REFLECTIONS',heading:'The <em>blog</em>',intro:'Research updates and conference reports.',empty:'No posts yet.',emptyBody:'New posts will appear here.',description:'Research notes, reflections, and updates from Zainab Koubaa.'},
 fr: {skip:'Aller au contenu',home:'Accueil de Zainab Koubaa',nav:'Navigation principale',language:'Langue',about:'À propos',research:'Recherche',teaching:'Enseignement',back:'Retour à l’accueil',all:'← Tous les articles',read:'Lire l’article →',eyebrow:'NOTES & RÉFLEXIONS',heading:'Le <em>blog</em>',intro:'Actualités de recherche et comptes rendus de conférences.',empty:'Aucun article pour le moment.',emptyBody:'Les prochains articles seront publiés ici.',description:'Notes de recherche, réflexions et actualités de Zainab Koubaa.'}
};
const displayDate = (value,lang) => new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value));
const groups = new Map();
for (const file of await readdir(path.join(root, 'posts'))) {
 if (!file.endsWith('.md') || file.startsWith('_')) continue;
 const {data, content} = matter(await readFile(path.join(root,'posts',file),'utf8'));
 const lang = file.endsWith('.fr.md') ? 'fr' : 'en';
 const slug = file.replace(/(?:\.fr)?\.md$/, '');
 if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${file}: use lowercase letters, numbers and hyphens in the filename.`);
 if (slug === 'index') throw new Error(`${file}: choose a filename other than index.`);
 const group = groups.get(slug) ?? {};
 groups.set(slug,group);
 if (data.draft === true) { group[lang] = {draft:true}; continue; }
 const date = data.date instanceof Date ? data.date.toISOString().slice(0,10) : String(data.date ?? '');
 if (typeof data.title !== 'string' || !data.title.trim() || typeof data.summary !== 'string' || !data.summary.trim()) throw new Error(`${file}: title and summary are required.`);
 if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0,10) !== date) throw new Error(`${file}: date must be a real YYYY-MM-DD date.`);
 group[lang] = {slug,title:data.title,summary:data.summary,date,html:marked.parse(content),draft:false};
}
const published=[];
for (const [slug,group] of groups) {
 // A draft in either language keeps the entire pair private until both are ready.
 if (group.en?.draft || group.fr?.draft) continue;
 if (!group.en || !group.fr) throw new Error(`${slug}: add both ${slug}.md (English) and ${slug}.fr.md (French), or keep draft: true until both are ready.`);
 if (group.en.date !== group.fr.date) throw new Error(`${slug}: use the same publication date in both language versions.`);
 published.push(group);
}
published.sort((a,b)=>b.en.date.localeCompare(a.en.date)||a.en.slug.localeCompare(b.en.slug));
function page(lang,title,description,body,filename='index.html') {
 const t=words[lang], assets=lang==='fr'?'../../':'../';
 const en=lang==='fr'?`../../blog/${filename}`:filename;
 const fr=lang==='en'?`../fr/blog/${filename}`:filename;
 return `<!doctype html>
<html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escape(title)} — Zainab Koubaa</title><meta name="description" content="${escape(description)}"><meta name="theme-color" content="#572840"><link rel="icon" href="${assets}assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="${assets}style.css"><link rel="alternate" hreflang="en" href="${en}"><link rel="alternate" hreflang="fr" href="${fr}"></head>
<body><a class="skip" href="#main">${t.skip}</a><header><div class="nav-wrap"><a class="brand" href="../index.html" aria-label="${t.home}">zk<span>.</span></a><nav aria-label="${t.nav}"><a href="../index.html#about">${t.about}</a><a href="../index.html#research">${t.research}</a><a href="../index.html#publications">Publications</a><a href="../index.html#teaching">${t.teaching}</a><a href="index.html" aria-current="page">Blog</a><a class="nav-cv" href="${assets}assets/zainab-koubaa-cv.pdf">CV ↗</a><span class="language-switch" role="group" aria-label="${t.language}"><a href="${en}" lang="en" hreflang="en"${lang==='en'?' aria-current="true"':''}>EN</a><a href="${fr}" lang="fr" hreflang="fr"${lang==='fr'?' aria-current="true"':''}>FR</a></span></nav></div></header><main id="main" class="blog-wrap wrap">${body}</main><footer class="wrap"><p>© ${new Date().getFullYear()} Zainab Koubaa</p><a href="../index.html">${t.back}</a></footer></body></html>`;
}
// Validate the whole bilingual collection before replacing generated pages.
for (const lang of ['en','fr']) {
 const t=words[lang];
 const output=path.join(root,'dist',...(lang==='fr'?['fr']:[]),'blog');
 await mkdir(output,{recursive:true});
 for (const file of await readdir(output)) if(file.endsWith('.html')) await rm(path.join(output,file));
 for (const group of published) {
  const post=group[lang];
  // Templates use ../assets/ from English blog pages; French pages sit one level deeper.
  const html=lang==='fr'?post.html.replace(/(src|href)="\.\.\/assets\//g,'$1="../../assets/'):post.html;
  await writeFile(path.join(output,`${post.slug}.html`),page(lang,post.title,post.summary,`<article class="blog-post"><a class="text-link" href="index.html">${t.all}</a><header class="post-header"><p class="eyebrow"><time datetime="${post.date}">${displayDate(post.date,lang)}</time></p><h1>${escape(post.title)}</h1><p class="lead">${escape(post.summary)}</p></header><div class="prose">${html}</div></article>`,`${post.slug}.html`));
 }
 const listing=published.length?published.map(group=>{const post=group[lang];return `<article class="blog-entry"><time datetime="${post.date}">${displayDate(post.date,lang)}</time><h2><a href="${post.slug}.html">${escape(post.title)}</a></h2><p>${escape(post.summary)}</p><a class="text-link" href="${post.slug}.html">${t.read}</a></article>`;}).join('\n'):`<div class="blog-empty"><h2>${t.empty}</h2><p>${t.emptyBody}</p></div>`;
 await writeFile(path.join(output,'index.html'),page(lang,'Blog',t.description,`<div class="blog-intro"><p class="eyebrow">${t.eyebrow}</p><h1>${t.heading}</h1><p class="lead">${t.intro}</p></div>${listing}`));
}
console.log(`Built English and French blogs with ${published.length} published post pair(s).`);
