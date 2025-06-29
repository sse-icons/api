const Icons = require("../../models/icons.js");
const { svgToURL } = require("../../utils/css.js");
const {
  allowedCategories,
  isValidCategory,
} = require("../../utils/categories.js");

exports.getIconsCss = async (req, res, next) => {
  const { category } = req.params;
  const { icons, type } = req.query;
  const iconsNames = icons ? icons.split(",") : [];

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

      const errorMessage =
        notFoundIcons.length > 0
          ? notFoundIcons
              .map((name) => "/* Icons not found: " + name + "*/\n")
              .join("")
          : "";

      const contentM =
        filteredIcons
          .map(
            (icon) =>
              `.icon-${icon.id} { 
  --svg: ${svgToURL(icon.body)}; 
}`
          )
          .join("\n\n") + (errorMessage ? "\n\n" + errorMessage : "");

      res.set("Content-Type", "text/css");
      if (type === "min") {
        return res.send(contentM.replace(/\s+/g, " ").trim());
      }
      return res.send(contentM);
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

    res.set("Content-Type", "text/css");
    if (type === "min") {
      return res.send(cssContent.replace(/\s+/g, " ").trim());
    }
    return res.send(cssContent);
  } catch (error) {
    const err = new Error("Error fetching icons: " + error.message);
    err.status = 500;
    return next(err);
  }
};
