// Zurück-Button führt zum Mitarbeiter-Dashboard
document.getElementById("back").addEventListener("click", () => {
  window.location.href = "dashboard.html";
});

// Feedback senden
document
  .getElementById("submitFeedback")
  .addEventListener("click", async () => {
    checkUserToken();
    const token = localStorage.getItem("token");
    const message = document.getElementById("feedbackMessage").value;
    const isAnonymous = document.getElementById("isAnonymous").checked;

    if (!message) {
      alert("Bitte schreibe ein Feedback!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/user/feedback", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, isAnonymous }),
      });

      if (response.ok) {
        alert("Feedback gesendet!");
        document.getElementById("feedbackMessage").value = ""; // Textfeld leeren
        document.getElementById("isAnonymous").checked = false; // Checkbox zurücksetzen
      } else {
        alert("Fehler beim Senden des Feedbacks.");
      }
    } catch (error) {
      console.error("Fehler:", error);
      alert("Serverfehler. Bitte versuche es später erneut.");
    }
  });
