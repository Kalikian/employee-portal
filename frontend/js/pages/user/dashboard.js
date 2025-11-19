document.addEventListener("DOMContentLoaded", async () => {
  checkUserToken();

  // Logout-Button erst suchen, wenn das DOM geladen ist
  const logoutButton = document.getElementById("logout");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("Logout-Button geklickt, Token wird entfernt.");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "login.html";
    });
  } else {
    console.error("Logout-Button nicht gefunden!");
  }
});
