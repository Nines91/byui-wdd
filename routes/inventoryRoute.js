//Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invManagementController = require("../controllers/invManagementController");
const utilities = require('../utilities/')
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle page by vehicle Id
router.get("/detail/:invId", invController.buildByInvId);

// Route to build Inventory Management view
router.get('/', utilities.handleErrors(invController.buildByInvManagement))

// Route to build Add clasification view
router.get("/add-classification", utilities.handleErrors(invController.buildByAddClassification));

// Route to process adding a classification
router.post("/add-classification", invManagementController.addClassResult);

// Route to handle Add Classification
router.post(
    '/add-classification',
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

// Route to build Add Inventory View
router.get('/add-inventory', utilities.handleErrors(invController.buildByAddInventory))

// Route to handle Add Inventory
router.post(
    '/add-inventory',
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;