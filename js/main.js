// getting canva and it's context
const $canvas = document.querySelector('.stage')
const ctx = $canvas.getContext('2d')

//speed game
let speedGame = 5

// tile settings
let tileCount = 20
let tileSize = $canvas.width / tileCount            

// snake head
let snakeHeadX = 10                                                
let snakeHeadY = 10                                

// draw game loop                                    
function drawGame () {
    //console.log('teste')
    setTimeout(drawGame, 1000 / speedGame)         

    drawSnake()
}

// draw snake
function drawSnake () {
    ctx.fillStyle = 'black'                         
    ctx.fillRect(snakeHeadX * tileCount, snakeHeadY * tileCount, tileSize, tileSize)                                        
}

drawGame()