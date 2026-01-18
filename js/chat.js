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
        div.innerHTML = "";

        listaUtenti.forEach(utente => {
            if (String(utente.telefono) === String(mioTelefono)) return;
            const avatarSrc = utente.avatar ? `/${utente.avatar}` : '/avatar_default.jpg';
            div.innerHTML += `
            <div class="chat-item" data-id="${utente.telefono}" data-nome="${utente.nome}">
            <div class="chat-avatar"><img class="profile-pic" src="${avatarSrc}" onerror="this.src='/avatar_default.jpg'"></div>
            <div class="chat-item-texts">
            <p class="chat-name">${utente.nome}</p>
            <p class="chat-message"></p>
            </div>
            </div>`;
        });
    });


    function load_chat(data) {
        let imgSrc = data.querySelector(".profile-pic").src
        const avatarSrc = imgSrc ? `/${imgSrc}` : '/avatar_default.jpg';
        document.getElementById("nome-cont").innerText = data.dataset.nome;
        document.getElementById("profile-pic").src = avatarSrc;
        chat_screen.style.display = "block";
        chat_default.style.display = "none";
        /*chat_screen.innerHTML = `
        <div class="chat-top-zone">
        <div class="chat-avatar"><img class="profile-pic" src="${avatarSrc}" onerror="this.src='/avatar_default.jpg'"></div>
        <p class="chat-name">${data.dataset.nome}</p>
        </div>
        <div class="chat-writer-zone">
        <input class="text-area" type="text" placeholder="Scrivi un messaggio">
        <button class="send">S</button>
        </div>`;*/
    }

    socket.on("recv-message", (data) => {
        console.log("Sended");
        document.getElementById("chat-messages-zone").innerHTML +=
            `<div class="messaggio-container-l">
            <div class="messaggio-recvd">
                <p>${data[0]}</p>
            </div>
        </div>`
    });

    document.querySelector(".send").addEventListener("click", () => {
        if (document.querySelector(".text-area").value === "") return;
        let message = document.querySelector(".text-area").value;
        let dest = chat_item.dataset.id;
        socket.emit("send-message", { messaggio: message, destinatario: dest });
        document.getElementById("chat-messages-zone").innerHTML +=
            `<div class="messaggio-container-r">
            <div class="messaggio-sended">
                <p>${message}</p>
            </div>
        </div>`
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