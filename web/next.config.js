// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

module.exports = {
  reactStrictMode: true,
  compiler: {
    // ssr and displayName are configured by default
    styledComponents: true,
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  images: {
    domains: ["cdn.sanity.io"],
  },
};
