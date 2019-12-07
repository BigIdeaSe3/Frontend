var stompClient;

var game;

function connect() {
    var socket = new SockJS('http://localhost:9000/DrawSomething')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        stompClient.subscribe('/topic/lobbies', function(message) {
            var msg = JSON.parse(message.body)
            gameId = msg.message;
            if(msg.type == "CREATE") {
                stompClient.subscribe('/topic/game/'+gameId, function(message) {
                    var msg = JSON.parse(message.body)
                    if(msg.type == "STARTDRAWING") {
                        context.beginPath();
                        context.moveTo(msg.message.locX,msg.message.locY)
                    }  else if(msg.type == "DRAW") {
                        context.lineTo(msg.message.locX,msg.message.locY)
                        context.stroke();
                    } else if(msg.type == "STOPDRAWING") {
                        context.closePath();
                    } else if(msg.type == "CHANGECOLOR") {
                        context.strokeStyle = msg.message;
                    } else if(msg.type == "CLEAR") {
                        context.clearRect(0, 0, canvas.width, canvas.height)
                    } else if(msg.type == "SETTHICKNESS") {
                        context.lineWidth = msg.message;
                    }
                })
            }
        })

        stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CREATE','message':'Joris'}))




        // stompClient.send('/app/lobbies',{},JSON.stringify({'type':'CONNECT','message':''}))

    })
}

function subscribeToGame(id) {
    game = stompClient.subscribe('/topic/game/'+id, function(msg) {
        var message = JSON.parse(msg.content);
    })
}

function unsubscribeToGame(id) {
    game.unsubscribe()
}

function startDrawing(x,y) {
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':'STARTDRAWING','message':{'locX':x,'locY':y}}))
}


function stopDrawing() {
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':'STOPDRAWING','message':'STOP'}))
}

function draw(x,y) {
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':"DRAW",'message':{'locX':x,'locY':y}}))
}

function sendColor(stroke) {
    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"CHANGECOLOR", 'message':stroke}))
}

function clearBoard() {
    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"CLEAR", 'message':''}))    
}

function setThickness(thickness) {
    stompClient.send("/app/game/"+gameId,{}, JSON.stringify({'type':"SETTHICKNESS", 'message':thickness}))    
}