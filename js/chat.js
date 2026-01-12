document.addEventListener("DOMContentLoaded", ()=>{
    const chat_screen = document.getElementById("chat-screen");
    const chat_default = document.getElementById("def-screen");
    chat_screen.style.display = "none";
    document.getElementById("chat-item").addEventListener("click", ()=>{
        chat_screen.style.display = "block";
        chat_default.style.display = "none";
    });
    document.addEventListener("keydown", (e)=>{
        if(e.key === "Escape")
        {
            chat_screen.style.display = "none";
            chat_default.style.display = "flex";
            e.preventDefault();
        }
    });
});