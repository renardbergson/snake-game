// canvas selecting and getting context variables
const $canvas = document.querySelector('.stage')
const ctx = $canvas.getContext('2d')

//speed game variable
let speedGame = 5

// tile settings variables
let tileCount = 20
let tileSize = $canvas.width / tileCount        

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
let tailLength = 2

// score variables
let $score = document.querySelector('.scoreWrapper span')
let scoreCounter = 0

// game sound variables
const clickSound = new Audio('audio/clickSound.mp3')
const gulpSound = new Audio('audio/gulpSound.mp3')
const gameOverSound = new Audio('audio/gameOverSound.mp3')

// snake head src controller variable
let snakeHeadSrc = 'img/snake-head-up.png'

// control buttons variables
const $startBtn = document.querySelector('.startBtn')
const $upBtn = document.querySelector('.upBtn')
const $leftBtn = document.querySelector('.leftBtn')
const $rightBtn = document.querySelector('.rightBtn')
const $downBtn = document.querySelector('.downBtn')
const $checkbox = document.querySelector('.checkbox')

// orientation utilities in landscape mode
const orientationGif = new Image(300, 300)
const $container = document.querySelector('.container')
orientationGif.src = 'img/rotate-phone.gif'
$container.appendChild(orientationGif)
orientationGif.style.display = 'none'

// welcome function
document.body.onload = () => {    
    window.addEventListener('resize', () => {
        const $workSpace = document.querySelector('.workSpace')
        const $controls = document.querySelector('.controls')

        
        if (window.innerHeight <= 600) {
            $workSpace.style.display = 'none'
            $controls.style.display = 'none'
            orientationGif.style.display = 'block'
        } else if (window.innerHeight > 600) {
            $workSpace.style.display = 'block'
            $controls.style.display = 'flex'
            orientationGif.style.display = 'none'
        }

        if (window.innerWidth > 768) {
            $controls.style.display = 'none'
        }
    }) 


    if (sessionStorage.getItem('snakeGame')) {
        drawGame()
        return
    } 
    
    const $welcome = document.querySelector('.welcome')
    $welcome.classList.add('visible')

    document.addEventListener('keydown', function spaceToStart (e) {
        if (e.key === ' ') {
            drawGame()
            $welcome.classList.remove('visible')
            document.removeEventListener('keydown', spaceToStart)
        }
    })

    $startBtn.addEventListener('click', function pressToStart () {
        drawGame()
        $welcome.classList.remove('visible')
        $startBtn.removeEventListener('click', pressToStart)
    })
}

// draw game loop                                    
function drawGame () {    
    changeSnakePosition()   // having this function firstly makes the game over conditions be satisfied instantly
    
    document.addEventListener('keydown', keyDown)
    pressBtn()
    
    let result = isGameOver()
    if (result === true) {
        document.removeEventListener('keydown', keyDown) // if it's game over, we stop listening the those keys
        
        gameOverSound.play()
        
        document.onkeydown = (event) => {
            if (event.key === ' ') {
                sessionStorage.setItem('snakeGame', 'alreadyOpened') 
                location.reload() // this method reloads the document
            }
        }

        $startBtn.onclick = () => {
            sessionStorage.setItem('snakeGame', 'alreadyOpened')
            location.reload()
        }

        return  // this is gonna stop the draw game loop and no longer execute the other functions
    }

    screenUpdate()   
    checkAppleCollision()
    drawApple()             // the order of the functions modifies the game !!!
    drawSnake()          
    
    setTimeout(drawGame, 1000 / speedGame)
}

// game over conditions function
function isGameOver() {
    let gameOver = false

    // if the game hasn't started
    if (xMovement === 0 && yMovement === 0) {
        gameOver = false
        return 
    }

    // walls colision
    if (xPosition < 0) {
        gameOver = true
    } else if (xPosition === tileCount) {
        gameOver = true
    } else if (yPosition < 0) {
        gameOver = true
    } else if (yPosition === tileCount) {
        gameOver = true
    }

    // body colision
     for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        if (part._x === xPosition && part._y === yPosition) {
            gameOver = true
            break
        }
    } 

    // game over text
    if (gameOver === true) {
        const $gameOver = document.querySelector('.gameOver')
        $gameOver.classList.add('visible')

        const $pressSpace = document.querySelector('.pressSpace')
        $pressSpace.classList.add('visible')
    }
    
    return gameOver
}

