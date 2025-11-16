const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        message: "Нет токена, доступ запрещен",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Ошибка конфигурации сервера",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.username !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Токен недействителен",
    });
  }
};

module.exports = { auth };
