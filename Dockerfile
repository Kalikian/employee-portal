# 1️⃣ Basis-Image mit Node.js
FROM node:18

# 2️⃣ Setze das Arbeitsverzeichnis
WORKDIR /mitarbeiterportal

# 3️⃣ Kopiere package.json und yarn.lock zuerst
COPY package.json yarn.lock .yarnrc.yml ./

# 4️⃣ Aktiviere Corepack für Yarn 4
RUN corepack enable

# 5️⃣ Stelle sicher, dass Yarn mit `node_modules/` arbeitet
RUN yarn config set nodeLinker node-modules

# 6️⃣ Installiere die Abhängigkeiten mit `node_modules`
RUN yarn install

# 7️⃣ Kopiere den restlichen Code ins Image
COPY . .

# 8️⃣ Exponiere Port 3000
EXPOSE 3000

# 9️⃣ Starte die Anwendung
CMD ["node", "/mitarbeiterportal/backend/server.js"]


