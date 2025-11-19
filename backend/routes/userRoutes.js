const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");

// Öffentliche Routen (keine Authentifizierung nötig)
router.post("/register", userController.registerUser); // Benutzer registrieren
router.post("/login", userController.loginUser); // Benutzer anmelden

// Geschützte Routen (JWT-Token erforderlich)
router.get("/profile", authenticateToken, userController.getUserProfile); // Benutzerprofil abrufen
router.put("/update", authenticateToken, userController.updateUserName); // Benutzerprofil aktualisieren
router.delete("/delete", authenticateToken, userController.deleteUser); // Benutzer löschen

// Feedback-Funktionen (für Mitarbeiter)
router.post("/feedback", authenticateToken, userController.createFeedback); // Feedback erstellen
router.get("/feedback", authenticateToken, userController.getOwnFeedback); // Eigene Feedbacks abrufen
router.delete(
  "/feedback/:feedbackId",
  authenticateToken,
  userController.deleteFeedback
); // eigenes Feedback löschen

module.exports = router;
