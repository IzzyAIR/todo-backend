const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.DATABASE_PATH || path.join(__dirname, "../../database.sqlite"),
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  define: {
    timestamps: true,
    underscored: false,
  },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({ force: false });

    process.on("SIGINT", async () => {
      await sequelize.close();
      console.log("Подключение к SQLite закрыто");
      process.exit(0);
    });
  } catch (error) {
    console.error("Ошибка подключения к базе данных:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
