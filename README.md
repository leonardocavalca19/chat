# 💬 WhatsNode

Un'applicazione di messaggistica istantanea real-time e persistente realizzata in **Node.js**.
Il progetto combina la potenza delle **WebSocket** per la comunicazione immediata con un backend solido basato su **SQLite** per il salvataggio dei dati. L'interfaccia segue le linee guida **Material Design 3** (Material You).

## 🚀 Funzionalità Principali

* **Real-time Messaging:** Scambio di messaggi istantaneo tramite Socket.io.
* **Persistenza Dati:** Utenti e messaggi sono salvati in un database **SQLite** locale (`utenti.db`).
* **Autenticazione Avanzata:**
    * Registrazione e Login protetti.
    * **Auto-Login:** Sistema basato su **Token di sessione** (salvati in `localStorage`) per mantenere l'utente connesso anche dopo aver ricaricato la pagina.
* **Gestione Avatar:**
    * Upload di immagini profilo personalizzate.
    * Creazione automatica di nomi file univoci e serving statico delle immagini.
* **Interfaccia Dinamica:**
    * **Sidebar Ridimensionabile:** Possibilità di trascinare il bordo della lista chat per allargarla o stringerla (`resize.js`).
    * Lista utenti online aggiornata in tempo reale.
    * Navigazione fluida (SPA-like) tra login e chat senza ricaricamenti inutili.
* **Design Material 3:**
    * Input animati con feedback visivo immediato sulla forza della password.
    * Switch visibilità password (👁️).

## 🛡️ Sicurezza e Validazione

Il progetto implementa standard di sicurezza industriali per proteggere utenti e server:

1.  **Password Hashing (Bcrypt):** Le password non sono mai salvate in chiaro, ma hashate utilizzando `bcrypt` prima di essere scritte nel database.
2.  **Protezione Brute-Force:** Il server monitora i tentativi di login falliti per IP. Dopo **5 tentativi errati**, l'IP viene bloccato temporaneamente per **15 minuti**.
3.  **Prevenzione XSS (Cross-Site Scripting):** Tutti i messaggi vengono sanitizzati lato server (convertendo caratteri come `<` `>` `&`) prima di essere inviati agli altri client.
4.  **Prevenzione SQL Injection:** Utilizzo di query parametrizzate per tutte le interazioni col database.
5.  **Validazione Rigorosa:**
    * **Password:** Regex complessa (Min 8 char, Maiuscola, Minuscola, Numero, Speciale) con feedback visuale in tempo reale.
    * **Telefono:** Controllo formato internazionale standard.

## 🛠️ Tecnologie Utilizzate

Il progetto è sviluppato privilegiando moduli nativi e librerie essenziali:

* **Backend:** Node.js (Moduli `http`, `fs`, `path`, `crypto`)
* **Real-time Engine:** Socket.io
* **Database:** SQLite3
* **Sicurezza:** Bcrypt (per hashing password)
* **Frontend:** HTML5, CSS3, Vanilla JS
* **Design System:** Google Material Design 3

## 📦 Installazione e Avvio

Il progetto è **totalmente portabile**. Il database e le cartelle necessarie si autogenerano al primo avvio.

1.  **Clona la repository** (o scarica la cartella):
    ```bash
    git clone [https://github.com/leonardocavalca19/chat.git](https://github.com/leonardocavalca19/chat.git)
    cd chat
    ```

2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```

3.  **Avvia il Server:**
    ```bash
    npm start
    # oppure: node server.js
    ```

4.  **Accedi all'App:**
    Apri il browser su: `http://localhost:3000`

## 📂 Struttura del Progetto

```text
/
├── database.js     # Connessione SQLite e creazione tabelle
├── server.js       # Server HTTP, WebSocket, Logica Auth e Upload
├── utenti.db       # Database (generato automaticamente)
├── public/         # Pagine HTML (Login, Registrazione, Chat)
├── css/            # Fogli di stile
├── js/             # Logica Client (Login, Chat, Resize, Registrazione)
├── img/            # Cartella immagini statiche
│   └── avatars/    # Upload degli avatar utenti
└── package.json    # Gestione dipendenze