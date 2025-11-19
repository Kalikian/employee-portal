const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserName,
  deleteUser,
  createFeedback,
  deleteFeedback,
} = require("../models/userModel");

async function testRegisterUser() {
  try {
    const email = "max@email.de"; // Deine Test-E-Mail
    const password = "password";

    const result = await registerUser(email, password);

    console.log("TEST: Registrierung abgeschlossen:", result);
  } catch (error) {
    console.error("TEST: Fehler bei der Registrierung:", error.message);
  }
}

async function testLoginUser() {
  try {
    const email = "hagop@email.de";
    const password = "password";

    const result = await loginUser(email, password);
    console.log("TEST: Login erfolgreich:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Login:", error.message);
  }
}

async function testGetUserProfile() {
  try {
    const email = "hagop@email.de";
    const password = "password";

    // Login, um userId zu erhalten
    const loginResult = await loginUser(email, password);
    const userId = loginResult.userId;

    const result = await getUserProfile(userId);
    console.log("TEST: Benutzerprofil erfolgreich abgerufen:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Abrufen des Profils:", error.message);
  }
}

async function testUpdateUserName() {
  try {
    const email = "hagop@email.de";
    const password = "password";

    // Login, um userId zu erhalten
    const loginResult = await loginUser(email, password);
    const userId = loginResult.userId;

    const result = await updateUserName(userId, "Hagop", "Kalikian");
    console.log("TEST: Benutzername erfolgreich aktualisiert:", result);
  } catch (error) {
    console.error(
      "TEST: Fehler beim Aktualisieren des Benutzernamens:",
      error.message
    );
  }
}

async function testDeleteUser() {
  try {
    const email = "hagop@email.de";
    const password = "password";

    // Login, um userId zu erhalten
    const loginResult = await loginUser(email, password);
    const userId = loginResult.userId;

    const result = await deleteUser(userId, password);
    console.log("TEST: Benutzer erfolgreich gelöscht:", result);
  } catch (error) {
    console.error("TEST: Fehler beim Löschen des Benutzers:", error.message);
  }
}

// Feedback erstellen (Mitarbeiter-Funktion)
async function testCreateFeedback(userId, message, isAnonymous) {
  try {
    const feedback = await createFeedback(userId, message, isAnonymous);
    console.log("TEST: Feedback erstellt:", feedback);
    return feedback.id;
  } catch (error) {
    console.error("TEST: Fehler in createFeedback:", error.message);
  }
}

// Eigenes Feedback löschen (Mitarbeiter-Funktion)
async function testDeleteFeedback(userId, feedbackId) {
  try {
    const result = await deleteFeedback(userId, feedbackId);
    if (result.deleted) {
      console.log(`TEST: Feedback mit ID ${feedbackId} erfolgreich gelöscht.`);
    } else {
      console.log(
        `TEST: Feedback mit ID ${feedbackId} konnte nicht gelöscht werden.`
      );
    }
  } catch (error) {
    console.error("TEST: Fehler in deleteFeedback:", error.message);
  }
}

testRegisterUser();
// testLoginUser();
// testGetUserProfile();
// testUpdateUserName();
// testDeleteUser();
// testCreateFeedback(9, "schönes Arbeitsklima!", false);
// testDeleteFeedback(9, 4);
