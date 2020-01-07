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
        stompClient.subscribe("/topic/game/"+gameId, function(message) {
            var msg = JSON.parse(message.body)
            console.log(msg)
            if (msg.type == "JOIN" || msg.type == "GETALLPLAYERS") {
                addUsersToTable(msg.message)
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

    for (let i = users.length-1; i >= 0; i--) {
        const element = users[i];

        console.log(users[i])
        
        var row = table.insertRow(1);
        row.insertCell(0)
        var cUser = row.insertCell(1)

        cUser.innerHTML = element.username;
    }
}

function startGame()