const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs")
const nodemailer = require('nodemailer');
const config = require("./config.json");
let links = require("./links.json");
let users = require("./users.json");

var transporter = nodemailer.createTransport({
    service: config.mail.service,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass
    }
  });

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = config.port;

let validTokens = {};

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("user connected");
    socket.on("login", function (data) {
        if (users.hasOwnProperty(data.username) && users[data.username].password == data.password) {
            let token = genToken();
            validTokens[token] = {
                "token": token,
                "user": data.username
            };
            socket.emit("hereToken", token);
            setTimeout(function () { delete (validTokens[token]) }, 1000 * 60 * 15);
            console.log(validTokens);
        }
    });
    socket.on("getLinks", function (token) {
        if (checkToken(token)) {
            socket.emit("hereLinks", getUserLinks(token));
        }
    });

    socket.on("newUser", function (data) {
        if (!users.hasOwnProperty(data.username)) {
            users[data.username] = {
                "password": data.password,
                "email" : data.email
            }
            links[data.username] = [];
            sendEmail(data.email, "Account created", 
"A Zoom safe account has been created with this email if it was not you please reply to this email and state your issue");

refreshLinks();
            refreshUsers();
        }
    });

    socket.on("removeCard", function (data) {
        if (checkToken(data.token)) {
            getUserLinks(data.token).forEach((e, index) => {
                if (e.name == data.cardName) {
                    getUserLinks(data.token).splice(index, 1);
                    refreshLinks();
                    return;
                }
            });
        }
    });

    socket.on("newCard", function (data) {
        let token = data.token;
        if (checkToken(token)) {
            getUserLinks(token).push({
                "name": data.card.newName,
                "id": data.card.newId,
                "password": data.card.newPassword,
                "link": data.card.newLink
            });
            refreshLinks();
        }
    });
});

function refreshLinks() {
    var json = JSON.stringify(links, null, 10);
    fs.writeFile('links.json', json, 'utf8', function (err) {
        if (err) console.log(err);
    });
}

function refreshUsers() {
    var json = JSON.stringify(users, null, 10);
    fs.writeFile('users.json', json, 'utf8', function (err) {
        if (err) console.log(err);
    });
}

function genToken() {
    let tempToken = Math.round(Math.random() * config.tokenLength);
    return tempToken;
}

function getUserLinks(token) {
    return links[validTokens[token].user]
}

function checkToken(token) {
    if (validTokens.hasOwnProperty(token)) return true;
    return false;
}

function sendEmail(email, subject, content) {
    
      let mailOptions = {
        from: 'ZoomSafeEmail@gmail.com',
        to: email,
        subject: subject,
        text: content
      };

      transporter.sendMail(mailOptions, function(error, info){
        if(error) console.log(error);
    })
}

server.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});