var socket = io.connect();
var linksArr;
var token =localStorage.getItem("token");
updateLinks();
socket.on("hereLinks", function (links) {
    linksArr = links;
    let HTML = "";
    links.forEach((link, index) => {
        let fileDis = 
        `<div class="card">
            <h2>
                <b>${link.name}</b>
            </h2>
            <p>ID: ${link.id}</p>
            <p>Password: ${link.password}</p>
            <button onClick="goToLink(${index})">Go To Link</button>
            <button onClick="copyLink(${index})">Copy Link</button>
            <button onClick="removeCard(${index})">Remove Card</button>
      </div>`;
        HTML += fileDis;
    });
    document.getElementById("links").innerHTML = HTML;
});

function goToLink(index) {
    window.location.replace(linksArr[index].link);
}

function removeCard(index) {
    socket.emit("removeCard",{"cardName" : linksArr[index].name, "token" : token});
    updateLinks();
}

function copyLink(index) {
    box = document.getElementById("linkBox");
    box.value = linksArr[index].link;
    box.select();
    box.setSelectionRange(0, 99999);
    document.execCommand("copy");
}

function newCard() {
    var name = document.getElementById("inName");
    var id = document.getElementById("inId");
    var pass = document.getElementById("inPassword");
    var link = document.getElementById("inLink");
    socket.emit("newCard",{"card" :
    {
        "newName" : name.value,
        "newLink" : link.value,
        "newId" : id.value,
        "newPassword" : pass.value
    },
    "token" : token
});
    name.value = "";
    id.value = "";
    pass.value = "";
    link.value = ""
    updateLinks();
    }

function updateLinks() {
    socket.emit("getLinks", token);
}

function logout() {
    localStorage.clear();
    window.location.replace("login.html");
}