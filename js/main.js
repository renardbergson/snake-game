// getting canva and it's context
const $canvas = document.querySelector('.stage')
const ctx = $canvas.getContext('2d')

//speed game
let speedGame = 4

// tile settings
let tileCount = 20
let tileSize = $canvas.width / tileCount - 2 // the subtraction separates the tiles from each other           

// snake head and movement
let xPosition = 10                                                
let yPosition = 10            

let xMovement = 0
let yMovement = 0

// draw game loop                                    
function drawGame () {
    //console.log('teste')
    setTimeout(drawGame, 1000 / speedGame)
    screenUpdate()         
    drawSnake()             // ordering the elements correctly is important
    changeSnakePosition()
}

// screen update function
function screenUpdate () {
    const background = new Image()
    background.src = '../img/grass.png'
    ctx.drawImage(background, 0, 0) // this function avoids the snake path remains on the screen 
}

// draw snake
function drawSnake () {
    ctx.fillStyle = 'black'                         
    ctx.fillRect(xPosition * tileCount, yPosition * tileCount, tileSize, tileSize)                                        
}

// keyDown listener and functions
document.body.addEventListener('keydown', keyDown)
function keyDown (event) {
    // arrowUp
    if (event.keyCode === 38) {
        yMovement = -1 // because the Y angle has value zero in the center and decreases when goind up
        xMovement = 0 // because we wanna do nothing with X angle when pressing arrow up key 
    }
}

// change snake position function
function changeSnakePosition () {
    xPosition += xMovement
    yPosition += yMovement
}

drawGame()