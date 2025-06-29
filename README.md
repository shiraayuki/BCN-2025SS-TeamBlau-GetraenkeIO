<h1><img src="./sys-src/GetraenkeIO-frontend/public/logo.svg" alt="logo" width="40"/> GetraenkeIO</h1>

GetraenkeIO ist eine webbasierte Software zur Verwaltung des Getränkelagers in Vereinen oder anderen Einrichtungen. Sie ermöglicht es registrierten Benutzern, Getränke eigenständig zu buchen, während Administratoren mit erweiterten Rechten Zugriff auf Bestandsstatistiken und Verwaltungsfunktionen haben. Das System unterstützt die effiziente Verwaltung des Lagers.

Technologisch basiert die Anwendung auf einem Python-Backend, das über eine REST-API mit einem React-basierten Frontend kommuniziert. Die Lagerbestände und andere relevante Daten werden in einer relationalen PostgreSQL-Datenbank gespeichert. Docker wird verwendet, um die Anwendung flexibel bereitzustellen und eine einfache Skalierbarkeit zu gewährleisten.

## Deployement

**Voraussetzungen:** Um die Anwendung starten zu können, müssen [Docker](https://www.docker.com/) und [Docker-Compose](https://docs.docker.com/compose/) installiert sein.

**Deployement:** Sind alle voraussetzungen erfüllt, genügt ```docker-compose up``` in [sys-src](./sys-src/) zum Erstellen und Bereitstellen der Applikation.

**Erreichbarkeit:** Das Frontend ist über den Port *3000* erreichbar (z.B. ```http://localhost:3000```).  
Das Backend ist am Port *8000* erreichbar, dies ist für den Endbenutzer allerdings irrelevant.

**Admin-Nutzer:** Der Adminbenutzer ist standardmäßig mit dem Benutzername **admin** und dem Passwort **getraenkeverwalter** verfügbar. Das Passwort kann vor installlation in der [Docker-Compose-Datei](./sys-src/docker-compose.yml) angepasst werden.


## Entwicklerinformationen

Für Information zur Entwicklung können die Readme-Seiten des [Frontends](./sys-src/GetraenkeIO-frontend/README.md) und [Backends](./sys-src/GetraenkeIO-backend/Readme.md) gelesen werden.