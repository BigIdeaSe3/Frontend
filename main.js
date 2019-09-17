var canvas = $("#drawCanvas")[0]
var context = canvas.getContext("2d")
context.strokeStyle = "#FF0000"

function setColor(params) {
    context.strokeStyle = params
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height)
}

function changeThickness(params) {
    context.lineWidth = params
}

$(function() {
    var mouseclicked = false

    $("#drawCanvas").mousedown(function(e) {
        var x = e.pageX
        var y = e.pageY

        sendStart(x,y)

        mouseclicked = true
    })

    $("#drawCanvas").mouseup(function(e) {
        mouseclicked = false
        sendStop()
    })

    $("#drawCanvas").mousemove(function(e) {
        if (mouseclicked === true) {
            var x = e.pageX
            var y = e.pageY

            sendLocation(x,y)
        }
    })
})