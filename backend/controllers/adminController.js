const adminModel = require("../models/adminModel");
const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET; // Sicheren Schlüssel aus .env

const adminController = {
  async loginAdmin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "E-Mail und Passwort sind erforderlich" });
      }
      const admin = await adminModel.loginAdmin(email, password);

      // Token generieren
      const token = jwt.sign(
        { id: admin.id, role: admin.role, email: admin.email },
        SECRET_KEY,
        { expiresIn: "2h" }
      );

      res.status(200).json({ message: "login erfolgreich", token });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Interner Serverfehler", details: error.message });
    }
  },

  // Admin fügt neuen Benutzer hinzu (Admin muss authentifiziert sein)
  async addUserByAdmin(req, res) {
    try {
      const { firstName, lastName, email } = req.body;
      if (!firstName || !lastName || !email) {
        return res
          .status(400)
          .json({ error: "Vorname, Nachname und E-Mail sind erforderlich" });
      }

      const result = await adminModel.addUserByAdmin(
        firstName,
        lastName,
        email
      );
      res.status(201).json({ result });
    } catch (error) {
      res.status(500).json({
        error: `${error.message}`,
        details: error.message,
      });
    }
  },

  async deleteUserByAdmin(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "Benutzer-ID ist erforderlich" });
      }
      const result = await adminModel.deleteUserByAdmin(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({
        error: "Fehler beim Löschen des Benutzers",
        details: error.message,
      });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await adminModel.getAllUsers();
      if (!users || users.length === 0) {
        return res.status(200).json({ users: [] }); // Immer ein gültiges JSON-Objekt zurückgeben
      }
      res.status(200).json({ users });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Interner Serverfehler", details: error.message });
    }
  },

  async getUserById(req, res) {
    try {
      const { userId } = req.params;
      if (!userId) {
        return res.status(400).json({ error: "Benutzer-ID ist erforderlich" });
      }

      const result = await adminModel.getUserById(userId);
      if (!result) {
        return res.status(404).json({ error: "Benutzer nicht gefunden" });
      }
      res.status(200).json({ result });
    } catch (error) {
      res
        .status(404)
        .json({ error: "Benutzer nicht gefunden", details: error.message });
    }
  },
  //Alle feedbacks abrufen (Admin-Funktion)
  getAllFeedback: async (req, res) => {
    try {
      const feedbacks = await adminModel.getAllFeedback();

      if (!feedbacks || feedbacks.length === 0) {
        return res.status(200).json({ feedbacks: [] }); // Immer ein gültiges JSON zurückgeben
      }
      return res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Fehler in getAllFeedback", error.message);
      return res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },

  //feedback löschen
  deleteFeedbackByAdmin: async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;

      if (!feedbackId) {
        return res.status(400).json({ error: "Feedback-ID erforderlich!" });
      }

      // Feedback über das Admin-Model löschen
      const result = await adminModel.deleteFeedbackByAdmin(feedbackId);

      return res.status(200).json({ success: true, result });
    } catch (error) {
      console.error("Fehler in deleteFeedbackByAdmin:", error.message);
      res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },

  getFeedbackByUser: async (req, res) => {
    try {
      const userId = req.params.userId; //benutzer-ID aus der URL

      if (!userId) {
        return res.status(400).json({ error: "Benutzer-ID erforderlich!" });
      }

      const feedbacks = await adminModel.getFeedbackByUser(userId);
      return res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Fehler in getFeedbackByUser:", error.message);
      return res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },

  //Feedbacks nach Zeitraum filtern (Admin-Funktion)(aktuell **für alle Benutzer zugänglich**)
  getFeedbackByDateRange: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "Start- und Enddatum erforderlich!" });
      }

      const feedbacks = await adminModel.getFeedbackByDateRange(
        startDate,
        endDate
      );
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error("Fehler in getFeedbackByDateRange:", error.message);
      res
        .status(500)
        .json({ error: "Datenbankfehler", details: error.message });
    }
  },
};

module.exports = adminController;
