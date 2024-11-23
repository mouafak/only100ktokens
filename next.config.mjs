/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production'
    }
    // webpack: config => {
    //     config.externals.push('pino-pretty', 'lokijs', 'encoding')
    //     return config
    // }
}
export default nextConfig;
