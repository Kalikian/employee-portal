document.addEventListener("DOMContentLoaded", () => {
  // Admin-Login
  document
    .getElementById("adminLoginForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault(); // Verhindert das Neuladen der Seite

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const messageDiv = document.getElementById("message");

      try {
        const response = await fetch("http://localhost:4000/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem("adminToken", result.token);
          messageDiv.textContent = "Login erfolgreich!";
          messageDiv.style.color = "green";

          // Admin wird weitergeleitet zum Admin-Dashboard
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
});
