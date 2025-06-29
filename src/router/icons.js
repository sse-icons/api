const { getIcons, createIcon, getIconByCategory, getIconSvg, getIconsCssMin, deleteIcon } = require("../controllers/icons/icons.js");
const { getIconsCss } = require("../controllers/icons/css.js");
const express = require("express");
const router = express.Router();

// - GET - Icons
router.get("/", getIcons);
router.get("/:category.json", getIconByCategory);
router.get("/:iconId.svg", getIconSvg);
router.get("/:category.css", getIconsCss);

// POST - Icons
router.post("/", createIcon);

// DELETE - Icons
router.delete("/:iconId", deleteIcon);

module.exports = router;
