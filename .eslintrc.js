module.exports = {
  extends: "nestjs",
  plugins: ["@typescript-eslint", "simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-console": "off",
    "prettier/prettier": [
      "error",
      {
        "tabWidth": 2,
        "useTabs": false,
        "singleQuote": true,
        "semi": true,
        "bracketSpacing": true,
        "arrowParens": "avoid",
        "trailingComma": "es5",
        "bracketSameLine": true,
        "printWidth": 100,
        "endOfLine": "auto"
      }
    ]
  }
};
