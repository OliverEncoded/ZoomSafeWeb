var socket = io.connect();
socket.on("hereToken", function(newToken) {
    localStorage.setItem("token", newToken);
    window.location.replace("links.html");
});

if(localStorage.getItem("info")){
    socket.emit("login", {"username" : localStorage.getItem("infoUser"), "password" : localStorage.getItem("infoPass")});
}

function login() {
    var usernameIn = document.getElementById("username");
    var passwordIn = document.getElementById("password");
    var rem = document.getElementById("rem").checked;
    if(rem){
        localStorage.setItem("infoUser", usernameIn.value);
        localStorage.setItem("infoPass", passwordIn.value);
    }
    socket.emit("login", {"username" : usernameIn.value, "password" : passwordIn.value});
}