const sqlite3 = require("sqlite3").verbose(); //.verbose() Aktiviert ausführliche Debugging-Informationen (hilft bei Fehleranalysen).
const path = require("path"); //Node.js-Modul für Pfad-Operationen, um den Datenbankpfad dynamisch zu bestimmen.

// Überprüfe, ob die Umgebungsvariable für die Datenbank existiert (Docker) oder verwende den lokalen Pfad
const dbPath =
  process.env.DB_PATH || path.resolve(__dirname, "../../database/database.db");

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Fehler beim Verbinden mit SQLite:", err.message);
  } else {
    console.log(`Verbunden mit SQLite-Datenbank: ${dbPath}`);
  }
});

// Falls der Prozess unerwartet beendet wird, schließen wir die Verbindung sauber
process.on("SIGINT", () => {
  db.close(() => {
    console.log("SQLite-Verbindung geschlossen.");
    process.exit(0);
  });
});

module.exports = db;
