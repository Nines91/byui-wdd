const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

// Route to build the intentional error view
router.get("/trigger-error", errorController.triggerError);

module.exports = router;