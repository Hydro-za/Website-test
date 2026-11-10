// Hosted-preview variant: same content, flat page files (about.html ...), separate output folder.
const c = JSON.parse(JSON.stringify(require("./site.config.js")));
c.site.flat = true;
c.site.outputDir = "dist-artifact";
module.exports = c;
