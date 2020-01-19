var gameId;
var stompClient;



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
            } else if(msg.type == "GUESS") {
                if(msg.message === true) {
                    alert("You guessed correctly")
                } else {
                    alert("You guessed incorrect, please try again")
                }
            } else if(msg.type == "CHANGECOLOR") {
                context.strokeStyle = msg.message.kleur;
            } else if(msg.type == "CLEAR") {
                context.clearRect(0, 0, canvas.width, canvas.height)
            } else if(msg.type == "SETTHICKNESS") {
                context.lineWidth = msg.message.dikte;
            }
        })
    })
}

function getId() {
    var url = new URL(window.location)
    gameId = url.searchParams.get("id")
}

function guessSubject() {

    
    var onderwerp = document.getElementById("guess").value;
    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"GUESS",'message':{'onderwerp':onderwerp}}))
}

$('#guessForm').submit(function () {
    guessSubject();
    return false;
   });