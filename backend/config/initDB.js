const db = require("./database");

// Tabelle für Benutzer erstellen
db.run(
  `
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'employee')) NOT NULL DEFAULT 'employee',
        is_registered BOOLEAN DEFAULT 0
    )`,
  (err) => {
    if (err) {
      console.error("Fehler beim Erstellen der Users-Tabelle:", err.message);
      process.exit(1); // Beende das Skript, wenn ein Fehler auftritt
    } else {
      console.log("Users-Tabelle erfolgreich erstellt.");
    }
  }
);

//Tabelle für Feedback erstellen
db.run(
  `
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NULL,
            message TEXT NOT NULL,
            is_anonymous BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
         )`,
  (err) => {
    if (err) {
      console.error("Fehler beim erstellen feedback-Tabelle:", err.message);
      process.exit(1);
    } else {
      console.log("Feedback Tabelle erfolgreich erstellt.");
    }
  }
);
