/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://nervous-energy.netlify.app',
  generateRobotsTxt: true, // Generate a robots.txt
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'], // Exclude specific pages if needed
  robotsTxtOptions: {
    additionalSitemaps: [
      // Add any additional sitemaps if needed
      // 'https://nervous-energy.netlify.app/server-sitemap.xml',
    ],
  },
  // Change the outDir if you have a custom output directory for your build
  // outDir: 'public',
};
