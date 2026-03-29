import adapter from '@sveltejs/adapter-static';

/** GitHub Pages / env may omit a leading slash; SvelteKit requires '' or a path like `/repo`. */
function normalizeBase(path) {
	if (path == null || path === '') return '';
	const s = String(path).trim();
	if (!s) return '';
	// Reject Windows paths or drive letters — a bad BASE_PATH breaks prerender and asset URLs.
	if (/^[a-zA-Z]:/.test(s) || s.includes('\\')) return '';
	const withLead = s.startsWith('/') ? s : `/${s}`;
	return withLead.replace(/\/$/, '');
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ fallback: '404.html' }),
		paths: {
			base: process.argv.includes('dev') ? '' : normalizeBase(process.env.BASE_PATH),
		},
		prerender: {
			// Allow missing PDFs/images in `static/` so `prerender = true` still completes locally/CI.
			handleHttpError: ({ status, path, message }) => {
				if (status === 404 && /\.(pdf|jpe?g|png|webp|gif)$/i.test(path)) {
					return;
				}
				throw new Error(message);
			},
		},
	},
};

export default config;
