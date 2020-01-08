var gameId;
var stompClient;

function getLobbyId() {
    var url = new URL(window.location)
    gameId = url.searchParams.get("id")
    console.log(gameId)

    listenToServer(gameId)
}

function listenToServer(gameId) {
    var socket = new SockJS('http://localhost:9000/DrawSomething')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        var gameConn = stompClient.subscribe("/topic/game/"+gameId, function(message) {
            var msg = JSON.parse(message.body)
            console.log(msg)
            if (msg.type == "JOIN" || msg.type == "GETALLPLAYERS") {
                addUsersToTable(msg.message)
            } else if (msg.type == "STARTGAME") {
                gameConn.unsubscribe()
                if (msg.message.username == name) {
                    location.href = "kiesWoord.html?id="+gameId;
                } else {
                    location.href = "rader.html?id="+gameId;
                }
            }
        })
        getAllUsers();

    })
}

function getAllUsers() {
    stompClient.send("/app/game/"+gameId, {}, JSON.stringify({'type':"GETALLPLAYERS",'message':""}));
}

function addUsersToTable(users) {
    var table = document.getElementById('users');

    $("#users").find("tr:not(:first)").remove();

    for (let i = 0; i < users.length; i++) {
        const element = users[i];
        
        console.log(users)
        
        var row = table.insertRow(1);
        row.insertCell(0)
        var cUser = row.insertCell(1)

        cUser.innerHTML = element.username;
    }
}

function startGame() {
    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"STARTGAME","message":name}))
}