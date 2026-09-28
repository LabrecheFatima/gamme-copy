const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const envUsername = process.env.ADMIN_USERNAME || 'Apoteca_Admin_2026';
    const envPassword = process.env.ADMIN_PASSWORD;

    if (username !== envUsername || password !== envPassword) {
      return res.status(400).json({ error: 'Identifiants incorrects' });
    }

    const token = jwt.sign(
      { username: envUsername }, 
      process.env.JWT_SECRET || 'secret_key', 
      { expiresIn: '1d' }
    );

    res.json({ token, username: envUsername });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};