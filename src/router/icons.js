const { getIcons, createIcon, getIconByCategory, getIconSvg, getIconsCss, getIconsCssMin, deleteIcon } = require("../controllers/icons.js");
const express = require("express");
const router = express.Router();

// - GET - Icons
router.get("/", getIcons);
router.get("/:category.json", getIconByCategory);
router.get("/:iconId.svg", getIconSvg);
router.get("/:category.css", getIconsCss);
router.get("/:category.min.css", getIconsCssMin);

// POST - Icons
router.post("/", createIcon);

// DELETE - Icons
router.delete("/:iconId", deleteIcon);

module.exports = router;
