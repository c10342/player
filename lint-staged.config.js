module.exports = {
  "*.{css,scss}": ["stylelint **/*.{css,scss} --fix"],
  "*.{js,jsx,cjs,mjs,ts,tsx,cts,mts,vue}": ["prettier --write", "eslint --fix", "eslint"]
};
