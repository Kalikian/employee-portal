document.addEventListener("DOMContentLoaded", async () => {
  checkAdminToken();
  const token = localStorage.getItem("adminToken");

  try {
    const response = await fetch("http://localhost:4000/api/admin/users", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { users } = await response.json();

    const tableBody = document.querySelector("#userTable tbody");
    tableBody.innerHTML = ""; // Vorherige Einträge entfernen

    users.users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><input type="checkbox" class="userCheckbox" data-id="${user.id}"${
                  user.role === "admin" ? "disabled" : ""
                }></td>
                <td>${user.id}</td>
                <td>${user.first_name}</td>
                <td>${user.last_name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>${user.is_registered ? "Ja" : "Nein"}</td>
            `;
      tableBody.appendChild(row);
    });

    // **Hier Checkbox-Event-Listener setzen**
    setupSingleCheckboxSelection("userCheckbox");
  } catch (error) {
    console.error("Fehler beim Abrufen der Benutzerliste:", error);
    alert("Serverfehler. Bitte später erneut versuchen.");
  }
});

// Benutzer löschen (nur angekreuzte)
document
  .getElementById("deleteUsersButton")
  .addEventListener("click", async () => {
    checkAdminToken();
    const token = localStorage.getItem("adminToken");
    const checkedBox = document.querySelector(".userCheckbox:checked"); // Nur eine Checkbox auswählen

    if (!checkedBox) {
      alert("Bitte einen Benutzer auswählen.");
      return;
    }

    const userId = checkedBox.dataset.id; // Einzelne Benutzer-ID holen

    if (!confirm(`Möchtest du Benutzer mit ID ${userId} wirklich löschen?`))
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }), // Benutzer-ID im Body senden!
        }
      );

      if (response.ok) {
        alert("Benutzer erfolgreich gelöscht!");
        location.reload(); // Seite neuladen, um Liste zu aktualisieren
      } else {
        alert("Fehler beim Löschen des Benutzers.");
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Serverfehler. Bitte später erneut versuchen.");
    }
  });

document.getElementById("backToManageUsers").addEventListener("click", () => {
  window.location.href = "manage-users.html"; // Zurück zur Verwaltung
});
