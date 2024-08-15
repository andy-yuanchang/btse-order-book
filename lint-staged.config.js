const config = {
  "**/*.{ts,tsx,js,jsx,cjs}": "eslint --fix",
  "**/*": ["prettier --ignore-unknown --write"],
  "*.{ts,tsx}": () => "tsc --pretty --noEmit",
};

export default config;
