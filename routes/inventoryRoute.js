//Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle page by vehicle Id
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;