import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html", 
    "./src/**/*.{js,ts,jsx,tsx}" // Make sure this matches your project structure
  ],
  theme: {
    extend: {
      colors: {
        primary: "#222831", // Primary color
        info: "#192BC2",
      },
    },
  },
  plugins: [],
};

export default config;
