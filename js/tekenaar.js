var subject, gameId;
var mouseclicked = false

function getSubject() {
    var url = new URL(window.location)
    subject = url.searchParams.get("subject")
    gameId = url.searchParams.get("id")

    sendSubjectToServer(subject);
}

function sendSubjectToServer(subject) {
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
        stompClient.send("/app/game/"+gameId, {}, JSON.stringify({'type':"SETSUBJECT",'message':subject}));
    })
}

$(function() {
$("#drawCanvas").mousedown(function(e) {
    var x = e.pageX
    var y = e.pageY

    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':'STARTDRAWING','message':{'locX':x,'locY':y}}))

    mouseclicked = true
})

$("#drawCanvas").mouseup(function(e) {
    mouseclicked = false
    stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':'STOPDRAWING','message':'STOP'}))
})

$("#drawCanvas").mousemove(function(e) {
    if (mouseclicked === true) {
        var x = e.pageX
        var y = e.pageY
        stompClient.send("/app/game/"+gameId,{},JSON.stringify({'type':"DRAW",'message':{'locX':x,'locY':y}}))

    }
})

})
