const pool = require('./postgres');

exports.createCar = async (req, res) => {
    const { userid, name, brand, type, voltage, charger, port } = req.body;

    try {
        const userCheck = await pool.query(
            'SELECT * FROM cars WHERE userid = $1 AND name = $2',
            [userid, name]
        );

        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'this car has already been added' });
        }

        const result = await pool.query(
            'INSERT INTO cars(userid, name, brand, type, voltage, charger, port) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [userid, name, brand, type, voltage, charger, port]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error during creation:', error);
        res.status(500).send('Internal Server Error');
    }
};





exports.getCars = async (req, res) => {
    const { userid } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM cars WHERE userid = $1',
            [userid]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, cars: result.rows });
            console.log('Retrieved cars without errors!');
        } else {
            res.status(200).json({ exists: false });
            console.log('No cars found for the user' +userid);
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
};



exports.deleteCar = async (req, res) => {
    const { userid, name } = req.query;
  
    try {
      const userCheck = await pool.query(
        'SELECT * FROM cars WHERE userid = $1 AND name = $2',
        [userid, name]
      );
  
      if (userCheck.rows.length > 0) {
        await pool.query(
          'DELETE FROM cars WHERE userid = $1 AND name = $2',
          [userid, name]
        );
  
        res.status(200).json({ message: 'Car deleted successfully' });
      } else {
        res.status(404).json({ message: 'Car not found' });
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      res.status(500).send('Internal Server Error');
    }
  };




