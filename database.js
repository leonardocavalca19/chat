const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'utenti.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Errore connessione DB:', err.message);
    } else {
        console.log('Connesso al database SQLite.');
        creatabella();
    }
});
function creatabella() {
    const sqlUsers = `
        CREATE TABLE IF NOT EXISTS users (
            telefono TEXT PRIMARY KEY,
            nome TEXT,
            password TEXT,
            avatar TEXT DEFAULT 'avatar_default.jpg',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    const sqlMessages = `
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mittente TEXT NOT NULL,
            destinatario TEXT NOT NULL,
            testo TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (mittente) REFERENCES users(telefono),
            FOREIGN KEY (destinatario) REFERENCES users(telefono)
        )
    `;

    db.serialize(()=>{
        db.run(sqlUsers, (err)=>{ if(err){ console.error("Errore creazione tabella:", err.message); } });
        db.run(sqlMessages, (err)=>{ if(err){ console.error("Errore creazione tabella:", err.message); } });
    });
}

module.exports = db;