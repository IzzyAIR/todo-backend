const express = require("express");
const { body } = require("express-validator");
const { login } = require("../controllers/adminController");

const router = express.Router();

const loginValidationRules = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Имя пользователя обязательно"),
  body("password").notEmpty().withMessage("Пароль обязателен"),
];

router.post("/login", loginValidationRules, login);

module.exports = router;
