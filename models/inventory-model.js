const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get  deatails on a specific vehicle by inventory id
 * ************************** */
async function getDetailByVehicleId(inv_id) { 
 try {
  const data = await pool.query(
    `SELECT * FROM public.inventory 
     WHERE inv_id = $1`,
     [inv_id]
  );
  return data.rows[0];
 } catch (error) {
  console.error("Get detail by vehicle id error " + error);
 }
}

/* ***************************
 *  Adding a new Classification to the database
 * ************************** */

async function addClassification(classification_name) {
  try {
    const sql = 'INSERT INTO classification (classification_name) VALUES $1 RETURNING*'
      return await pool.query(sql, [classification_name]);
  } catch (error) {
    console.error('Database Error:', error.message) // Log the error
    return error.message
  }
}

/* ***************************
 *  Checkin existing Classification 
 * ************************** */
async function checkExistingClassification(classification_nameparams) {
  try {
    const sql = 'SELECT * FROM classification WHERE classification_name = $1'
    const classification = await pool.query(sql, [classification_name]);
    return classification.rowCount
  } catch (error) {
    console.error('Database Error:', error.message) // Log the error
    return error.message
  }
}

/* ***************************
 *  Adding a new Inventory to the database
 * ************************** */
async function addInventory(
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
) {
  try {
      const sql = 'INSERT INTO inventory (inv_make, inv_model, inv_year, inv_price, inv_miles, inv_color, inv_description, inv_image, inv_thumbnail, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *'
      return await pool.query(sql, [
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
      ])
  } catch (error) {
      console.error('Database Error:', error.message) // Log the error
      return error.message
  }
}


module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getDetailByVehicleId,
  addClassification,
  checkExistingClassification,
  addInventory
};
