const i18n = require("i18n");
const path = require("path");

// Config i18n
i18n.configure({
  locales: ["en", "es"],
  directory: path.join(__dirname, "..", "locales"),
  defaultLocale: "en",
  register: global
});

module.exports = i18n;
