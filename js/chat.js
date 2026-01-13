document.addEventListener("DOMContentLoaded", ()=>{
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
        socket.emit('get-user-list');
    });
    const chat_screen = document.getElementById("chat-screen");
    const chat_default = document.getElementById("def-screen");
    chat_screen.style.display = "none";
    
    /* Controllo click delle chat */
    const div = document.getElementById("chat-items-container");
    div.addEventListener("click", (event)=>{
        const chat_item = event.target.closest(".chat-item");
        if(!chat_item) return;
        const numTelefonoSelezionata = chat_item.dataset.id;
        chat_screen.style.display = "block";
        chat_default.style.display = "none";
    })

    /* Comando chiusura chat */
    document.addEventListener("keydown", (e)=>{
        if(e.key === "Escape")
        {
            chat_screen.style.display = "none";
            chat_default.style.display = "flex";
            e.preventDefault();
        }
    });

    /* Creazione lista contatti */
    socket.on("update-user-list", (listaUtenti) => {
        if(!div) return;
        div.innerHTML = ""; 

        listaUtenti.forEach(utente => {
            if (utente.telefono === mioTelefono) return; 
            const avatarSrc = utente.avatar ? `/${utente.avatar}` : '/avatar_default.jpg';
            div.innerHTML += `
            <div class="chat-item" data-id="${utente.telefono}">
                <div class="chat-avatar">
                    <img class="profile-pic" src="${avatarSrc}" onerror="this.src='/avatar_default.jpg'">
                </div>
                <div class="chat-item-texts">
                    <p class="chat-name">${utente.nickname}</p>
                    <p class="chat-message">Clicca per chattare</p>
                </div>
            </div>`;
        });
    });
});