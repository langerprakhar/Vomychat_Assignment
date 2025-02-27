const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10, // Max connections at a time
      min: 2,  // Maintaining at least 2 connections
      acquire: 30000, // Waiting for 30s before throwing error
      idle: 10000, // Closing the connections if idle for 10s
    },
    retry: {
      max: 3, // Retrying up to 3 times if the DB connection fails
    },
  }
);

// Test database connection with retry logic
const testDBConnection = async () => {
  let attempts = 0;
  while (attempts < 3) {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully.");
      return;
    } catch (error) {
      attempts++;
      console.error(`Database connection failed (Attempt ${attempts}):`, error.message);
      if (attempts >= 3) {
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, 5000)); // Waiting 5s before retrying
    }
  }
};

testDBConnection();

module.exports = sequelize;
