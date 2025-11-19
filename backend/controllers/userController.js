const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config(); // Lädt JWT_SECRET aus .env

const SECRET_KEY = process.env.JWT_SECRET; // Sicheren Schlüssel aus .env

const userController = {
  //Mitarbeiter registriert sich mit eigenem Passwort
  registerUser: async (req, res) => {
    try {
      const { email, initialPassword, newPassword } = req.body;

      if (!email || !initialPassword || !newPassword) {
        return res.status(400).json({
          error:
            "E-Mail, Initial-Passwort und neues Passwort sind erforderlich.",
        });
      }

      const result = await userModel.registerUser(
        email,
        initialPassword,
        newPassword
      );
      res.status(201).json({ result }); // 201 Created für erfolgreiche Registrierung
    } catch (error) {
      console.error("fehler in registerUser:", error.message);
      res.status(400).json({
        error: "Registrierung fehlgeschlagen",
        details: error.message,
      });
    }
  },

  //Benutzer-login (Authentifizierung mit JWT)
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-Mail und Passwort sind erforderlich" });
      }

      const user = await userModel.loginUser(email, password);

      //JWT-Token generieren
      const token = jwt.sign(
        { userId: user.userId, email: user.email }, //Payload
        SECRET_KEY, // Signatur mit Secret
        { expiresIn: "2h" } // Token läuft nach 2 Stunden ab
      );

      res.status(200).json({ message: "login erfolgreich", token });
    } catch (error) {
      console.error("Fehler in loginUser:", error.message);
      res
        .status(401) // 401 für fehlerhafte Authentifizierung
        .json({ error: "Anmeldung fehlgeschlagen", details: error.message });
    }
  },
  //Profil abrufen mit JWT-Authentifizierung
  getUserProfile: async (req, res) => {
    try {
      const userId = req.user.userId; // `userId` kommt aus dem Token
      const user = await userModel.getUserProfile(userId);
      res.status(200).json({ user });
    } catch (error) {
      console.error("Fehler in getUserProfile:", error.message);
      res
        .status(404)
        .json({ error: "Benutzer nicht gefunden", details: error.message });
    }
  },

  //Benutzerprofil ändern => Name ändern
  updateUserName: async (req, res) => {
    try {
      const { firstName, lastName } = req.body;
      const userId = req.user.userId; // `userId` kommt aus dem Token
      const result = await userModel.updateUserName(
        userId,
        firstName,
        lastName
      );
      res.status(200).json({ result });
    } catch (error) {
      console.error("Fehler in updateUserName:", error.message);
      res.status(400).json({
        error: "Fehler beim Aktualisieren des Profils",
        details: error.message,
      });
    }
  },

  //Benutzerprofil löschen
  deleteUser: async (req, res) => {
    try {
      const userId = req.user.userId; // `userId` kommt aus dem Token
      const result = await userModel.deleteUser(userId);
      res.status(200).json({ result });
    } catch (error) {
      console.error("Fehler in deleteUser:", error.message);
      res.status(400).json({
        error: "Fehler beim Löschen des Benutzers",
        details: error.message,
      });
    }
  },

  //feedback erstellen (Mitarbeiter-Funktion)
  createFeedback: async (req, res) => {
    try {
      const { message, isAnonymous } = req.body;
      const userId = req.user?.userId; //`userId` aus dem Token

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Authentifizierung erforderlich!" });
      }

      if (!message) {
        return res.status(400).json({ error: "Nachricht erforderlich!" });
      }

      const feedbackId = await userModel.createFeedback(
        userId,
        message,
        isAnonymous
      );
      res.status(201).json({ success: true, feedbackId });
    } catch (error) {
      console.error("Fehler in createFeedback:", error.message);
      res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },

  // Eigene Feedbacks abrufen (Mitarbeiter-Funktion)
  getOwnFeedback: async (req, res) => {
    try {
      const userId = req.user?.userId; // User-ID aus dem Token

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Authentifizierung erforderlich!" });
      }

      const feedbacks = await userModel.getOwnFeedback(userId);
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Fehler in getOwnFeedback:", error.message);
      res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },

  //Feedback löschen (nur eigenes Feedback erlaubt) (mitarbeiter-Funktion)
  deleteFeedback: async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
      const userId = req.user?.userId;

      if (!feedbackId) {
        return res.status(400).json({ error: "Feedback-ID erforderlich!" });
      }

      if (!userId) {
        return res
          .status(401)
          .json({ error: "Authentifizierung erforderlich!" });
      }

      const result = await userModel.deleteFeedback(userId, feedbackId);

      if (result.changes === 0) {
        return res
          .status(404)
          .json({ error: "Feedback nicht gefunden oder kein Löschrecht!" });
      }

      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Fehler in deleteFeedback:", error.message);
      res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },
};

module.exports = userController;
