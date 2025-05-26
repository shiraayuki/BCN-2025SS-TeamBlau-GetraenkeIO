# Backend
Hier befindet sich das Backend-Projekt in form einer REST-API, die mit dem Python-Framework FastAPI erstellt wird. Zur Datenhaltung wird das ORM-Framework SQLModel verwendet.
Als Datenbank soll PostgreSQL verwendet werden (noch nicht implementiert).

## Deployment Infos
Docker noch nicht implementiert siehe Development Infos.

## Development Infos
Im folgenden alle notwendigen Infos um das Backend-Projekt zu starten.

### Konfiguration
Die Konfiguration des Programms funktioniert über Umgebungsvariablen, dafür kann einfach die .env.example nach .env kopiert werden.
Bitte die Datei .env nicht in die Versionskontrolle commiten.

### Virtuelles Environment
Es wird empfohlen für das Projekt ein eigenes virtual environment zu erstellen.   
```python3 -m venv .venv```  
Dies ist nur einmal notwendig anschließend kann dieses mittels    
```source .venv/bin/activate``` (Linux)   
```.\.venv\Scripts\Activate.ps1``` (Windows) aktiviert werden.  
 Falls in Windows eine Berechtigungs-Fehlermeldung erscheint, kann mit folgendem Befehl abhilfe geschaffen werden: ```Set-ExecutionPolicy Unrestricted -Scope Process``` (Muss in jeder Terminal-Sitzung erneut ausgeführt werden.)

### Abhängigkeiten
Die abhängigkeiten stehen in der Datei requirements.txt und können wie folgt automatisch installiert werden.  
```pip install -r requirements.txt```

### Start
Folgender Befehl genügt um das Programm zu starten.  
```fastapi dev app/main.py```
(Vorausgesetzt, man befindet sich im backend-Verzeichnis)

### Tests
Es wird das Test-Framework pytest verwendet.
Zum testen wird für jeden Test eine neue In-Memory-Datenbank(SQLite) angelegt, damit die Tests isoliert ablaufen.
#### Automatische Tests
Todo: Es sollen bei jedem einchecken automatisch alle UnitTests via Github-Actions ausgeführt werden.
#### Manuelle Ausführung
```
pytest
```
#### Testabdeckung
Um die Testabdeckung zu sehen kann das Python modul coverage installiert werden.
```pip install coverage```
Anschließend ```coverage run -m pytest``` um die Tests zu starten und
```coverage report``` um die Testabdeckung auszuwerten.
