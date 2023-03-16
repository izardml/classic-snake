var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')
var scoreIs = document.getElementById('score')
var direction = ''
var directionQueue = ''
var fps = 70
var snake = []
var snakeLength = 5
var cellSize = 32
var snakeColor = '#3498db'
var foodColor = '#ff3636'
var foodX = []
var foodY = []
var food = {
    x: 0,
    y: 0
}
var score = 0

for(i = cellSize; i <= canvas.width - cellSize; i += cellSize) {
    foodX.push(i)
}

for(i = cellSize; i <= canvas.height - cellSize * 2; i += cellSize) {
    foodY.push(i)
}

canvas.setAttribute('tabindex', 1)
canvas.style.outline = 'none'
canvas.focus()

function drawSquare(x,y,color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, cellSize, cellSize)
}

function createFood() { 
    food.x = foodX[Math.floor(Math.random() * foodX.length)]
    food.y = foodY[Math.floor(Math.random() * foodY.length)]

    for(i = 0; i < snake.length; i++) {
        if(checkCollision(food.x, food.y, snake[i].x, snake[i].y)) {
            createFood()
        }
    }
}

function drawFood() {
    drawSquare(food.x, food.y, foodColor)
    console.log('x: ' + food.x + ' y: ' + food.y)
}

function setBackground(color1, color2) {
    ctx.fillStyle = color1
    ctx.strokeStyle = color2

    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for(var x = 0.5; x < canvas.width; x += cellSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
    }

    for(var y = 0.5; y < canvas.height; y += cellSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
    }

    ctx.stroke()
}

function createSnake() {
    snake = [];
    for(var i = snakeLength; i > 0; i--) {
        k = i * cellSize
        snake.push({x: k, y:cellSize})
    }
}

function drawSnake() {
    for(i = 0; i < snake.length; i++) {
        drawSquare(snake[i].x, snake[i].y, snakeColor)
    }
}

function changeDirection(keycode) {
    if(keycode == 37 && direction != 'right') {
        directionQueue = 'left'
    } else if(keycode == 38 && direction != 'down') {
        directionQueue = 'up'
    } else if(keycode == 39 && direction != 'left') {
        directionQueue = 'right'
    } else if(keycode == 40 && direction != 'top') {
        directionQueue = 'down'
    }
}

function moveSnake() {
    var x = snake[0].x
    var y = snake[0].y

    direction = directionQueue

    if(direction == 'right') {
        x+=cellSize
    } else if(direction == 'left') {
        x-=cellSize
    } else if(direction == 'up') {
        y-=cellSize;
    } else if(direction == 'down') {
        y+=cellSize;
    }
    
    var tail = snake.pop()
    tail.x = x
    tail.y = y
    snake.unshift(tail)
}

function checkCollision(x1,y1,x2,y2) {
    if(x1 == x2 && y1 == y2) {
        return true
    } else {
        return false
    }
}

function game(){
    var head = snake[0]
    if(head.x < 0 || head.x > canvas.width - cellSize  || head.y < 0 || head.y > canvas.height - cellSize) {
        setBackground()
        createSnake()
        drawSnake()
        createFood()
        drawFood()
        directionQueue = 'right'
        score = 0
    }

    for(i = 1; i < snake.length; i++) {
        if(head.x == snake[i].x && head.y == snake[i].y) {
            setBackground()
            createSnake()
            drawSnake()
            createFood()
            drawFood()
            directionQueue = 'right'
            score = 0
        }
    }
    
    if(checkCollision(head.x, head.y, food.x, food.y)) {
        snake[snake.length] = {
            x: head.x,
            y: head.y
        }
        createFood()
        drawFood()
        score += 10
    }

    canvas.onkeydown = function(evt) {
        evt = evt || window.event
        changeDirection(evt.keyCode)
    };

    ctx.beginPath()
    setBackground('greenyellow', 'transparent')
    scoreIs.innerHTML = score
    drawSnake()
    drawFood()
    moveSnake()
}

function newGame() {
    direction = 'right'
    directionQueue = 'right'
    ctx.beginPath()
    createSnake()
    createFood()

    if(typeof loop != 'undefined') {
        clearInterval(loop)  
    } else {
        loop = setInterval(game, fps)
    }
}

// newGame()