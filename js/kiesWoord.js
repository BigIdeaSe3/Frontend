var gameId, gameConn;
function getWords(){
    getId();

    var socket = new SockJS('http://localhost:9000/DrawSomething')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        gameConn = stompClient.subscribe("/topic/game/"+gameId, function(message) { 
            var msg = JSON.parse(message.body)
            if(msg.type == "GETSUBJECTS") {
                var div = document.getElementById("container")
                for (let i = 0; i < msg.message.length; i++) {
                    const element = msg.message[i];
                    var btn = document.createElement('button')
                    btn.innerHTML = element.onderwerp;
                    btn.onclick = (function(element) {return function() {choose(element.onderwerp);}})(element);

                    div.append(btn)
                }
            }
        })
        stompClient.send("/app/game/"+gameId, {}, JSON.stringify({'type':"GETSUBJECTS",'message':""}));
    })
}

function getId() {
    var url = new URL(window.location)
    gameId = url.searchParams.get("id")
}

function choose(word) {
    //stompClient.send("/app/game/"+gameId, {}, JSON.stringify({'type':"SETSUBJECT",'message':word}));
    gameConn.unsubscribe()
    location.href = "tekenaar.html?subject=" + word + "&id=" + gameId;
}