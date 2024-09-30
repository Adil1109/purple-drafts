export default function robots() {
	return {
		rules: {
			userAgent: 'facebookexternalhit',
			allow: '/',
			disallow: '/private/',
		},
		sitemap: 'https://purpledrafts.com/sitemap.xml',
	};
}
