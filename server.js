const http = require('http');
const path = require('path');
const { readFile } = require('fs').promises;
const fs = require('fs');
const { Server } = require("socket.io");
const db = require('./database');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const hostname = '127.0.0.1';
const port = 2000;
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
        let data = null;
        let percorsoStandard = path.join(__dirname, tipo.folder, nome + estensione);
        let percorsoAvatar = null;
        if (tipo.folder === 'img' && nome.startsWith('avatar_')) {
            percorsoAvatar = path.join(__dirname, 'img', 'avatars', nome + estensione);
        }
        if (percorsoAvatar) {
            try {
                data = await readFile(percorsoAvatar);
            } catch (err) {
            }
        }
        if (!data) {
            try {
                data = await readFile(percorsoStandard);
            } catch (err) {
            }
        }
        if (data) {
            res.statusCode = 200;
            res.setHeader('Content-Type', tipo.type);
            res.end(data);
        } else {
            try {
                let pagina404 = await readFile(path.join(__dirname, 'public', '404.html'));
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(pagina404);
            } catch (e) {
                res.statusCode = 404;
                res.end('Not Found');
            }
        }

    } else {
        try {
            let pagina404 = await readFile(path.join(__dirname, 'public', '404.html'));
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(pagina404);
        } catch (e) {
            res.statusCode = 404;
            res.end('Not Found');
        }
    }
}
var server = http.createServer(requestHandler);
const io = new Server(server, {
    maxHttpBufferSize: 5 * 1024 * 1024
});
let utentiOnline = {};
let sessioni = {};
const tentativiLogin = {};
io.on('connection', (socket) => {
    console.log('Nuovo client connesso:', socket.id);

    socket.on('register', async (data) => {
        const sql = "INSERT INTO users (telefono,nome,avatar,password) VALUES (?, ?, ?, ?)";
        async function hashpassword(password) {
            return await bcrypt.hash(password, 10);
        }
        if (!/^\+?[0-9]{8,15}$/.test(data.telefono)) {
            socket.emit('auth-error', 'Numero di telefono non valido.');
            return;
        }
        if (data.nome.trim() === '') {
            socket.emit('auth-error', 'Nome utente non valido.');
            return;
        }
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/.test(data.password)) {
            socket.emit('auth-error', 'Password non valida.');
            return;
        }
        const password = await hashpassword(data.password)
        const avatar = data.avatar || 'avatar_default.jpg';
        db.run(sql, [normalizzaTelefono(data.telefono), data.nome, avatar, password], function (err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    socket.emit('auth-error', 'Numero già registrato!');
                } else {
                    socket.emit('auth-error', 'Errore server.');
                    console.error(err);
                }
            } else {
                console.log(`Utente registrato: ${normalizzaTelefono(data.telefono)}`);
                const token = crypto.randomBytes(16).toString('hex');
                const nuovoUtente = {
                    telefono: normalizzaTelefono(data.telefono),
                    nickname: data.nome,
                    avatar: avatar
                };
                sessioni[token] = nuovoUtente;
                utentiOnline[socket.id] = nuovoUtente;
                socket.emit('register-success', {
                    token: token,
                    telefono: nuovoUtente.telefono,
                    nickname: nuovoUtente.nickname,
                    avatar: nuovoUtente.avatar
                });
                aggiornalista();
            }
        });
    });
    socket.on('login', async (data) => {
        const ip = socket.handshake.address;
        if (tentativiLogin[ip] && tentativiLogin[ip].count >= 5) {

            const tempoPassato = Date.now() - tentativiLogin[ip].ultimotentativo;

            if (tempoPassato < 15 * 60 * 1000) {
                const minutiRimanenti = Math.ceil((15 * 60 * 1000 - tempoPassato) / 60000);
                socket.emit('auth-error', `Troppi tentativi. Riprova tra ${minutiRimanenti} minuti.`);
                return;
            } else {
                tentativiLogin[ip] = { count: 0, ultimotentativo: Date.now() };
            }
        }

        const sql = "SELECT * FROM users WHERE telefono = ?";

        db.get(sql, [normalizzaTelefono(data.telefono)], async (err, row) => {
            if (err) {
                socket.emit('auth-error', 'Errore database');
                return;
            }
            if (!row) {
                socket.emit('auth-error', 'Credenziali non valide.');
                if (!tentativiLogin[ip]) {
                    tentativiLogin[ip] = { count: 1, ultimotentativo: Date.now() };
                } else {
                    tentativiLogin[ip].count += 1;
                    tentativiLogin[ip].ultimotentativo = Date.now();
                }
                return;
            }
            if (row) {
                const passwordCorretta = await bcrypt.compare(data.password, row.password);

                if (passwordCorretta) {
                    if (tentativiLogin[ip]) delete tentativiLogin[ip];
                    const token = crypto.randomBytes(16).toString('hex');
                    sessioni[token] = row;
                    utentiOnline[socket.id] = {
                        telefono: row.telefono,
                        nickname: row.nickname,
                        avatar: row.avatar
                    };
                    socket.emit('login-success', {
                        telefono: row.telefono,
                        nickname: row.nickname,
                        avatar: row.avatar,
                        token: token
                    });
                    aggiornalista();
                    socket.broadcast.emit('user-connected', row.telefono);
                    io.emit('update-user-list', Object.values(utentiOnline));
                }
                else {
                    socket.emit('auth-error', 'Credenziali non valide.');
                    if (!tentativiLogin[ip]) {
                        tentativiLogin[ip] = { count: 1, ultimotentativo: Date.now() };
                    } else {
                        tentativiLogin[ip].count += 1;
                        tentativiLogin[ip].ultimotentativo = Date.now();
                    }
                    console.log(`Login fallito IP ${ip}: ${tentativiLogin[ip].count}`);
                }
            }
        });
    });
    socket.on('authenticate', (token) => {
        const utente = sessioni[token];

        if (utente) {
            utentiOnline[socket.id] = {
                telefono: utente.telefono,
                nickname: utente.nickname,
                avatar: utente.avatar
            };
            
            socket.emit('auth-success', utente);
            console.log(`Utente riconnesso con token: ${utente.telefono}`);
        } else {
            socket.emit('auth-error', 'Sessione scaduta');
        }
    });
    socket.on('upload-avatar', (fileData) => {
        const mittente = utentiOnline[socket.id];
        if (!mittente) {
            socket.emit('upload-error', 'Sessione scaduta o non valida. Effettua di nuovo il login.');
            return;
        }
        const estensione = path.extname(fileData.nome).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.gif'].includes(estensione)) {
            socket.emit('upload-error', 'Formato non valido! Solo immagini.');
            return;
        }
        const stringa = String(mittente.telefono);
        const nuovoNomeFile = `avatar_${stringa.replace('+', '')}${estensione}`;
        const percorsoSalvataggio = path.join(__dirname, 'img', 'avatars', nuovoNomeFile);

        fs.writeFile(percorsoSalvataggio, fileData.buffer, (err) => {
            if (err) {
                console.error("Errore salvataggio immagine:", err);
                socket.emit('upload-error', 'Errore nel salvataggio del file.');
                return;
            }
            const sql = "UPDATE users SET avatar = ? WHERE telefono = ?";
            db.run(sql, [nuovoNomeFile, mittente.telefono], (err) => {
                if (err) {
                    console.error("Errore DB avatar:", err);
                    return;
                }
                if (utentiOnline[socket.id]) {
                    utentiOnline[socket.id].avatar = nuovoNomeFile;
                }
                socket.emit('upload-success', nuovoNomeFile);
                aggiornalista();
            });
        });
    });

    socket.on('chat-message', (messaggio) => {
        const mittente = utentiOnline[socket.id];
        if (!mittente) return;
        if (!messaggio) return;
        if (typeof messaggio !== 'string') return;
        messaggio = puliziamessaggio(messaggio);
        if (mittente && messaggio.trim().length > 0 && messaggio.length <= 500) {
            io.emit('chat-message', { user: mittente, text: messaggio });
        }
    });

    socket.on('disconnect', () => {
        const mittente = utentiOnline[socket.id];
        if (mittente) {
            delete utentiOnline[socket.id];
        }
    })

});
function aggiornalista() {
    const sql = "SELECT telefono, nome, avatar FROM users";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Errore recupero utenti:", err);
            return;
        }
        const listaPerClient = rows.map(row => ({
            telefono: row.telefono,
            nickname: row.nome,
            avatar: row.avatar
        }));
        io.emit('update-user-list', listaPerClient);
    });
}
function normalizzaTelefono(numero) {
    if (!numero || typeof numero !== 'string') return "";
    let numpulito = numero.replace(/[^0-9+]/g, '');

    if (!numpulito.startsWith('+')) {
        numpulito = '+39' + numpulito;
    }

    return numpulito;
}
function puliziamessaggio(text) {
    if (!text) return text;
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
server.listen(port, hostname, function () {

    console.log(`Server running at http://${hostname}:${port}/`);

});
