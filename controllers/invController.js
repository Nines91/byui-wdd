const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
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

module.exports = invCont