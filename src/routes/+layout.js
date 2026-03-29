/** Prerender all routes so GitHub Pages has a real HTML file per path (avoids /meta 404 on refresh). */
export const prerender = true;

/** Emit `meta/index.html` etc. so `…/repo/meta/` works on GitHub Pages (not only `meta.html`). */
export const trailingSlash = 'always';
