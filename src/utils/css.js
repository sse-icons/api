/**
 * Encode SVG for use in url()
 *
 * Short alternative to encodeURIComponent() that encodes only stuff used in SVG, generating
 * smaller code.
 */
exports.encodeSVGforURL = function (svg) {
  return svg
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/{/g, "%7B") // not needed in string inside double quotes
    .replace(/}/g, "%7D") // not needed in string inside double quotes
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .replace(/\s+/g, " "); // Replace all whitespace with space to get rid of '\r', '\n' and '\t'
};

/**
 * Generate data: URL from SVG
 */
exports.svgToData = function (svg) {
  return "data:image/svg+xml," + exports.encodeSVGforURL(svg);
};

/**
 * Generate url() from SVG
 */
exports.svgToURL = function (svg) {
  return 'url("' + exports.svgToData(svg) + '")';
};
