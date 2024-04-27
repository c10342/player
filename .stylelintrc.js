module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-scss",
    "stylelint-config-recess-order"
  ],
  plugins: ["stylelint-scss"],
  rules: {
    "no-descending-specificity": null,
    "no-empty-source": null,
    "scss/at-import-partial-extension": null,
    "font-family-no-missing-generic-family-keyword": null,
    "no-duplicate-selectors": null,
    "selector-class-pattern": null,
    "import-notation": "string"
  }
};
