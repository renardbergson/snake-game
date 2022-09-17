// getting canva and it's context
const $canvas = document.querySelector('.stage')
const ctx = $canvas.getContext('2d')

//speed game
let speedGame = 5

// tile settings
let tileCount = 20
let tileSize = $canvas.width / tileCount - 2 // the subtraction separates the tiles from each other           

// snake position and movement variables
let xPosition = 10                                                
let yPosition = 10            

let xMovement = 0
let yMovement = 0

// apple position variables
let appleX = 5
let appleY = 5

// snake body constructor 
class snakePart {
    constructor(xPosition, yPosition) {
        this._x = xPosition
        this._y = yPosition
    }
}

// snake body variables
let snakeParts = []
let tailLength = 1

// score 
let $score = document.querySelector('.scoreWrapper span')
let scoreCounter = 1


// draw game loop                                    
function drawGame () {
    setTimeout(drawGame, 1000 / speedGame)
    screenUpdate()   
    drawApple()      
    drawSnake()             // ordering the elements correctly is important
    changeSnakePosition()
    checkAppleCollision()
}

// screen update function
function screenUpdate () {
    const background = new Image()
    background.src = 'img/grass.png'
    ctx.drawImage(background, 0, 0) // this function avoids the snake path remains on the screen 
}

// draw snake
function drawSnake () {
    // ******************************************** BODY ********************************************
    ctx.fillStyle = 'orange'
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.fillRect(part._x * tileCount, part._y * tileCount, tileSize, tileSize)
    }            
    
    snakeParts.push(new snakePart(xPosition, yPosition)) // the push function adds an element into an array
    
    if (snakeParts.length > tailLength) { // the shift function removes the furtherst item from the array,
        snakeParts.shift()                // if it has more items than our tailLenght variable
    }                                     // the last part added is always the nearest of the snake head! 

    // ******************************************** HEAD ********************************************
    ctx.fillStyle = 'black'                         
    ctx.fillRect(xPosition * tileCount, yPosition * tileCount, tileSize, tileSize)      
    // multiplying the position by the number of tiles gives us the right number of possibilities 
    // for X and Y
}

// draw Apple
function drawApple () {
    const apple = new Image()
    apple.src = 'img/apple.png'
    ctx.drawImage(apple, appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}  

// change snake position function
function changeSnakePosition () {
    xPosition += xMovement
    yPosition += yMovement
}

function checkAppleCollision () {
    if (appleX === xPosition && appleY === yPosition) {
        appleX = parseInt(Math.random() * tileCount)
        appleY = parseInt(Math.random() * tileCount)
        // math random function returns random numbers between 0 and 1
        // we use parse int function to convert those numbers to integer values 
        // then, we multiply those numbers by the number of tiles
        tailLength++
        speedGame += 0.1
        $score.innerText = scoreCounter++
    }
}

// keyDown listener and functions
document.body.addEventListener('keydown', keyDown)
function keyDown (event) {
    // Up
    if (event.keyCode === 38) {
        if (yMovement === 1) // here, we're talking about what happens when we press the arrow down key 
            return           // so, if we're moving down (Y = 1), don't read this block of code
        yMovement = -1 // the Y angle has value zero in the center and decreases when goind up
        xMovement = 0 // we wanna do nothing with X angle when pressing arrow up key 
    }
    
    // Down
    if (event.keyCode === 40) {
        if (yMovement === -1) // if we're moving up (Y = -1), don't read this block of code
            return
        yMovement = 1 
        xMovement = 0 
    }

    // Left
    if (event.keyCode === 37) {
        if (xMovement === 1) // if we're moving right (X = 1), don't read this block of code
            return
        yMovement = 0
        xMovement = -1
    }

    // Right
    if (event.keyCode === 39) {
        if (xMovement === -1) // if we're moving left (X = -1), don't read this block of code
            return
        yMovement = 0
        xMovement = 1
    }
}

drawGame()