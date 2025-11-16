const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || '123';

    if (username !== adminUsername || password !== adminPassword) {
      return res.status(401).json({
        message: 'Неверные учетные данные'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET не настроен');
    }

    const token = jwt.sign(
      { username: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Успешная авторизация',
      token
    });
  } catch (error) {
    res.status(500).json({
      message: 'Ошибка сервера',
      error: error.message
    });
  }
};

module.exports = {
  login
};