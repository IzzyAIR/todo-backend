const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
} = require("../controllers/taskController");
const { auth } = require("../middleware/auth");

const router = express.Router();

const taskValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Имя пользователя обязательно")
    .isLength({ min: 1, max: 50 })
    .withMessage("Имя пользователя должно быть от 1 до 50 символов"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Некорректный email")
    .normalizeEmail(),
  body("text")
    .trim()
    .notEmpty()
    .withMessage("Текст задачи обязателен")
    .isLength({ min: 1, max: 500 })
    .withMessage("Текст задачи должен быть от 1 до 500 символов"),
];

const updateTaskValidationRules = [
  body("text")
    .optional()
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Текст задачи должен быть от 1 до 500 символов"),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Статус завершения должен быть boolean"),
];

router.post("/", taskValidationRules, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.put("/:id", auth, updateTaskValidationRules, updateTask);

module.exports = router;
