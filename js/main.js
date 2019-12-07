var canvas = $("#drawCanvas")[0]
var context = canvas.getContext("2d")
context.strokeStyle = "#FF0000"

function setColor(params) {
    sendColor(params)

    context.strokeStyle = params
}

function clearCanvas() {
    clearBoard();
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function changeThickness(params) {
    setThickness(params)
    context.lineWidth = params
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