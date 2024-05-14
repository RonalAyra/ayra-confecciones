export default () => ({
  port: parseInt(process.env.PORT) || 3000,
  baseUrl: process.env.BASE_URL,
  database: {
    url: process.env.DATABASE_URL,
  },
  assetsPath: process.env.ASSETS_PATH,
  pageUrl: process.env.PAGE_URL,
});
