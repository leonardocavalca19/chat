document.addEventListener("DOMContentLoaded", ()=>{
    const socket = io();
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
    socket.on("contatti-list", (data)=>{
        data.forEach(contatto => {
            div.innerHTML += `
            <div class="chat-item" data-id="${contatto.numero}">
                <div class="chat-avatar"><img class="profile-pic" src="../img/${contatto.avatar}"></div>
                <div class="chat-item-texts">
                    <p class="chat-name" id="chat-name">${contatto.nome}</p>
                    <p class="chat-message" id="chat-message"></p>
                </div>
            </div>`
        });
    });
});