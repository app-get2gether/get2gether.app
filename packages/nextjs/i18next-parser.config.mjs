const config = {
  //verbose: true,
  locales: ["en", "ru"],
  defaultNamespace: "default",
  createOldCatalogs: false,
  sort: true,
  output: "src/locales/$LOCALE/$NAMESPACE.yml",
  keepRemoved: [
    /footer_tabs.*/
  ]
}

export default config
