const adminModel = require("../models/adminModel");
const db = require("../config/database");
const bcrypt = require("bcryptjs");
const util = require("util");

const dbRun = util.promisify(db.run).bind(db);

// Hilfsfunktion: Admin-Benutzer für Login-Test erstellen
async function createTestAdmin() {
  const email = "hagop@email.com";
  const password = "password";

  const hashedPassword = await bcrypt.hash(password, 10);
  await dbRun(
    "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
    ["Hagop", "Kalikian", email, hashedPassword, "admin"]
  );

  return { email, password };
}

async function createTestUser() {
  const email = "user@test.com";
  const password = "test1234";

  const hashedPassword = await bcrypt.hash(password, 10);
  await dbRun(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    ["Max", "Mustermann", email, hashedPassword]
  );

  return { email, password };
}

async function testLoginAdmin() {
  try {
    const email = "admin@test.com";
    const password = "test1234";

    // Vorab einen Admin erstellen (falls noch nicht vorhanden)
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
      "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
      ["Test", "Admin", email, hashedPassword, "admin"]
    );

    const result = await adminModel.loginAdmin(email, password);
    console.log("TEST: Admin-Login erfolgreich:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Admin-Login:", error.message);
  }
}

async function testAddUserByAdmin() {
  try {
    const firstName = "Max";
    const lastName = "Mustermann";
    const email = "max@test.com";

    const result = await adminModel.addUserByAdmin(firstName, lastName, email);
    console.log("TEST: Benutzer wurde hinzugefügt:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Hinzufügen des Benutzers:", error.message);
  }
}

async function testDeleteUserByAdmin(userId) {
  try {
    // Prüfen, ob der Benutzer existiert
    const user = await db.get("SELECT id FROM users WHERE id = ?", [userId]);
    if (!user) {
      throw new Error("Benutzer nicht gefunden!");
    }

    // Benutzer löschen
    const result = await adminModel.deleteUserByAdmin(userId);
    console.log("TEST: Benutzer wurde gelöscht:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Löschen des Benutzers:", error.message);
  }
}

async function testGetAllUsers() {
  try {
    const result = await adminModel.getAllUsers();
    console.log("TEST: Alle Benutzer abrufen:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Abrufen aller Benutzer:", error.message);
  }
}

async function testGetUserById(userId) {
  try {
    const result = await adminModel.getUserById(userId);
    console.log("TEST: Benutzer abrufen erfolgreich:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Abrufen des Benutzers:", error.message);
  }
}
// Alle Feedbacks abrufen (Admin-Funktion)
async function testGetAllFeedback() {
  try {
    const feedbacks = await adminModel.getAllFeedback();
    console.log("TEST: Alle Feedbacks abgerufen:", feedbacks);
  } catch (error) {
    console.error("TEST: Fehler in getAllFeedback:", error.message);
  }
}

// Feedback eines bestimmten Users abrufen (Admin-Funktion)
async function testGetFeedbackByUser(userId) {
  try {
    const feedbacks = await adminModel.getFeedbackByUser(userId);
    console.log(`TEST: Feedback für User ${userId} abgerufen:`, feedbacks);
  } catch (error) {
    console.error("TEST: Fehler in getFeedbackByUser:", error.message);
  }
}

// Feedbacks nach Zeitraum filtern (Admin-Funktion)
async function testGetFeedbackByDateRange(startDate, endDate) {
  try {
    const feedbacks = await adminModel.getFeedbackByDateRange(
      startDate,
      endDate
    );
    console.log(
      `TEST: Feedback von ${startDate} bis ${endDate} abgerufen:`,
      feedbacks
    );
  } catch (error) {
    console.error("TEST: Fehler in getFeedbackByDateRange:", error.message);
  }
}

//Tests ausführen
createTestAdmin();
createTestUser();
testLoginAdmin();
testAddUserByAdmin();
testDeleteUserByAdmin();
testGetAllUsers();
testGetUserById();
testGetAllFeedback();
testGetFeedbackByUser(12);
testGetFeedbackByDateRange("2025-03-10", "2025-03-10");
