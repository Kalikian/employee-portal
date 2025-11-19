document.addEventListener("DOMContentLoaded", () => {
  checkUserToken();
  loadFeedbacks();
});

// Zurück-Button führt zum Feedback-Schreiben
document.getElementById("back").addEventListener("click", () => {
  window.location.href = "feedback.html";
});

document
  .getElementById("deleteSelected")
  .addEventListener("click", async () => {
    checkUserToken();
    const token = localStorage.getItem("token");

    // Nur eine ausgewählte Checkbox abrufen
    const selectedCheckbox = document.querySelector(
      ".feedbackCheckbox:checked"
    );

    if (!selectedCheckbox) {
      alert("Bitte wähle ein Feedback zum Löschen aus.");
      return;
    }

    const feedbackId = selectedCheckbox.dataset.id;

    if (
      !confirm(`Willst du das Feedback mit ID ${feedbackId} wirklich löschen?`)
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/user/feedback/${feedbackId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        alert("Feedback wurde erfolgreich gelöscht!");
        location.reload(); // Seite neuladen, um die aktualisierte Liste zu sehen
      } else {
        alert("Fehler beim Löschen des Feedbacks.");
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Serverfehler. Bitte versuche es später erneut.");
    }
  });

// Eigene Feedbacks abrufen
async function loadFeedbacks() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/user/feedback", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const result = await response.json();

    const tableBody = document.querySelector("#feedbackTable tbody");
    tableBody.innerHTML = ""; // Vorherige Einträge entfernen

    result.feedbacks.forEach((feedback) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${new Date(feedback.created_at).toLocaleDateString()}</td>
        <td>${feedback.message}</td>
        <td><input type="checkbox" class="feedbackCheckbox" data-id="${feedback.id}"></td>`;

      tableBody.appendChild(row);
    });

    setupSingleCheckboxSelection("feedbackCheckbox");
  } catch (error) {
    console.error("Fehler:", error);
    alert("Serverfehler. Bitte versuche es später erneut.");
  }
}
