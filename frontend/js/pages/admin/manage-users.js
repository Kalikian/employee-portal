document.addEventListener("DOMContentLoaded", () => {
  checkAdminToken();
  const token = localStorage.getItem("adminToken");

  // Neuen Mitarbeiter hinzufügen
  document
    .getElementById("addUserForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;

      try {
        const response = await fetch("http://localhost:4000/api/admin/users", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName, lastName, email }),
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Unbekannter Fehler aufgetreten");
        }
        if (response.ok) {
          alert("Mitarbeiter erfolgreich hinzugefügt!");
          document.getElementById("addUserForm").reset(); //Formular leeren
        }
      } catch (error) {
        console.error("Fehler:", error.message);
        alert(`Fehler: ${error.message}`);
      }
    });
});

// Button für Mitarbeiterverwaltung → Öffnet `manage-users.html`
document.getElementById("dashboardButton").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});
