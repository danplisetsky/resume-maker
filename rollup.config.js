import json from "rollup-plugin-json";

export default {
  input: "src/main.js",
  output: {
    file: "bundle.js",
    format: "iife"
  },

  plugins: [json()]
};
