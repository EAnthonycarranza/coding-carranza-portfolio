import Database from "better-sqlite3";
import path from "path";
import bcryptjs from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "portfolio.db");

let db: Database.Database;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initDb(db);
  }
  return db;
}

function initDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      client_name TEXT,
      project_url TEXT,
      image_url TEXT,
      technologies TEXT,
      featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed admin user if none exists
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
  if (userCount.count === 0) {
    const hashedPassword = bcryptjs.hashSync("admin123", 10);
    db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
      "admin",
      hashedPassword
    );
  }
}

export default getDb;
