const { DataTypes } = require("sequelize");
const { sequelize } = require("../utils/database");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Имя пользователя обязательно",
      },
      len: {
        args: [1, 50],
        msg: "Имя пользователя должно быть от 1 до 50 символов",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Email обязателен",
      },
      isEmail: {
        msg: "Некорректный email",
      },
    },
  },
  text: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Текст задачи обязателен",
      },
      len: {
        args: [1, 500],
        msg: "Текст задачи должен быть от 1 до 500 символов",
      },
    },
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  edited_by_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Task;
