# mavlyudabegim.com

Personal CV / portfolio website of Mavlyudabegim Mekhrilloeva, built with [Astro](https://astro.build) and hosted on GitHub Pages.

## Edit the content

| What | Where |
|---|---|
| Name, contact links, about text, stats, experience, education, skills, languages, awards | `src/data/cv.ts` |
| Projects (card on home page + own page each) | `src/content/projects/*.md` — add a new `.md` file to add a project |
| CV PDF for the download buttons | `public/Mavlyudabegim_Mekhrilloeva_CV.pdf` (keep the same file name) |
| Colors and global styles | `src/styles/global.css` |
| Page sections (layout/markup) | `src/components/*.astro` |

Push to `main` → GitHub Actions rebuilds and publishes the site automatically (about 1–2 minutes).

## Run locally (optional)

Requires Node.js 22.12 or newer.

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # production build in ./dist
```

## Project structure

```
public/            static files copied as-is (CNAME, favicon, CV PDF)
src/
  components/      Hero, About, Timeline, Skills, Projects, Languages, Contact, Nav, Icon
  content/projects/  one Markdown file per project
  data/cv.ts       all CV content
  layouts/Base.astro page shell (head, nav, footer, scroll animation)
  pages/           index, projects/[id], 404
.github/workflows/deploy.yml   build + deploy to GitHub Pages
```

## Hosting

- GitHub repo → Settings → Pages → Source: **GitHub Actions**, Custom domain: `mavlyudabegim.com`
- IONOS DNS: four `A` records for `@` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; `CNAME` `www` → `mavlyudabegim.github.io`
