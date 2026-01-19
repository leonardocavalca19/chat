document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let mioTelefono = null;
    const token = localStorage.getItem('chatToken');
    if (token) {
        socket.emit('authenticate', token);
    } else {
        window.location.href = '/';
    }
    socket.on('auth-error', (msg) => {
        localStorage.removeItem('chatToken');
        document.body.style.display = 'none';
        window.location.href = '/';
    });
    socket.on('auth-success', (userData) => {
        mioTelefono = userData.telefono;
        socket.emit('get-contatti');
    });
    const chat_screen = document.getElementById("chat-screen");
    const chat_default = document.getElementById("def-screen");
    chat_screen.style.display = "none";
    let chat_item = null;

    /* Controllo click delle chat (event delegation) */
    const div = document.getElementById("chat-items-container");
    div.addEventListener("click", (event) => {
        document.querySelector(".text-area").value = "";
        chat_item = event.target.closest(".chat-item");
        if (!chat_item) return;
        load_chat(chat_item);
        document.body.classList.add("mobile-chat-open");
    });
    const btnBack = document.getElementById("btn-back");
    if (btnBack) {
        btnBack.addEventListener("click", () => {
            document.body.classList.remove("mobile-chat-open");
        });
    }
    /* Comando chiusura chat */
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            chat_screen.style.display = "none";
            document.getElementById("chat-messages-zone").innerHTML = "";
            chat_default.style.display = "flex";
            e.preventDefault();
        }
    });

    /* Creazione lista contatti */
    socket.on("update-user-list", (listaUtenti) => {
        if (!div) return;
        if (mioTelefono === null) {
            console.log("Autenticazione non ancora completata, aspetto a disegnare la lista...");
            return;
        }
        let idChatAperta = null;
        if (chat_item) {
            idChatAperta = chat_item.dataset.id;
        }

        listaUtenti.forEach(utente => {
            if (String(utente.telefono) === String(mioTelefono)) return;
            let nomeFile = utente.avatar;
            if (nomeFile) {
                nomeFile = nomeFile.replace(/^public[\\/]/, '');
            }
            let anteprima = utente.ultimoMessaggio || "Tocca per chattare";
            const avatarSrc = nomeFile ? `/${nomeFile}` : '/avatar_default.jpg';
            let elementoEsistente = div.querySelector(`.chat-item[data-id="${utente.telefono}"]`);
            if (elementoEsistente) {
                const pMsg = elementoEsistente.querySelector(".chat-item-texts .chat-message");
                if (pMsg.innerText !== anteprima) {
                    pMsg.innerText = anteprima;
                }
                const imgTag = elementoEsistente.querySelector(".profile-pic");
                if (!imgTag.src.endsWith(avatarSrc)) {
                    imgTag.src = avatarSrc;
                }
            }
            else {

                div.innerHTML += `
            <div class="chat-item" data-id="${utente.telefono}" data-nome="${utente.nome}">
            <div class="chat-avatar"><img class="profile-pic" src="${avatarSrc}" onerror="this.src='/avatar_default.jpg'"></div>
            <div class="chat-item-texts">
            <p class="chat-name">${utente.nome}</p>
            <p class="chat-message">${anteprima}</p>
            </div>
            </div>`;
            }
            if (idChatAperta && String(utente.telefono) === String(idChatAperta)) {
                const headerImg = document.getElementById("profile-pic");
                const headerName = document.getElementById("nome-cont");
                if (headerImg) {
                    headerImg.src = avatarSrc;
                }
                if (headerName) {
                    headerName.innerText = utente.nome;
                }
            }

        });
        if (idChatAperta) {
            chat_item = div.querySelector(`.chat-item[data-id="${idChatAperta}"]`);
        }
    });


    function load_chat(data) {
        console.log("Loading chat for:", data.dataset.nome);
        let imgSrc = data.querySelector(".profile-pic").getAttribute("src");
        const avatarSrc = imgSrc ? `${imgSrc}` : '/avatar_default.jpg';
        document.getElementById("nome-cont").innerText = data.dataset.nome;
        document.getElementById("profile-pic").src = avatarSrc;
        socket.emit("ottieni-messaggi", ({ mittente: mioTelefono, destinatario: data.dataset.id }));
        chat_screen.style.display = "flex";
        chat_screen.style.flexDirection = "column";
        chat_default.style.display = "none";
    }

    socket.on("recv-message", (msg) => {
        if (chat_item && String(chat_item.dataset.id) === String(msg.mittente)) {
            const div = document.getElementById("chat-messages-zone");
            div.innerHTML += `
        <div class="${msg.mittente === mioTelefono ? "messaggio-container-r" : "messaggio-container-l"}">
            <div class="${msg.mittente === mioTelefono ? "messaggio-sended" : "messaggio-recvd"}">
                <p>${msg.testo}</p>
            </div>
        </div>`;
        }
        const itemMittente = document.getElementById("chat-items-container").querySelector(`.chat-item[data-id="${msg.mittente}"]`);
        if (itemMittente) {
            let anteprima = msg.testo;
            itemMittente.querySelector(".chat-message").innerText = anteprima;
        }
    });

    socket.on("carica-messaggi", (messaggi) => {
        const divMessaggi = document.getElementById("chat-messages-zone");
        divMessaggi.innerHTML = "";
        messaggi.forEach(messaggio => {
            divMessaggi.innerHTML += `
            <div class="${messaggio.mittente === mioTelefono ? "messaggio-container-r" : "messaggio-container-l"}">
                <div class="${messaggio.mittente === mioTelefono ? "messaggio-sended" : "messaggio-recvd"}">
                    <p>${messaggio.testo}</p>
                </div>
            </div>
            `;
        });
    });

    document.querySelector(".send").addEventListener("click", () => {
        if (document.querySelector(".text-area").value.trim() === "") return;
        let message = document.querySelector(".text-area").value;
        let dest = chat_item.dataset.id;
        socket.emit("send-message", { mittente: mioTelefono, destinatario: dest, messaggio: message });
        document.getElementById("chat-messages-zone").innerHTML +=
            `<div class="messaggio-container-r">
            <div class="messaggio-sended">
                <p>${message}</p>
            </div>
        </div>`;
        if (chat_item) {
            let anteprima = message;
            chat_item.querySelector(".chat-message").innerText = anteprima;
        }
        document.querySelector(".text-area").value = "";
    })
    document.querySelector(".text-area").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            document.querySelector(".send").click();
        }
    });
    document.getElementById("btn-logout").addEventListener("click", () => {
        localStorage.removeItem('chatToken');
        window.location.replace('/');
    });
});