const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle page view HTML
 for vehicle cards
* ************************************ */

Util.buildVehicleCardPage = async function (data) {
  let vehicleCard = "";

  if (data) {
    //Vehicle section
    vehicleCard += '<section id="vehicle-card-details">';

    //Container vehicle
    vehicleCard += '<div class="vehicle-card-container">';

    //Vehicle Image
    vehicleCard += '<div class="vehicle-card-image">';
    vehicleCard += `<img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">`;
    vehicleCard += '</div>';

    //Vehicle Details
    vehicleCard += '<div class="vehicle-details-container">';
    vehicleCard += `<h2>${data.inv_make} ${data.inv_model}</h2>`;
    vehicleCard += '<p>';
    vehicleCard += `<strong>Year:</strong> ${data.inv_year}<br>`;
    vehicleCard += `<strong>Color:</strong> ${data.inv_color}<br>`;
    vehicleCard += `<strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(data.inv_miles)} miles<br>`;
    vehicleCard += '</p>';
    vehicleCard += `<p>${data.inv_description}</p>`;
    vehicleCard += `<p id="price">Price: ${new Intl.NumberFormat('en-US').format(data.inv_price)}</p>`;
    vehicleCard += '</div>';
    vehicleCard += '</div>';
    vehicleCard += '</section>';

    }else {
      vehicleCard = '<p class="notice">Sorry, the vehicle you are looking for could not be found.</p>';
  }
  return vehicleCard;
}

Util.buildClassificationDropdown = async function (req, res, next) {
  let data = await invModel.getClassifications()
 
  let option = `<select id="classification_id" name="classification_id" value="<%= locals.classification_id %>" required >
  <option value="" disabled selected>Select a classification</option>`

  data.rows.forEach((row) => {
      option += `<option value="${row.classification_id}">${row.classification_name}</option>`
  })

  option += `</select>`

  return option
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
 }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


module.exports = Util