document.addEventListener("DOMContentLoaded", () => {
  checkAdminToken();

  // Button für Mitarbeiterverwaltung → Öffnet `manage-users.html`
  document.getElementById("manageUsers").addEventListener("click", () => {
    window.location.href = "manage-users.html";
  });

  // Button für Feedback-Verwaltung → Öffnet `manage-feedback.html`
  document.getElementById("viewFeedbacks").addEventListener("click", () => {
    window.location.href = "manage-feedbacks.html";
  });

  // Logout-Funktion
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("adminToken"); // Token entfernen
    alert("Erfolgreich ausgeloggt!");
    window.location.href = "login.html"; // Weiterleitung zum Login
  });
});
