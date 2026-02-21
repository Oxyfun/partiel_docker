const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "notesuser",
  password: process.env.MYSQL_PASSWORD,
  database: process.env.DB_NAME || "notes_db",
});

app.get("/api/notes", (req, res) => {
  pool.query("SELECT * FROM notes ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/api/notes", (req, res) => {
  const { eleve, matiere, note } = req.body;
  if (!eleve || !matiere || note === undefined) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  pool.query(
    "INSERT INTO notes (eleve, matiere, note) VALUES (?, ?, ?)",
    [eleve, matiere, note],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId, eleve, matiere, note });
    },
  );
});

app.listen(3000, () => console.log("Backend écoute sur le port 3000"));
