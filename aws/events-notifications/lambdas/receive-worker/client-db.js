import { Client } from "pg";
import dotenv from 'dotenv'
dotenv.config()

export const client_db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})