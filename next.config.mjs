/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configures Next.js to compile as a static HTML output for GitHub Pages
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
