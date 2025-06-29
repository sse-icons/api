const Icons = require("../../models/icons.js");
const { svgToURL } = require("../../utils/css.js");
const {
  allowedCategories,
  isValidCategory,
} = require("../../utils/categories.js");

exports.getIconsCss = async (req, res, next) => {
  const { category } = req.params;
  const { icons } = req.query;
  const iconsNames = icons ? icons.split(",") : [];
  res.set("Content-Type", "text/css");

  try {
    if (
      category &&
      !allowedCategories.includes(category) &&
      category !== "all"
    ) {
      const error = new Error(
        "Invalid category. Allowed categories are: " +
          allowedCategories.join(", ")
      );
      error.status = 400;
      return next(error);
    }

    let query = {};
    if (category && category !== "all") {
      query.categories = isValidCategory(category);
    }

    const iconsData = await Icons.find(query);

    if (iconsNames.length > 0) {
      const filteredIcons = iconsData.filter((icon) =>
        iconsNames.includes(icon.id)
      );

      const notFoundIcons = iconsNames.filter(
        (iconName) => !filteredIcons.some((icon) => icon.id === iconName)
      );

      const errorMessage = notFoundIcons.length > 0 ? notFoundIcons.map((name) => '/* Icons not found: ' + name + '*/\n').join('') : ""

      return res.send(
        filteredIcons
          .map(
            (icon) =>
              `.icon-${icon.id} { 
  --svg: ${svgToURL(icon.body)}; 
}`
          )
          .join("\n\n") + (errorMessage ? "\n\n" + errorMessage : "")
      );
    }

    if (!iconsData || iconsData.length === 0) {
      return res
        .status(404)
        .send(
          "/* No icons found for this category */\n/* Please check the category and try again. */"
        );
    }

    const cssContent = iconsData
      .map(
        (icon) =>
          `.icon-${icon.id} {
  --svg: ${svgToURL(icon.body)}; 
}`
      )
      .join("\n\n");

    res.send(cssContent);
  } catch (error) {
    const err = new Error("Error fetching icons:", error);
    err.status = 500;
    return next(err);
  }
};
