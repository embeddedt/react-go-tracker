const path = require("path");
const webpack = require("webpack");
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
})
const withPWA = require('next-pwa')
const runtimeCaching = require('next-pwa/cache')
runtimeCaching[0].handler = 'StaleWhileRevalidate'

module.exports = withPWA(withBundleAnalyzer({
    webpack: (config) => {
        config.resolve.alias["~"] = path.resolve(__dirname);
        config.resolve.alias["leaflet$"] = path.resolve(__dirname, "node_modules/leaflet/dist/leaflet.js");
        config.resolve.fallback = {
            request: require.resolve("browser-request"),
            events: require.resolve("events"),
            buffer: require.resolve("buffer"),
            stream: false,
            crypto: false,
            http: false,
            https: false,
            net: false,
            path: false,
            stream: false,
            tls: false,
            fs: false,
        };
        return config;
    },
    webpack5: true,
    async redirects() {
        return [
            {
                source: "/",
                destination: "/map",
                permanent: false,
            },
        ];
    },
    pwa: {
        dest: 'public',
        register: false,
        skipWaiting: false,
        runtimeCaching
    }
}));
