const joinBtn =
    document.getElementById("joinBtn");

joinBtn.addEventListener("click", () => {

    const username =
        document.getElementById("username").value;

    if(username.trim() === ""){
        alert("Enter username");
        return;
    }

    localStorage.setItem(
        "username",
        username
    );

    window.location.href =
        "index.html";
});