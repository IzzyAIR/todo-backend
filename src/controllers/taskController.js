const Task = require("../models/Task");
const { validationResult } = require("express-validator");

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: errors.array(),
      });
    }

    const { username, email, text } = req.body;

    const task = await Task.create({
      username,
      email,
      text,
    });

    res.status(201).json({
      message: "Задача создана успешно",
      task,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: error.errors.map((err) => ({
          msg: err.message,
          param: err.path,
        })),
      });
    }
    res.status(500).json({
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 3;
    const offset = (page - 1) * limit;

    let order = [];
    if (req.query.sort_field) {
      const sortField = req.query.sort_field;
      const sortDirection =
        req.query.sort_direction === "desc" ? "DESC" : "ASC";

      if (["username", "email", "completed"].includes(sortField)) {
        order.push([sortField, sortDirection]);
      }
    }

    const { count, rows: tasks } = await Task.findAndCountAll({
      offset,
      limit,
      order,
    });

    const totalPages = Math.ceil(count / limit);

    res.json({
      tasks,
      currentPage: page,
      totalPages,
      totalTasks: count,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const { text, completed } = req.body;

    const task = await Task.findByPk(id);
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    const updateData = {};
    if (text !== undefined && text !== task.text) {
      updateData.text = text;
      updateData.edited_by_admin = true;
    }
    if (completed !== undefined) {
      updateData.completed = completed;
    }

    await task.update(updateData);

    res.json({
      message: "Задача обновлена успешно",
      task,
    });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Ошибка валидации",
        errors: error.errors.map((err) => ({
          msg: err.message,
          param: err.path,
        })),
      });
    }
    res.status(500).json({
      message: "Ошибка сервера",
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
};
