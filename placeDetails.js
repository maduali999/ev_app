const pool = require('./postgres');



exports.createplace =  async (req, res) => {
    const { userid, name, address, type, hasChargers, chargers, pricingType, pricingValue, availability, image, last_seen } = req.body;
  
    try {
      // Insert the data into the 'place' table
      const result = await pool.query(
        `INSERT INTO places (userid, name, address, type, has_chargers, chargers, pricing_type, pricing_value, availability, image_path, last_seen) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [ userid, name, address, type, hasChargers, JSON.stringify(chargers), pricingType, pricingValue, availability, image, last_seen]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  exports.updatePlace = async (req, res) => {
    const { userid, name, address, type, hasChargers, chargers, pricingType, pricingValue, availability, image, last_seen } = req.body;
  
    try {
      // Update the data in the 'places' table where userid matches
      const result = await pool.query(
        `UPDATE places 
         SET name = $2, address = $3, type = $4, has_chargers = $5, chargers = $6, pricing_type = $7, pricing_value = $8, availability = $9, image_path = $10, last_seen = $11 
         WHERE userid = $1 
         RETURNING *`,
        [userid, name, address, type, hasChargers, JSON.stringify(chargers), pricingType, pricingValue, availability, image, last_seen]
      );
  
      if (result.rows.length === 0) {
        // No place was found with the provided userid
        return res.status(404).json({ error: 'Place not found for the given user.' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error updating data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  

  exports.getPlacesByUserId = async (req, res) => {
    const { userid } = req.query;
  
    try {
      // Query to retrieve all places for the given userid
      const result = await pool.query(
        `SELECT * FROM places WHERE userid = $1`,
        [userid]
      );
  
      if (result.rows.length > 0) {
        // If places are found, return them
        res.status(200).json(result.rows);
      } else {
        // If no places are found, return an empty array
        res.status(200).json([]);
      }
    } catch (error) {
      console.error('Error retrieving places:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  