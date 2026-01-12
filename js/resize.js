document.addEventListener("DOMContentLoaded", ()=>{
    const divider = document.getElementById("chat-divider");
    const div_left = document.getElementById("chat-list");
    let isDragging = false;

    divider.addEventListener("mousedown", function(e){
        isDragging = true;
        document.body.style.cursor = "col_resize";
        e.preventDefault();
    });

    document.addEventListener("mousemove", function(e){
        if(!isDragging) return;
        const newWidth = e.clientX;
        if(newWidth > 150 && newWidth < window.innerWidth - 150)
        {
            div_left.style.flex = "none";
            div_left.style.width = newWidth + "px";
        }
    });
    document.addEventListener("mouseup", function(){
        isDragging = false;
        document.body.style.cursor = "default";
    });
})