const pool = require('./postgres');

exports.createUser = async (req, res) => {
    const { full_name, phone, email , type} = req.body;

    try {
        const userCheck = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const result = await pool.query(
            'INSERT INTO users(full_name, email, phone, type) VALUES($1, $2, $3, $4) RETURNING *',
            [full_name, email, phone, type]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.checkUserDetails = async (req, res) => {
    const { email } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND (phone IS NULL OR full_name IS NULL OR type IS NULL)',
            [email]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, user: result.rows[0] });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Error checking user details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getUser = async (req, res) => {
    const { email } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ exists: true, user: result.rows[0] });

        } else {
            res.status(200).json({ exists: false });
            console.log('cant retrieve users');
        }
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getType = async (req, res) => {
    const { email } = req.query;

    try {
        const result = await pool.query(
            'SELECT type FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, type: result.rows[0].type });

        } else {
            res.status(404).json({ success: false, message: 'User not found' });
            console.log('No user found with the provided email');
        }
    } catch (error) {
        console.error('Error fetching user type:', error);
        res.status(500).send('Internal Server Error');
    }
};


exports.updateUser = async (req, res) => {
    const { email, full_name, phone, type } = req.query;

    try {
        const result = await pool.query(
            'UPDATE users SET full_name = $2, phone = $3, type = $4 WHERE email = $1 RETURNING *',
            [email, full_name, phone, type]
        );

        if (result.rows.length > 0) {
            res.status(200).json({ success: true, user: result.rows[0] });
            console.log("Update was successful!");
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
            console.log("Email: " + email);
        }
    } catch (error) {
        console.error('Error updating user details:', error);
        res.status(500).send('Internal Server Error');
    }
};


