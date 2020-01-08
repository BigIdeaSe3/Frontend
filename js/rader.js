var gameId;

function connectToDrawer() {
    getId()
    
    var socket = new SockJS('http://localhost:9000/DrawSomething')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        
        var canvas = $("#drawCanvas")[0]
        var context = canvas.getContext("2d")
        var gameConn = stompClient.subscribe("/topic/game/"+gameId, function(message) { 
            var msg = JSON.parse(message.body)
            if(msg.type == "STARTDRAWING") {
                context.beginPath();
                context.moveTo(msg.message.locX,msg.message.locY)
            }  else if(msg.type == "DRAW") {
                context.lineTo(msg.message.locX,msg.message.locY)
                context.stroke();
            } else if(msg.type == "STOPDRAWING") {
                context.closePath();
            }
        })
    })
}

function getId() {
    var url = new URL(window.location)
    gameId = url.searchParams.get("id")
}