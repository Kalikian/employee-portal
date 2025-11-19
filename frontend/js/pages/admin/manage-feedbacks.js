document.addEventListener("DOMContentLoaded", async () => {
  checkAdminToken();
  const token = localStorage.getItem("adminToken");

  try {
    const response = await fetch("http://localhost:3000/api/admin/feedback", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const textResponse = await response.json();

    const feedbacks = textResponse.feedbacks;
    const count = textResponse.count;
    document.getElementById("feedbackCount").textContent = count;

    // **Fehlermeldung, falls keine Feedbacks vorhanden sind**
    if (!textResponse.feedbacks || !Array.isArray(textResponse.feedbacks)) {
      throw new Error("Ungültiges Datenformat erhalten.");
    }

    // **Tabelle aktualisieren**
    const tableBody = document.querySelector("#feedbackTable tbody");
    tableBody.innerHTML = ""; // Vorherige Einträge entfernen

    feedbacks.forEach((feedback) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td><input type="checkbox" class="feedbackCheckbox" data-id="${feedback.id}"></td>
          <td>${feedback.id}</td>
          <td>${feedback.user_name || "Anonym"}</td>
          <td>${feedback.message}</td>
          <td>${new Date(feedback.created_at).toLocaleDateString()}</td>
        `;
      tableBody.appendChild(row);
    });

    // **Checkbox-Event-Listener für Mehrfachauswahl**
    setupSingleCheckboxSelection("feedbackCheckbox");
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Feedbacks:", error);
    alert("Serverfehler. Bitte später erneut versuchen.");
  }
});

// **Mehrere Feedbacks löschen**
document
  .getElementById("deleteSelectedFeedbacks")
  .addEventListener("click", async () => {
    checkAdminToken();
    const token = localStorage.getItem("adminToken");
    const checkedBoxes = document.querySelectorAll(".feedbackCheckbox:checked");

    if (checkedBoxes.length === 0) {
      alert("Bitte mindestens ein Feedback auswählen.");
      return;
    }

    const feedbackIds = Array.from(checkedBoxes).map((cb) => cb.dataset.id);

    if (!confirm(`Möchtest du die ausgewählten Feedbacks wirklich löschen?`))
      return;

    try {
      const response = await fetch(
        `http://localhost:3000/api/admin/feedbacks/${feedbackIds}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Feedbacks erfolgreich gelöscht!");
        location.reload();
      } else {
        console.error("❌ Fehler beim Löschen:", await response.text());
        alert("Fehler beim Löschen der Feedbacks.");
      }
    } catch (error) {
      console.error("❌ Fehler beim Löschen:", error);
      alert("Serverfehler. Bitte später erneut versuchen.");
    }
  });
