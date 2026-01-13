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
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            telefono INTEGER PRIMARY KEY,
            nome TEXT,
            password TEXT,
            avatar TEXT DEFAULT 'avatar_default.jpg',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(sql, (err) => {
        if (err) console.error("Errore creazione tabella:", err.message);
    });
}

module.exports = db;