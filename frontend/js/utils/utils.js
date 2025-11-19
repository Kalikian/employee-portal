// Zur Startseite navigieren (falls Button existiert)
const homeButton = document.getElementById("homeButton");
if (homeButton) {
  homeButton.addEventListener("click", (e) => {
    e.preventDefault(); // Verhindert Standardverhalten
    window.location.href = window.location.origin + "/index.html";
  });
}

// Zum Admin-Dashboard navigieren (falls Button existiert)
const dashboardButton = document.getElementById("dashboardButton");
if (dashboardButton) {
  dashboardButton.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href =
      window.location.origin + "/pages/admin/dashboard.html";
  });
}

// **Sicherstellen, dass nur eine Checkbox aktiv ist**
function setupSingleCheckboxSelection(classname) {
  const checkboxes = document.querySelectorAll(`.${classname}`);

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      checkboxes.forEach((cb) => {
        if (cb !== this) cb.checked = false;
      });
    });
  });
}

// Prüft User-Token und leitet zum User-Login weiter, falls ungültig
function checkUserToken() {
  const userToken = localStorage.getItem("token");

  if (!userToken) {
    console.warn("Kein User-Token gefunden! Weiterleitung zum Login...");
    window.location.href = window.location.origin + "/pages/user/login.html";
    return;
  }

  const payload = parseJwt(userToken);
  if (!payload || payload.exp * 1000 < Date.now()) {
    console.warn("User-Token abgelaufen! Weiterleitung zum Login...");
    localStorage.removeItem("token");
    window.location.href = window.location.origin + "/pages/user/login.html";
  }
}

// Prüft Admin-Token und leitet zum Admin-Login weiter, falls ungültig
function checkAdminToken() {
  const adminToken = localStorage.getItem("adminToken");

  if (!adminToken) {
    console.warn("Kein Admin-Token gefunden! Weiterleitung zum Admin-Login...");
    window.location.href = window.location.origin + "/pages/admin/login.html";
    return;
  }
  const payload = parseJwt(adminToken);
  if (!payload || payload.exp * 1000 < Date.now()) {
    console.warn("Admin-Token abgelaufen! Weiterleitung zum Admin-Login...");
    localStorage.removeItem("adminToken");
    window.location.href = window.location.origin + "/pages/admin/login.html";
  }
}

// JWT-Token entschlüsseln (Hilfsfunktion)
function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Payload aus JWT extrahieren
  } catch (error) {
    console.log(error);
    return null; // Falls Fehler auftritt (ungültiges Token)
  }
}

// Funktionen global verfügbar machen
window.checkUserToken = checkUserToken;
window.checkAdminToken = checkAdminToken;
window.setupSingleCheckboxSelection = setupSingleCheckboxSelection;
