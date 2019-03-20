const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {

  // Add a date formatter filter to Nunjucks
  eleventyConfig.addFilter("dateDisplay", require("./filters/dateDisplay.js"));
  eleventyConfig.addFilter("timestamp", require("./filters/timestamp.js"));
  eleventyConfig.addFilter("squash", require("./filters/squash.js"));
  eleventyConfig.addFilter("pageTitle", require("./filters/pageTitle.js"));
  eleventyConfig.addFilter("postImage", require("./filters/postImage.js"));
  eleventyConfig.addFilter("removeIndexHtml", require("./filters/removeIndexHtml.js"));
  eleventyConfig.addFilter("imageDimensions", require("./filters/imageDimensions.js"));
  eleventyConfig.addFilter("cacheVersion", require("./filters/cacheVersion.js"));
  eleventyConfig.addFilter("embedVideo", require("./filters/embedVideo.js"));
  eleventyConfig.addFilter("renderGalleryItems", require("./filters/renderGalleryItems.js"));
  eleventyConfig.addFilter("getPageByPath", require("./filters/getPageByPath.js"));
  // eleventyConfig.addFilter("valueIfEmpty", require("./filters/valueIfEmpty.js"));
  eleventyConfig.addFilter("httpUrl", require("./filters/httpUrl.js"));
  eleventyConfig.addFilter("callFunction", require("./filters/callFunction.js"));
  eleventyConfig.addFilter("getImageVariation", require("./filters/getImageVariation.js"));
  eleventyConfig.addFilter("jsMin", require("./filters/jsMin.js"));
  eleventyConfig.addFilter("localeSort", require("./filters/localeSort.js"));

  eleventyConfig.addPassthroughCopy("assets/");
  eleventyConfig.addPassthroughCopy("_headers");
  eleventyConfig.addPassthroughCopy(".htaccess");
  eleventyConfig.addPassthroughCopy("favicon.png");

  eleventyConfig.addCollection("work", function (collection) {
    return collection.getFilteredByTag("work").sort(function (a, b) {
      return new Date(b.data.premier.date) - new Date(a.data.premier.date);
    });
  });

  eleventyConfig.addCollection("critic", function (collection) {
    return collection.getFilteredByTag("critic");
  });

  // eleventyConfig.addCollection("work", function (collection) {
  //   return collection.getFilteredByGlob(["works/*.md"]);
  // });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "input",
      data: "data",
      output: "dist",
      includes: "includes"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    dataTemplateEngine: false,
    passthroughFileCopy: true
  };
};