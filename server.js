require("dotenv").config();

// Проверка обязательных переменных окружения
const requiredEnvVars = ["JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    "Ошибка: Отсутствуют обязательные переменные окружения:",
    missingEnvVars.join(", ")
  );
  console.error("Создайте .env файл на основе .env.example");
  process.exit(1);
}

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/utils/database");

const taskRoutes = require("./src/routes/taskRoutes");
const adminRoutes = require("./src/routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/tasks", taskRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "ToDo API работает",
    timestamp: new Date().toISOString(),
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Маршрут не найден",
  });
});

app.use((error, req, res, next) => {
  console.error("Ошибка сервера:", error.stack);
  res.status(500).json({
    message: "Внутренняя ошибка сервера",
  });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
