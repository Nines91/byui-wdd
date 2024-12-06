const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    // If no data associated, throw error
    if (!data || data.length === 0) {
      const error = new Error("Vehicle classification not found");
      error.status = 404;
      throw error;
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ***************************
 *  Build vehicle page by inventory id
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId;
    const data = await invModel.getDetailByVehicleId(inv_id);

    //Error data trhow error
    if (!data) {
      const error = new Error("Vehicle not found");
      error.status = 404;
      throw error;
    }

    const vehicleCard = await utilities.buildVehicleCardPage(data);
    const nav = await utilities.getNav();
    const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;
    res.render("./inventory/vehicles", {
      title: vehicleName,
      nav,
      vehicleCard
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build Inventory Management view
 * ************************** */
invCont.buildByInvManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('./inventory/management', {
      title: 'Inventory Management',
      nav,
      errors: null,
  })
}

/* ***************************
*  Build Add Classification view
* ************************** */
invCont.buildByAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render('./inventory/add-classification', {
      title: 'Add Classification Management',
      nav,
      errors: null,
  })
}

/* ***************************
*  Process Add Classification
* ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav()

  if (regResult) {
      req.flash('success', `Success, ${classification_name} has been added to the database.`)
      res.status(201).render('./inventory/management', {
          title: 'Inventory Management',
          nav,
          errors: null,
      })
  } else {
      req.flash('notice', 'Sorry, adding classification failed.')
      res.status(501).render('./inventory/add-classification', {
          title: 'Add Classification Management',
          nav,
          errors: null,
      })
  }
}

/* ***************************
*  Build Add Inventory view
* ************************** */
invCont.buildByAddInventory = async function (req, res, next) {
  const dropdown = await utilities.buildClassificationDropdown()
  let nav = await utilities.getNav()
  res.render('./inventory/add-inventory', {
      title: 'Add Inventory Management',
      nav,
      dropdown,
      errors: null,
  })
}

/* ***************************
*  Process Add Inventory
* ************************** */
invCont.addInventory = async function (req, res, next) {
  const {
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id,
  } = req.body
  // console.log(req.body)

  const regResult = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      inv_miles,
      inv_color,
      inv_description,
      inv_image,
      inv_thumbnail,
      classification_id
  )
  
  let nav = await utilities.getNav()
  let dropdown = await utilities.buildClassificationDropdown()

  if (regResult) {
      req.flash('success', `Success, ${inv_year} ${inv_make} ${inv_model} has been added to the database.`)
      res.status(201).render('./inventory/management', {
          title: 'Inventory Management',
          nav,
          errors: null,
      })
  } else {
      req.flash('notice', 'Sorry, adding inventory failed.')
      res.status(501).render('./inventory/add-inventory', {
          title: 'Add Inventory Management',
          nav,
          dropdown,
          errors: null,
      })
  }
}



module.exports = invCont