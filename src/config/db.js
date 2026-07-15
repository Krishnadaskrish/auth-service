import sqlite3 from "sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.resolve(__dirname, "../../data");

// Create data directory if it doesn't exist
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, "auth.db");
const db = new sqlite3.Database(dbPath);

// Helper function to execute run query as Promise
export const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Helper function to execute get query as Promise (single row)
export const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

// Helper function to execute all query as Promise (multiple rows)
export const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize DB schema and seed initial Admin
export const initDb = async () => {
  try {
    // Create credentials table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS credentials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("[AUTH-DB] Credentials table verified/created.");

    // Seed default admin login credentials if not present
    const defaultEmail = "admin@rbac.com";
    const existing = await dbGet("SELECT id FROM credentials WHERE email = ?", [defaultEmail]);

    if (!existing) {
      const defaultPassword = "admin123";
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(defaultPassword, salt);

      await dbRun(
        "INSERT INTO credentials (email, password_hash) VALUES (?, ?)",
        [defaultEmail, hash]
      );
      console.log(`[AUTH-DB] Default admin credentials seeded: ${defaultEmail} / ${defaultPassword}`);
    } else {
      console.log(`[AUTH-DB] Credentials already initialized.`);
    }
  } catch (error) {
    console.error("[AUTH-DB] Initialization failed:", error.message);
  }
};

export default db;
