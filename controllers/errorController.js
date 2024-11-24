const errorController = {};

/* ***************************
 *  Create 500 Error
 * ************************** */

errorController.triggerError = async function (req, res, next) {
    try {
        throw new Error("Oh no! There was a problem. Maybe try a different route?");  
    } catch (error) {
        next(error);
    }
};

module.exports = errorController;