const db = require("../config/database");
const bcrypt = require("bcryptjs");
const util = require("util");
require("dotenv").config(); //lädt INITIAL_PASSWORT aus .env

const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);
const dbAll = util.promisify(db.all).bind(db);

const adminModel = {
  //Admin-login
  loginAdmin: async (email, password) => {
    try {
      //Admin anhand der E-Mail abrufen
      const admin = await dbGet(
        "SELECT id, first_name, last_name, email, password, role FROM users WHERE email = ? AND role = 'admin'",
        [email]
      );

      if (!admin) {
        throw new Error("Admin nicht gefunden oder falsche Zugangsdaten");
      }
      //Passwort vergleichen
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new Error("Falsches Passwort");
      }
      return {
        id: admin.id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        role: admin.role,
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim login ${error.message}`);
    }
  },

  //Admin legt neuen Mitarbeiter an
  addUserByAdmin: async (firstName, lastName, email) => {
    try {
      //Prüfen, ob die E-Mail bereits existiert
      const existingEmail = await dbGet(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (existingEmail) {
        throw new Error(`Ein Benutzer mit dieser E-Mail existiert bereits.`);
      }

      //initiales Passwort setzen und hashen
      const initialPassword = await bcrypt.hash(
        process.env.INITIAL_PASSWORD,
        10
      );

      // Mitarbeiter in die Datenbank einfügen
      await dbRun(
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)",
        [firstName, lastName, email, initialPassword]
      );
      return {
        message:
          "Benutzer erfolgreich hinzugefügt. Mitarbeiter muss sich registrieren und Passwort ändern.",
      };
    } catch (error) {
      throw new Error(`Datenbankfehler beim addUserByAdmin: ${error.message}`);
    }
  },

  //Admin löscht der Mitarbeiter
  deleteUserByAdmin: async (userId) => {
    try {
      // Prüfen, ob der Benutzer existiert
      const user = await dbGet("SELECT id,role FROM users WHERE id = ?", [
        userId,
      ]);
      if (!user) {
        throw new Error("Benutzer nicht gefunden.");
      }

      // Benutzer löschen
      await dbRun("DELETE FROM users WHERE id = ?", [userId]);

      // Prüfen, ob der Benutzer wirklich gelöscht wurde
      const deleteCheck = await dbGet("SELECT * FROM users WHERE id = ?", [
        userId,
      ]);
      if (deleteCheck) {
        throw new Error("Fehler beim Löschen des Benutzers.");
      }
      return { message: "Benutzer erfolgreich gelöscht." };
    } catch (error) {
      throw new Error(
        `Datenbankfehler beim deleteUserByAdmin: ${error.message}`
      );
    }
  },

  //Alle Mitarbeitern abrufen
  getAllUsers: async () => {
    try {
      const users = await dbAll(
        "SELECT id, first_name, last_name, email, role, is_registered FROM users"
      );
      return { users };
    } catch (error) {
      throw new Error(`Datenbankfehler beim getAllUsers: ${error.message}`);
    }
  },

  //Einzelnen Mitarbeiter abrufen
  getUserById: async (userId) => {
    try {
      const user = await dbGet(
        "SELECT id, first_name, last_name, email, role, is_registered FROM users WHERE id = ?",
        [userId]
      );
      if (!user) {
        throw new Error("Benutzer nicht gefunden.");
      }
      return { user };
    } catch (error) {
      throw new Error(`Datenbankfehler beim getUserById: ${error.message}`);
    }
  },
  //Alle Feedbacks abrufen (Admin-Funktion)
  getAllFeedback: async () => {
    try {
      const rows = await dbAll(
        `SELECT f.id, 
            CASE 
              WHEN f.is_anonymous = 1 THEN 'Anonym' 
              WHEN u.id IS NULL THEN 'Gelöschter Benutzer' 
            ELSE u.first_name || ' ' || u.last_name 
            END AS user_name, 
          f.message, 
          f.created_at 
        FROM feedback f
        LEFT JOIN users u ON f.user_id = u.id
        ORDER BY f.created_at DESC;`
      );
      return { count: rows.length, feedbacks: rows };
    } catch (error) {
      throw new Error("Datenbankfehler beim getAllFeedback: " + error.message);
    }
  },

  //Feedback löschen
  deleteFeedbackByAdmin: async (feedbackId) => {
    try {
      // Prüfen, ob das Feedback existiert
      const feedback = await dbGet("SELECT * FROM feedback WHERE id = ?", [
        feedbackId,
      ]);
      if (!feedback) {
        throw new Error("Feedback nicht gefunden.");
      }

      // Feedback löschen
      await dbRun("DELETE FROM feedback WHERE id = ?", [feedbackId]);

      // Prüfen, ob das Feedback wirklich gelöscht wurde
      const deleteCheck = await dbGet("SELECT * FROM feedback WHERE id = ?", [
        feedbackId,
      ]);
      if (deleteCheck) {
        throw new Error("Fehler beim Löschen des Feedbacks.");
      }

      return { message: "Feedback erfolgreich gelöscht." };
    } catch (error) {
      console.error("Fehler beim Löschen durch Admin:", error.message);
      throw new Error(`Datenbankfehler: ${error.message}`);
    }
  },

  //Feedback eines bestimmten Users abrufen (Admin-Funktion)
  getFeedbackByUser: async (userId) => {
    try {
      const rows = await dbAll(
        //Zur besseren Anonymität werden nur die Feedbacks abgerufen, bei denen is_anonymous = 0 ist
        `SELECT id,
                  message,
                  created_at 
          FROM feedback WHERE user_id= ? AND is_anonymous = 0 
          ORDER BY created_at DESC`,
        [userId]
      );
      return { count: rows.length, feedbacks: rows };
    } catch (error) {
      throw new Error(
        `Datenbankfehler beim getFeedbackByUser: ${error.message} `
      );
    }
  },
  //Feedbacks nach Zeitraum filtern (Admin-Funktion)
  getFeedbackByDateRange: async (startDate, endDate) => {
    try {
      const rows = await dbAll(
        //Zur besseren Anonymität werden nur die Feedbacks abgerufen, bei denen is_anonymous = 0 ist
        `SELECT id, 
                  CASE WHEN is_anonymous = 1 THEN NULL ELSE user_id END AS user_id, 
                  message, 
                  created_at 
          FROM feedback 
          WHERE created_at BETWEEN ? AND ? 
          ORDER BY created_at DESC`,
        [startDate, endDate]
      );
      return { count: rows.length, feedbacks: rows };
    } catch (error) {
      throw new Error(
        `Datenbankfehler beim getFeedbackByDateRange: ${error.message}`
      );
    }
  },
};

module.exports = adminModel;
