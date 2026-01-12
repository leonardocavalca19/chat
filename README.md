# 💬 WhatsNode

Un'applicazione di messaggistica istantanea real-time e persistente realizzata in **Node.js**.
Il progetto combina la potenza delle **WebSocket** per la comunicazione immediata con un backend solido basato su **SQLite** per il salvataggio dei dati. L'interfaccia segue le linee guida **Material Design 3** (Material You).

## 🚀 Funzionalità Principali

* **Real-time Messaging:** Scambio di messaggi istantaneo tramite Socket.io.
* **Persistenza Dati:** Utenti e credenziali sono salvati in un database **SQLite** locale (`utenti.db`).
* **Autenticazione Sicura:** Sistema di Registrazione e Login protetto.
* **Gestione Utenti:** Lista utenti online aggiornata in tempo reale con notifica di connessione/disconnessione.
* **Design Material 3:**
    * Supporto nativo **Light/Dark Mode** (rileva impostazioni di sistema).
    * Input animati e feedback visivo.
    * Switch visibilità password (👁️).
* **UX Avanzata:** Normalizzazione automatica dei numeri di telefono (aggiunta prefisso +39).

## 🛡️ Sicurezza e Validazione

Il progetto implementa controlli rigorosi per garantire la sicurezza e l'integrità dei dati:

1.  **Prevenzione SQL Injection:** Utilizzo di *Prepared Statements* (query parametrizzate con `?`) per tutte le interazioni col database.
2.  **Validazione Password (Regex):** Obbligo di password forte (Minimo 8 caratteri, 1 Maiuscola, 1 Minuscola, 1 Numero).
    * `^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$`
3.  **Validazione Telefono (Regex):** Controllo formato internazionale E.164.
    * `^\+?[0-9]{8,15}$`
4.  **Sanitizzazione Input:** Pulizia automatica di spazi e caratteri speciali nei numeri di telefono prima del salvataggio.

## 🛠️ Tecnologie Utilizzate

Il progetto è sviluppato "da zero" privilegiando moduli nativi:

* **Backend:** Node.js (Modulo nativo `http` e `fs`)
* **Real-time Engine:** Socket.io
* **Database:** SQLite3 (Serverless & Portable)
* **Frontend:** HTML5, CSS3 (Variables & Flexbox), Vanilla JS
* **Design System:** Google Material Design 3
* **Icone:** Google Material Symbols Outlined

## 📦 Installazione e Avvio

Il progetto è **totalmente portabile**. Il database si autogenera al primo avvio.

1.  **Clona la repository** (o scarica la cartella):
    ```bash
    git clone [https://github.com/leonardocavalca19/chat.git](https://github.com/leonardocavalca19/chat.git)
    cd chat
    ```

2.  **Installa le dipendenze:**
    Verranno installati `socket.io` e `sqlite3`.
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
├── database.js     # Gestione connessione SQLite e auto-creazione tabelle
├── server.js       # Server HTTP e Logica WebSocket
├── utenti.db       # File del database (generato automaticamente)
├── public/         # Frontend (HTML)
├── css/            # Fogli di stile (Theme + Layout)
├── js/             # Logica Client (Login + Chat)
└── package.json    # Gestione dipendenze