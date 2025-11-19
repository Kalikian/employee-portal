const util = require("util");
const db = require("../config/database"); // SQLite-Datenbank importieren
const bcrypt = require("bcryptjs");

// `db.get` und `db.run` in eine Promise-Funktion umwandeln
const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);
const dbAll = util.promisify(db.all).bind(db);

const userModel = {
  //Mitarbeiter registriert sich mit eigenem Passwort
  registerUser: async (email, initialPassword, newPassword) => {
    try {
      //prüfen od der Benutzer existiert
      const user = await dbGet(
        "SELECT is_registered, password FROM users WHERE email = ?",
        [email]
      );
      if (!user) {
        throw new Error(
          "E-Mail nicht gefunden. Bitte vom Admin hinzufügen lassen."
        );
      }
      if (user.is_registered === 1) {
        throw new Error("Benutzer ist bereits registriert.");
      }
      const isMatch = await bcrypt.compare(initialPassword, user.password);
      if (!isMatch) {
        throw new Error("Falsches Passwort");
      }

      //Passwort hashen und Benutzer registrieren
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
      await dbRun(
        //Passwort in Datenbank gesaltet und gehasht sicher speichern
        "UPDATE users SET password = ?, is_registered = 1 WHERE email = ?",
        [newHashedPassword, email]
      );
      return {
        message: "Registrierung erfolgreich!  Sie können sich nun einloggen.",
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim registerUser: ${error.message}`);
    }
  },
  //Benutzer-login
  loginUser: async (email, password) => {
    try {
      //Benutzer anhand der E-Mail abrufen
      const user = await dbGet(
        "SELECT id, first_name, last_name, email, password, is_registered FROM users WHERE email = ?",
        [email]
      );

      if (!user) {
        throw new Error("Ungültige Anmeldeinformationen.");
      }
      if (!user.is_registered) {
        throw new Error(
          "Dieser Account wurde noch nicht registriert. Bitte registrieren Sie sich zuerst!"
        );
      }
      //Passwort vergleichen
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Falsches Passwort");
      }
      return {
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim loginUser: ${error.message}`);
    }
  },
  //Profil abrufen mit userId
  getUserProfile: async (userId) => {
    try {
      const user = await dbGet(
        "SELECT id, first_name, last_name, email FROM users WHERE id = ?",
        [userId]
      );

      if (!user) {
        throw new Error("Benutzer nicht gefunden");
      }
      return {
        userId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim getUserProfile: ${error.message}`);
    }
  },
  //Benutzerprofil ändern => Name ändern
  updateUserName: async (userId, firstName, lastName) => {
    try {
      await dbRun(
        "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
        [firstName, lastName, userId]
      );

      //aktualisierte daten abrufen
      const updatedName = await dbGet(
        "SELECT first_name, last_name FROM users WHERE id = ?",
        [userId]
      );
      return { message: "Profil aktualisiert!", updatedName };
    } catch (error) {
      throw new Error(`Datenbankfehler beim updateUserName: ${error.message}`);
    }
  },

  // Feedback eines Benutzers abrufen (nur eigene Feedbacks)
  getOwnFeedback: async (userId) => {
    try {
      const feedbacks = await dbAll(
        "SELECT id, message, is_anonymous, created_at FROM feedback WHERE user_id = ?",
        [userId]
      );
      return { count: feedbacks.length, feedbacks };
    } catch (error) {
      throw new Error(`Datenbankfehler beim getOwnFeedback: ${error.message}`);
    }
  },

  //Benutzerprofil löschen
  deleteUser: async (userId) => {
    try {
      //Passwort aus der Datenbank abrufen
      if (!userId) {
        throw new Error("Benutzer nicht gefunden");
      }

      const user = await dbGet("SELECT id FROM users WHERE id = ?", [userId]);
      if (!user) {
        throw new Error("Benutzer nicht gefunden.");
      }

      //Benutzer löschen
      await dbRun("DELETE FROM users WHERE id = ?", [userId]);

      // Überprüfen, ob der Benutzer wirklich gelöscht wurde
      const deleteCheck = await dbGet("SELECT id FROM users WHERE id = ?", [
        userId,
      ]);
      if (deleteCheck) {
        throw new Error("Fehler beim löschen des Benutzers.");
      }
      return { message: "Benutzer erfolgreich gelöscht!" };
    } catch (error) {
      throw new Error(`Datenbankfehler beim deleteUser: ${error.message}`);
    }
  },
  //Feddback speichern
  createFeedback: async (userId, message, isAnonymous) => {
    try {
      await dbRun(
        "INSERT INTO feedback (user_id, message, is_anonymous) VALUES (?,?,?)",
        [isAnonymous ? null : userId, message, isAnonymous ? 1 : 0] // Falls anonym, dann user_id = NULL
      );
      //Änderungen abrufen
      const feedbackId = await dbGet("SELECT last_insert_rowid() AS id");
      return {
        message: "Feedback generiert",
        id: feedbackId.id,
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim createFeedback: ${error.message}`);
    }
  },
  //Feedback löschen (Nur eigenes Feedback)
  deleteFeedback: async (userId, feedbackId) => {
    try {
      // Prüfen, ob das Feedback existiert und anonym ist
      const feedback = await dbGet(
        "SELECT is_anonymous FROM feedback WHERE id = ?",
        [feedbackId]
      );
      if (!feedback) {
        throw new Error("Feedback nicht gefunden.");
      }
      if (feedback.is_anonymous) {
        throw new Error("Anonymes Feedback kann nicht gelöscht werden.");
      }
      //Feedback löschen
      await dbRun(
        "DELETE FROM feedback WHERE user_id = ? AND id = ?",
        [userId, feedbackId] // Nutzer kann nur sein eigenes Feedback löschen
      );
      //Änderungen abrufen
      const deleteCheck = await dbGet("SELECT * FROM feedback WHERE id = ?", [
        feedbackId,
      ]);
      if (!deleteCheck) {
        return { message: "Feedback erfolgreich gelöscht!", deleted: true };
      }
    } catch (error) {
      throw new Error(`Datenbankfehler beim deleteFeedback: ${error.message}`);
    }
  },
};

module.exports = userModel;
