# Mitarbeiterportal – Webbasierte Plattform zur internen Kommunikation und Feedback-Erfassung

Ein vollständiges, eigenständig entwickeltes **Full-Stack-System** zur internen Mitarbeiterverwaltung, bestehend aus **Node.js/Express Backend**, einer **SQLite Datenbank**, und einem **modular aufgebauten Frontend** auf Basis von HTML, CSS und JavaScript.  
Das Portal adressiert die Anforderung mittelständischer Unternehmen, Feedback-Prozesse, Mitarbeiterverwaltung und Authentifizierung zentralisiert, sicher und effizient abzubilden.

---

## 🚀 Zielsetzung

Das Mitarbeiterportal wurde entwickelt, um eine **skalierbare, sichere und benutzerfreundliche Plattform** zur Verfügung zu stellen, die folgende Kernanforderungen erfüllt:

- Strukturierte Verwaltung von Mitarbeiterdaten
- Sichere Anmeldung und Berechtigungssteuerung (JWT-basiert)
- Einheitlicher Kanal für personalisiertes und anonymes Mitarbeiterfeedback
- Entlastung der HR- und Admin-Prozesse durch ein zentrales Dashboard

---

## 🧩 Features

### 👤 **Mitarbeiter-Funktionen**

- **Registrierung mit Passwort-Hashing (bcrypt)**
- **Login + Token-basierte Authentifizierung (JWT)**
- **Persönliches und anonymes Feedback abgeben**
- Persönliches Feedback **bearbeiten und löschen**
- **Profil löschen** (passwortgeschützt, ohne E-Mail-Wiederholungen)
- Geschützte Routen für alle kritischen Operationen

---

### 🛠️ **Admin-Funktionen**

- **Admin-Login** (separater Token-Scope)
- Dashboard für:
  - Mitarbeiter anlegen
  - Daten ändern
  - Benutzer löschen
- Alle Feedbacks einsehen
- Feedback nach Zeitraum / Mitarbeiter filtern
- Rollenbasiertes Zugriffskonzept (Middleware gesteuert)

---

## 🔐 Sicherheit & Architektur

| Bereich           | Umsetzung                                                  |
| ----------------- | ---------------------------------------------------------- |
| **Auth**          | JWT-Token, getrennte Token-Scopes für Admin & Nutzer       |
| **Passwörter**    | Hashing via bcrypt                                         |
| **Transport**     | HTTPS-Ready, Middleware-basierte Tokenvalidierung          |
| **Storage**       | SQLite (relational), strukturierte Modelle                 |
| **Encryption**    | Feedback-Daten transport- und speicherseitig verschlüsselt |
| **Rollen / RBAC** | Middleware `isAdmin`, `authenticateToken`                  |

---

Die Trennung zwischen **Models**, **Controllern**, **Routen** und **Middleware** gewährleistet Wartbarkeit und einen sauberen Projekt-Scope.

---

## 🗄️ Datenbank-Design (SQLite)

### Tabellen

- **users**

  - id, first_name, last_name, email
  - password_hash
  - role (default: "employee")
  - is_registered (default false)

- **feedback**
  - id
  - user_id (nullable für anonymes Feedback)
  - content
  - encrypted
  - created_at, updated_at

---

## 🔌 API Overview

### Auth

- `POST /api/user/register`
- `POST /api/user/login`
- `POST /api/admin/login`

### Mitarbeiter

- `POST /api/feedback`
- `PATCH /api/feedback/:id`
- `DELETE /api/feedback/:id`
- `DELETE /api/user` (Profil löschen)

### Admin

- `POST /api/admin/user` (Benutzer anlegen)
- `DELETE /api/admin/user/:id`
- `GET /api/admin/feedback`
- `GET /api/admin/feedback?employeeId=…&from=…&to=…`

---

## ⚙️ Tech Stack

- **Backend:** Node.js, Express
- **Database:** SQLite
- **Auth:** JWT, bcrypt
- **Frontend:** HTML, CSS, Vanilla JS
- **Security:** Crypto API, Middleware-basierte Route Protection
- **DevOps:** Docker-ready Projektstruktur (optional erweiterbar)

---

## 📦 Installation & Start

```bash
# Dependencies installieren
npm install

# Datenbank initialisieren
npm run db:init

# Server starten
npm start
```
