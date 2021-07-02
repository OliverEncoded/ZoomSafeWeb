var socket = io.connect();

function createUser() {
    var user = document.getElementById("username");
    var password = document.getElementById("password");
    var conPass = document.getElementById("conPassword");
    var email = document.getElementById("email");
    if(password.value == conPass.value && password.value != "" && user.value != "" && email.value != ""){
        socket.emit("newUser", {"username" : user.value, "password" : password.value, "email" : email.value});
        user.value = "";
        password.value = "";
        conPass.value = "";
        email.value = "";
    }
}