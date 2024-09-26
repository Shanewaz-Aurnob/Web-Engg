import { PoolOptions } from "mysql2";

const ReadonlyCreds: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.RO_DB_USERNAME,
  password: process.env.RO_DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true },
};

const WriteonlyCreds: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.WO_DB_USERNAME,
  password: process.env.WO_DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true },
};

const AdminCreds: PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.ADMIN_DB_USERNAME,
  password: process.env.ADMIN_DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true },
};

export { ReadonlyCreds, WriteonlyCreds, AdminCreds };
