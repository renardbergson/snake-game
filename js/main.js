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
    drawSnake()
    changeSnakePosition()
}

// draw snake
function drawSnake () {
    ctx.fillStyle = 'black'                         
    ctx.fillRect(xPosition * tileCount, yPosition * tileCount, tileSize, tileSize)                                        
}

//keyDown listener and function
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