// screen update function
function screenUpdate () {
    const background = new Image()
    background.src = 'img/grass.png'
    ctx.drawImage(background, 0, 0)
}

// draw snake function
function drawSnake () {
    // ******************************************** BODY ********************************************
    const snakeBody = new Image()
    snakeBody.src = 'img/snakeBody.png'
    
    for(let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i]
        ctx.drawImage(snakeBody, part._x * tileCount, part._y * tileCount, tileSize, tileSize)
    }            
    
    snakeParts.push(new snakePart(xPosition, yPosition))
    
    if (snakeParts.length > tailLength) { 
        snakeParts.shift()                
    }                                     

    // ******************************************** HEAD ********************************************
    const snakeHead = new Image()
    snakeHead.src = snakeHeadSrc
    ctx.drawImage(snakeHead, xPosition * tileCount, yPosition * tileCount, tileSize, tileSize)
}

// draw Apple function
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

// check apple collision function
function checkAppleCollision () {
    if (appleX === xPosition && appleY === yPosition) {
        appleX = parseInt(Math.random() * tileCount)
        appleY = parseInt(Math.random() * tileCount)
        tailLength++
        speedGame += 0.2
        scoreCounter++
        $score.innerText = scoreCounter 
        gulpSound.play()
    }
}

// keyDown listeners function
function keyDown (event) {
    // console.log(xMovement, yMovement)  *** (to check and remove eventual bugs) ***

    // Up
    if (event.key === 'ArrowUp' || event.key === 'w') {
        if (yMovement === 1) // here, we're talking about what happens when we press the arrow down key 
            return           // so, if we're moving down (Y = 1), don't read this block of code
        
        yMovement = -1 // the Y angle has value zero in the center and decreases when goind up
        xMovement = 0 // we wanna do nothing with X angle when pressing arrow up key 
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-up.png'              // snake head controller
    }
    
    // Down
    if (event.key === 'ArrowDown' || event.key === 's') {
        if (yMovement === -1) // if we're moving up (Y = -1), don't read this block of code
            return
            
        yMovement = 1 
        xMovement = 0 
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-down.png'            // snake head controller
    }

    // Left
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        if (xMovement === 1) // if we're moving right (X = 1), don't read this block of code
            return

        yMovement = 0
        xMovement = -1
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-left.png'            // snake head controller
    }

    // Right
    if (event.key === 'ArrowRight' || event.key === 'd') {
        if (xMovement === -1) // if we're moving left (X = -1), don't read this block of code
            return

        yMovement = 0
        xMovement = 1
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-right.png'           // snake head controller
    }
}

// direction buttons function
function pressBtn () {
    // up
    $upBtn.onclick = () => {
        if (yMovement === 1) 
        return 

        yMovement = -1
        xMovement = 0
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-up.png'             
    }

    // down
    $downBtn.onclick = () => {
        if (yMovement === -1) 
        return

        yMovement = 1 
        xMovement = 0 
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-down.png'           
    }

    // left
    $leftBtn.onclick = () => {
        if (xMovement === 1) 
        return

        yMovement = 0
        xMovement = -1
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-left.png'         
    }

    // right
    $rightBtn.onclick = () => {
        if (xMovement === -1) 
        return

        yMovement = 0
        xMovement = 1
        clickSound.play()
        snakeHeadSrc = 'img/snake-head-right.png'           
    }
}

// tablet side control function
$checkbox.onchange = () => {
    const $controls = document.querySelector('.controls')

    // tablets and iPads
    if (window.screen.width < 769 && $checkbox.checked === true) {
        $controls.style.transform = "translate(7em,0)"
    } else if (window.screen.width < 769 && $checkbox.checked === false) {
        $controls.style.transform = "translate(-7em,0)"
    }

    // galaxy zFold opened
    if (window.screen.width < 513 && $checkbox.checked === true) {
        $controls.style.transform = "translate(5.5em,0)"
    } else if (window.screen.width < 513 && $checkbox.checked === false) {
        $controls.style.transform = "translate(-5.5em,0)"
    }
}