const express = require('express');
const router = express.Router();

const controller = require("../controllers/controller");

// get categories
router.post("/categories", controller.getCategories);

// get tags by category
router.post("/tags/:category", controller.getTagsByCategory);

// get list of images by tag
router.post("/:tag/:category", controller.getImagesByTag);

// get random tags
router.post("/random-tags", controller.getRandomTags);

// search by tag name
router.post("/search", controller.searchTags);

// get related tag
router.post("/related", controller.getRelatedTags);

module.exports = router;
