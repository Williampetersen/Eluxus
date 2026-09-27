import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  {
    ignores: [
      "legacy/**",
      ".next/**",
      ".astro/**",
      ".vercel/**",
      "dist/**",
      "node_modules/**",
      "Eluxus/**",
    ],
  },
  ...nextVitals,
];

export default config;
