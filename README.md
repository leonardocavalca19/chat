# 💬 WhatsNode - Real-time Material Chat

Un'applicazione di messaggistica istantanea multiutente realizzata in **Node.js**.
Il progetto combina la potenza delle **WebSocket** per la comunicazione in tempo reale con un'interfaccia moderna basata su **Material Design 3** (Material You), realizzata interamente con CSS3 nativo e Variabili CSS.

## 🚀 Funzionalità Principali

* **Real-time Messaging:** Scambio di messaggi istantaneo tra tutti gli utenti connessi (senza ricaricare la pagina).
* **Design Material 3:** Interfaccia moderna con supporto nativo al **Tema Chiaro** e **Tema Scuro** (rileva automaticamente le impostazioni di sistema).
* **Gestione Utenti:** Sistema di Login (nickname) e lista utenti online aggiornata in tempo reale.
* **Stato Condiviso:** Il server mantiene la memoria degli utenti connessi e notifica ingressi/uscite.
* **UX Curata:**
    * Login con switch visibilità password (👁️).
    * Feedback visivo sui messaggi inviati/ricevuti.
    * Layout responsive (adatto a Desktop e Mobile).

## 🛠️ Tecnologie Utilizzate

Il progetto rispetta i vincoli di utilizzo di tecnologie standard e open source:

* **Backend:** Node.js
* **Protocollo:** Socket.io (WebSockets)
* **Frontend:** HTML5 Semantico, CSS3 (Flexbox, CSS Variables), Vanilla JavaScript (ES6+)
* **Design System:** Google Material Design 3 (Tokens)
* **Font:** Roboto & Material Symbols Outlined

## 📦 Installazione e Avvio

1.  **Clona la repository** (o scarica la cartella):
    ```bash
    git clone https://github.com/leonardocavalca19/chat.git
    cd chat
    ```

2.  **Installa le dipendenze:**
    Assicurati di avere Node.js installato, poi esegui:
    ```bash
    npm install
    ```

3.  **Avvia il Server:**
    ```bash
    node server.js
    ```

4.  **Accedi all'App:**
    Apri il browser e vai su: `http://localhost:3000`

## ✅ Requisiti del Progetto Soddisfatti

Questo progetto è stato sviluppato rispettando i seguenti vincoli didattici:

- [x] **Stack Tecnologico:** Utilizzo esclusivo di HTML5, CSS3, JS Client e Node.js Server.
- [x] **WebSocket:** Implementazione di `socket.io` per connessioni persistenti.
- [x] **Multiutente:** Gestione di più client contemporanei.
- [x] **Stato Condiviso:** Mantenimento della lista utenti lato server.
- [x] **Real-time:** I client ricevono aggiornamenti (chat e lista utenti) istantaneamente.
- [x] **Interattività:** Possibilità di inviare comandi (messaggi) e ricevere risposte visibili a tutti.
