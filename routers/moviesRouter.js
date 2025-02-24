const express = require("express");
const router = express.Router();

const moviesController = require("../controllers/moviesController");

// INDEX
router.get("/", moviesController.index);

// SHOW
router.get("/:id", moviesController.show);

// DELETE
router.delete("/:id", moviesController.destroy);

module.exports = router;
