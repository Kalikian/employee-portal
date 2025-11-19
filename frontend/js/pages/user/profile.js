document.addEventListener("DOMContentLoaded", async () => {
  checkUserToken();
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(
        "Nicht autorisiert oder Fehlerhafte Antwort, leite zum Login..."
      );
      window.location.href = "login.html";
      return;
    }

    const data = await response.json();

    if (data && data.user) {
      document.getElementById("firstName").innerText = data.user.firstName;
      document.getElementById("lastName").innerText = data.user.lastName;
      document.getElementById("email").innerText = data.user.email;
    } else {
      console.warn("Keine Benutzerdaten erhalten.");
    }
  } catch (error) {
    console.error("Fehler beim Laden des Profils:", error);
    window.location.href = "login.html"; // Falls ein schwerwiegender Fehler auftritt
  }

  // Zurück-Button
  const backButton = document.getElementById("backToDashboard");
  if (backButton) {
    backButton.addEventListener("click", () => {
      window.location.href = "dashboard.html";
    });
  } else {
    console.error("BackToDashboard-Button nicht gefunden!");
  }
});

// Profil löschen Button
document.getElementById("deleteProfile").addEventListener("click", async () => {
  checkUserToken();
  const confirmDelete = confirm(
    "⚠ Bist du sicher, dass du dein Profil löschen möchtest? Dies kann nicht rückgängig gemacht werden!"
  );

  if (!confirmDelete) return; // Falls der Nutzer "Abbrechen" klickt, passiert nichts

  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/user/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Dein Profil wurde erfolgreich gelöscht.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "login.html"; // Weiterleitung zum Login
    } else {
      alert("Fehler beim Löschen des Profils.");
    }
  } catch (error) {
    console.error("Fehler:", error);
    alert("Serverfehler. Bitte versuche es später erneut.");
  }
});
