const ENV = process.env.NODE_ENV || "development";
const { Pool } = require("pg");

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE not set");
}

const config =
  ENV === 'production'
    ? {
        connectionString: process.env.DATABASE_URL,
       ssl: process.env.DB_ENABLE_SSL,
      dialectOptions: {
      ssl: process.env.DB_ENABLE_SSL && {
      require: true
    }
  }
      }
    : {};
module.exports = new Pool(config);
