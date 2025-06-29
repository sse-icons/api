const Icons = require("../../models/icons.js");
const { svgToURL } = require("../../utils/css.js");
const { allowedCategories } = require("../../utils/categories.js");

exports.getIcons = async (req, res) => {
  try {
    const icons = await Icons.find();
    res.json(icons);
  } catch (error) {
    console.error("Error fetching icons:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getIconByCategory = async (req, res, next) => {
  const { category } = req.params;
  const { icons } = req.query;
  const iconNames = icons ? icons.split(",") : [];
  res.set("Content-Type", "application/json");

  try {
    if (!allowedCategories.includes(category) && category !== "all") {
      const error = new Error(
        "Invalid category. Allowed categories are: " +
          allowedCategories.join(", ")
      );
      error.status = 400;
      return next(error);
    }

    let query = {};

    if (category && category !== "all") {
      if (category === "oauth") {
        query.categories = "OAuth";
      } else if (category === "oidc") {
        query.categories = "OIDC";
      } else if (category === "email") {
        query.categories = "Email";
      } else if (category === "adapter") {
        query.categories = "Adapter";
      } else if (category === "others") {
        query.categories = "Others";
      }
    }

    const iconsData = await Icons.find(query);

    if (iconNames.length > 0) {
      const filteredIcons = iconsData.filter((icon) =>
        iconNames.includes(icon.id)
      )

      const notFoundIcons = iconNames.filter(
        (iconName) => !filteredIcons.some((icon) => icon.id === iconName)
      );

      if (notFoundIcons.length > 0) {
        return res
          .status(404)
          .json({ error: `Icons not found: ${notFoundIcons.join(", ")}` });
      }

      return res.json(filteredIcons);
    }

    if (!iconsData || iconsData.length === 0) {
      return res
        .status(404)
        .json({ error: "No icons found for this category" });
    }
    res.json(iconsData);
  } catch (error) {
    console.error("Error fetching icon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getIconSvg = async (req, res, next) => {
  const { iconId } = req.params;
  try {
    const icon = await Icons.findOne({ id: iconId });
    if (!icon) {
      const error = new Error("Icon not found");
      error.status = 404;
      return next(error);
    }
    res.set("Content-Type", "image/svg+xml");
    res.send(icon.body);
  } catch (error) {
    console.error("Error fetching icon SVG:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createIcon = async (req, res) => {
  const body = req.body;
  try {
    const newIcon = new Icons(body);
    await newIcon.save();
    res.status(201).json(newIcon);
  } catch (error) {
    console.error("Error creating icon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getIconsCssMin = async (req, res, next) => {
  const { category } = req.query;
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
      if (category === "oauth") {
        query.categories = "OAuth";
      } else if (category === "oidc") {
        query.categories = "OIDC";
      } else if (category === "email") {
        query.categories = "Email";
      } else if (category === "adapter") {
        query.categories = "Adapter";
      } else if (category === "others") {
        query.categories = "Others";
      }
    }

    const icons = await Icons.find(query);

    if (!icons || icons.length === 0) {
      return res.status(404).send("No icons found for the specified category.");
    }

    let cssContent = icons
      .map((icon) => {
        return `.icon-${icon.id}{background-image: ${svgToURL(icon.body)};}`;
      })
      .join("");

    res.send(cssContent.replace(/\s+/g, " ").trim());
  } catch (error) {
    console.error("Error generating CSS:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteIcon = async (req, res, next) => {
  const { iconId } = req.params;
  try {
    const result = await Icons.deleteOne({ id: iconId });
    if (result.deletedCount === 0) {
      const error = new Error("Icon not found");
      error.status = 404;
      return next(error);
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting icon:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
