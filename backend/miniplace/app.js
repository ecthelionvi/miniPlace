const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");
const { socketServer } = require("./socket");

const app = express();
const port = 8000;
app.use(
  cors({
    origin: "http://localhost:3000",
  }),
  bodyParser.json(),
);

const upload = multer({ storage: multer.memoryStorage() });

const db = new sqlite3.Database("database/database.db");

db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS grid_designs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  screenshot BLOB,
  grid_data TEXT,
  undo_stack TEXT,
  redo_stack TEXT,
  FOREIGN KEY (user_id) REFERENCES users (id)
)`);

app.post("/register", (req, res) => {
  const { email, password } = req.body;

  db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ message: "User registered successfully" });
    }
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ? AND password = ?`, [email, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (!row) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      res.status(200).json({ message: "Login successful", userId: row.id });
    }
  });
});

app.post("/save-grid-design", upload.single("screenshot"), (req, res) => {
  const userId = req.body.userId;
  const gridData = JSON.stringify(req.body.gridData);
  const screenshotBlob = req.file.buffer;

  db.get(
    `SELECT * FROM grid_designs WHERE user_id = ? AND grid_data = ?`,
    [userId, gridData],
    (err, row) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
      } else if (row) {
        res.status(400).json({ error: "Duplicate grid design" });
      } else {
        db.run(
          `INSERT INTO grid_designs (user_id, screenshot, grid_data) VALUES (?, ?, ?)`,
          [userId, screenshotBlob, gridData],
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).json({ error: "Internal server error" });
            } else {
              res.status(200).json({ message: "Grid design saved successfully" });
            }
          },
        );
      }
    },
  );
});

app.get("/all-grid-designs", (req, res) => {
  db.all(`SELECT * FROM grid_designs`, (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const gridDesigns = rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        screenshot: row.screenshot.toString("base64"),
      }));
      res.status(200).json({ gridDesigns });
    }
  });
});

app.get("/grid-designs/:userId", (req, res) => {
  const userId = req.params.userId;

  db.all(`SELECT * FROM grid_designs WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      const gridDesigns = rows.map((row) => ({
        id: row.id,
        screenshot: row.screenshot.toString("base64"),
        gridData: JSON.parse(row.grid_data),
      }));
      res.status(200).json({ gridDesigns });
    }
  });
});

app.get("/grid-designs/:userId/:id", (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  db.get(`SELECT * FROM grid_designs WHERE user_id = ? AND id = ?`, [userId, id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else if (!row) {
      res.status(404).json({ error: "Grid design not found" });
    } else {
      const gridDesign = {
        id: row.id,
        gridData: JSON.parse(row.grid_data),
      };
      res.status(200).json({ gridDesign });
    }
  });
});

app.delete("/grid-designs/:userId/:id", (req, res) => {
  const userId = req.params.userId;
  const id = req.params.id;

  db.run(`DELETE FROM grid_designs WHERE user_id = ? AND id = ?`, [userId, id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(200).json({ message: "Grid design deleted successfully" });
    }
  });
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

socketServer.listen(8001, () => {
  console.log("Socket.IO server running on port 8001");
});

process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(err);
    }
    process.exit(0);
  });
});
