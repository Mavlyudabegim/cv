// Prefixes internal links with the site's base path (e.g. "/cv" on GitHub Pages),
// so links keep working if the site moves to a custom domain (base "/") later.
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => `${base}${path.startsWith('/') ? path : `/${path}`}`;
