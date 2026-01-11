const http = require('http');
const path = require('path');
const { readFile } = require('fs').promises;
const fs = require('fs');
const url = require('url');
const { Server } = require("socket.io");
const db = require('./database');

const hostname = '127.0.0.1';
const port = 3000;
const tipi = {
    '.html': { type: 'text/html', folder: 'public' },
    '.css': { type: 'text/css', folder: 'css' },
    '.js': { type: 'application/javascript', folder: 'js' },
    '.jpg': { type: 'image/jpeg', folder: 'img' },
    '.png': { type: 'image/png', folder: 'img' }
};
async function requestHandler(req, res) {
    let estensione = path.extname(req.url) || '.html';
    let nome = path.basename(req.url, estensione) || 'login';
    let tipo = tipi[estensione.toLowerCase()];
    if (tipo) {
        let percorso = path.join(__dirname, tipo.folder, nome + estensione);
        try {
            let data = await readFile(percorso);
            res.statusCode = 200;
            res.setHeader('Content-Type', tipo.type);
            res.end(data);
        }
        catch (err) {
            try {
                let data = await readFile(path.join(__dirname, 'html', '404.html'));
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
            catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Errore interno del server');
            }
        }

    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Risorsa non trovata');
    }

}
var server = http.createServer(requestHandler);
const io = new Server(server);
let utentiOnline = {};
io.on('connection', (socket) => {
    console.log('Nuovo client connesso:', socket.id);

    socket.on('register', (data) => {
        const sql = "INSERT INTO users (telefono, password) VALUES (?, ?)";

        db.run(sql, [normalizzaTelefono(data.telefono), data.password], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    socket.emit('auth-error', 'Numero già registrato!');
                } else {
                    socket.emit('auth-error', 'Errore server.');
                    console.error(err);
                }
            } else {
                socket.emit('register-success');
                console.log(`Utente registrato: ${normalizzaTelefono(data.telefono)}`);
            }
        });
    });
    socket.on('login', (data) => {
        const sql = "SELECT * FROM users WHERE telefono = ? AND password = ?";

        db.get(sql, [normalizzaTelefono(data.telefono), data.password], (err, row) => {
            if (err) {
                socket.emit('auth-error', 'Errore database');
                return;
            }
            if (row) {
                utentiOnline[socket.id] = row.telefono;
                socket.emit('login-success', row.telefono);

                socket.broadcast.emit('user-connected', row.telefono);
                io.emit('update-user-list', Object.values(utentiOnline));
            } else {
                socket.emit('auth-error', 'Dati errati.');
            }
        });
    });

    socket.on('chat-message', (messaggio) => {
        const mittente = utentiOnline[socket.id];
        if (mittente) {
            io.emit('chat-message', { user: mittente, text: messaggio });
        }
    });

    socket.on('disconnect', () => {
        const mittente = utentiOnline[socket.id];
        if (mittente) {
            delete utentiOnline[socket.id];
            io.emit('update-user-list', Object.values(utentiOnline));
        }
    });

});
server.listen(port, hostname, function () {

    console.log(`Server running at http://${hostname}:${port}/`);

});
function normalizzaTelefono(numero) {
    let numpulito = numero.replace(/[^0-9+]/g, '');

    if (!numpulito.startsWith('+')) {
        numpulito = '+39' + numpulito;
    }

    return numpulito;
}