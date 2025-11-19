const jwt = require("jsonwebtoken");
require("dotenv").config(); // Lädt JWT_SECRET aus .env

const SECRET_KEY = process.env.JWT_SECRET; //JWT-Schlüssel aus Umgebungsvariablen

const authenticateToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; //Token extrahieren
    if (!token) {
      return res.status(401).json({
        error: "Kein Token vorhanden, Zugriff verweigert",
        expired: false,
      });
    }
    const verified = jwt.verify(token, SECRET_KEY); //Token prüfen und entschlüsseln
    req.user = verified; //userId wird in req.user gespeichert
    next();
  } catch (error) {
    console.log("Fehler in authenticateToken", error.message);

    res.status(403).json({ error: "Ungültiger oder abgelaufener Token" });
  }
};

module.exports = authenticateToken;
