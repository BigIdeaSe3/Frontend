// var canvas = $("#drawCanvas")[0]
// var context = canvas.getContext("2d")
// context.strokeStyle = "#FF0000"

var name = "";

function setColor(params) {
    sendColor(params)

    var canvas = $("#drawCanvas")[0]
    var context = canvas.getContext("2d")

    context.strokeStyle = params
}

function clearCanvas() {
    var canvas = $("#drawCanvas")[0]
    var context = canvas.getContext("2d")

    clearBoard();
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function changeThickness(params) {
    setThickness(params)
    var canvas = $("#drawCanvas")[0]
var context = canvas.getContext("2d")
    context.lineWidth = params
}

function guessSubject() {
    sendGuess(document.getElementById("guess").value);
}



$(function() {
    var mouseclicked = false

    $("#drawCanvas").mousedown(function(e) {
        var x = e.pageX
        var y = e.pageY

        startDrawing(x,y)

        mouseclicked = true
    })

    $("#drawCanvas").mouseup(function(e) {
        mouseclicked = false
        stopDrawing()
    })

    $("#drawCanvas").mousemove(function(e) {
        if (mouseclicked === true) {
            var x = e.pageX
            var y = e.pageY

            draw(x,y)
        }
    })
})