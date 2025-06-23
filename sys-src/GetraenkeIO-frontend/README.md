# GetraenkeIO Frontend

Hier befindet sich das Frontend-Projekt für **GetraenkeIO** in Form einer [React](https://react.dev/)-Anwendung, welche mit [Vite](https://vitejs.dev/) erstellt wurde und [Typescript](https://typescriptlang.org/) als Sprache verwendet. Für Design, Api-Calls und State-Management werden folgende Bibliotheken verwendet:

- **@mui/material**
- **Axios**
- **React-Redux**.

---

## Vorraussetzungen 

- Node.js (empfohlen: LTS version, z.B.: 18.x oder höher)
- Paketmanager wie **npm** (standardmäßig bei Node.js enthalten)
- optional: **Docker** (für Deloyment)

---

## Deployment mit Docker

### Schritte
- Docker-Image bauen:
```
docker build -t getraenkeio-frontend .
```
- Container starten:
```
docker run -p 3000:3000 getraenkeio-frontend
```
- Die Anwendung kann nun im Browser ihrer Wahl aufgerufen werden:
```
http://localhost:3000
```

> ⚠️ **Achtung:** Diese Anwendung benötigt ein laufendes Backend, um korrekt zu funktionieren.

---

## Development mit Vite

Bevor das Starten der Anwendung möglich ist müssen zunächste alle Pakete installiert werden.
```
npm install
```
Danach kann mit kann mit folgenden Befehl die Anwendung gestartet werden:
```
npm run dev
```
Die Anwendung läuft nun im Developer-Modus (meist unter "http://localhost:5173").
Beim Speichern einer Datei im Projektverzeichnis, wird die Anwenung automatisch neu geladen und die Änderungen integriert.
