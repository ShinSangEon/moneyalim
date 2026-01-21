export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: 'https://moneyalim.com/sitemap.xml',
    };
}
