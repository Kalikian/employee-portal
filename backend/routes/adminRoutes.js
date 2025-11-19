const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authenticateToken = require("../middleware/authenticateToken");
const isAdmin = require("../middleware/isAdmin");

// Admin Login (ohne JWT-Token)
router.post("/login", adminController.loginAdmin);
// User-Verwaltung (geschützt mit JWT + Admin-Rolle)
router.post(
  "/users",
  authenticateToken,
  isAdmin,
  adminController.addUserByAdmin
);
router.delete(
  "/users/:userId",
  authenticateToken,
  isAdmin,
  adminController.deleteUserByAdmin
);
router.get("/users", authenticateToken, isAdmin, adminController.getAllUsers);
router.get(
  "/users/:userId",
  authenticateToken,
  isAdmin,
  adminController.getUserById
);
// Feedback-Verwaltung für Admin
router.get(
  "/feedback",
  authenticateToken,
  isAdmin,
  adminController.getAllFeedback
); // Neu hinzugefügt!
router.delete(
  "/feedbacks/:feedbackId",
  authenticateToken, // Admin muss eingeloggt sein
  isAdmin, // Nur Admins dürfen Feedbacks löschen
  adminController.deleteFeedbackByAdmin
);
router.get(
  "/feedback/user/:userId",
  authenticateToken,
  isAdmin,
  adminController.getFeedbackByUser
);
router.get(
  "/feedback/date",
  authenticateToken,
  isAdmin,
  adminController.getFeedbackByDateRange
);

module.exports = router;
