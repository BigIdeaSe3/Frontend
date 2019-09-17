var stompClient;

function connect() {
    var socket = new SockJS('http://localhost:9000/DrawSomething')
    stompClient = Stomp.over(socket)
    stompClient.connect({}, function(frame) {
        console.log("connected: " + frame)
        stompClient.subscribe('/topic/game/1/newPoint', function(message) {
            msg = JSON.parse(message.body).message
            console.log(msg.locX)
            context.lineTo(msg.locX, msg.locY)
            context.stroke()
        })
        stompClient.subscribe('/topic/game/1/startDrawing', function(message) {
            context.beginPath()
            context.moveTo(x, y)
        })
        stompClient.subscribe('/topic/game/1/stopDrawing', function(message) {
            console.log("Stop")
            context.closePath()
        })
    })


}

//#region Subscribe

function getLocation() {
    
}

function startDrawing() {
    
}

function stopDrawing() {
    
}

//#endregion

//#region Send messages

/*function sendMessage(message) {
    stompClient.send("/app/hello", {}, JSON.stringify({ 'message': message }))
}*/

function sendStart(x,y) {
    stompClient.send("/app/game/1/startDrawing", {}, JSON.stringify({'message': {'locX':x,'locY':y}}))
}

function sendLocation(x,y) {
    stompClient.send("/app/game/1/addPoint", {}, JSON.stringify({'message': {'locX':x,'locY':y}}))
}

function sendStop() {
    stompClient.send("/app/game/1/stopDrawing", {}, JSON.stringify({ 'message': 'test' }))
}

//#endregion