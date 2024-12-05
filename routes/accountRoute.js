//Needed resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');


router.get("/login", utilities.handleErrors(accountController.buildLogin))

/* ***********************
* Registration View
* Unit 4, deliver registration view
*********************** */
   
router.get("/register", utilities.handleErrors(accountController.buildRegistration))
   
 //Account management process
 router.get("/", utilities.handleErrors(accountController.buildAccountManagement))
 
 //router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

/* ***********************
* Process Registration
* ********************** */
// Process the registration data
router.post(
    "/register",
     regValidate.registationRules(),
     regValidate.checkRegData,
     utilities.handleErrors(accountController.registerAccount)
)

 // Process the login attempt
 // Modify the login attempt activity unit 5
 router.post(
    "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
    /*(req, res) => {
     res.status(200).send('login process')
     }*/
 )

module.exports = router;