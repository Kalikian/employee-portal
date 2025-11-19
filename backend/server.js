require("./config/initDB");
require("dotenv").config(); // Lädt die .env-Variablen

const express = require("express");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const db = require("./config/database");
const cors = require("cors");
const path = require("path");

const app = express();

//Middleware
app.use(express.json()); //für JSON-Parsing
app.use(cors()); // Erlaubt API-Zugriff vom Frontend (UI) auf einem anderen Origin (z. B. localhost:5173 → localhost:3000)
app.use(express.urlencoded({ extended: true })); // Optional für URL-encoded Formulardaten
// Statische Dateien aus frontend laden
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
  res.send("Mitarbeiterportal API läuft!");
});

app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

//Server starten
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

//datenbank sauber schließen, wenn der Server stoppt
process.on("SIGINT", () => {
  console.log("Schließe die Datenbank...");
  db.close(() => {
    console.log("Datenbankverbindung geschlossen.");
    process.exit(0);
  });
});
