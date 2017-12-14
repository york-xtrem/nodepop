const i18n = require("i18n");
const path = require("path");

// registrar lenguajes
i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  register: global
});

module.exports = i18n;
