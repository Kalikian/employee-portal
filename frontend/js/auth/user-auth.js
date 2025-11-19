// Registrierung-Funktion
document
  .getElementById("registerForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const initialPassword = document.getElementById("initialPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const messageDiv = document.getElementById("message");
    const loginButton = document.getElementById("loginButton"); // Neuer Button

    try {
      const response = await fetch("http://localhost:3000/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, initialPassword, newPassword }),
      });

      const result = await response.json();

      if (response.status === 200 || response.status === 201) {
        messageDiv.textContent =
          "Registrierung erfolgreich! Du kannst dich jetzt einloggen.";
        messageDiv.style.color = "green";

        // **Eingabefelder leeren**
        document.getElementById("email").value = "";
        document.getElementById("initialPassword").value = "";
        document.getElementById("newPassword").value = "";

        // Login-Button anzeigen
        loginButton.style.display = "block";
      } else {
        messageDiv.textContent =
          result.details || "Registrierung fehlgeschlagen.";
        messageDiv.style.color = "red";
      }
    } catch (error) {
      messageDiv.textContent = "Serverfehler: " + error.message;
      messageDiv.style.color = "red";
    }
  });

/// Login-Funktion
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  try {
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("token", result.token);
      messageDiv.textContent = "Login erfolgreich!";
      messageDiv.style.color = "green";
      // Weiterleitung auf das Mitarbeiter-Dashboard
      window.location.href = "dashboard.html";
    } else {
      messageDiv.textContent = result.details || "Login fehlgeschlagen.";
      messageDiv.style.color = "red";
    }
  } catch (error) {
    messageDiv.textContent = "Serverfehler: " + error.message;
    messageDiv.style.color = "red";
  }
});
