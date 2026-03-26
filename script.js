const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start')
const modal = document.querySelector('.modal')
const startGameModal = document.querySelector('.start-game')
const gameOverModal = document.querySelector('.game-over')
const restartButton = document.querySelector('.btn-restart')

const highScoreElement = document.querySelector('#high-score')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector("#time")

const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0      // it means if highscore is undefined, print 0
let score = 0
let time = `00-00`

highScoreElement.innerText = highScore

const cols = Math.floor(board.clientWidth / blockWidth);  // this gives us the whole number value of block in column
const rows = Math.floor(board.clientHeight / blockHeight); // this gives us the whole number value of blocks in row
let intervalId = null
let timerIntervalId = null

let food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)} //randomly generates the food in grid

const blocks = []    // created an array named 'blocks'

let snake = [ {x: 1, y: 3}]     // snake will be an array of 3 objects (with coordinates)

let direction = 'right'

// for(let i=0; i<rows*cols; i++){
//     const block = document.createElement('div');   //it will create a div named 'block' 
//     block.classList.add("block")             // this adds a classname to every div, here the classname is 'block'
//     board.appendChild(block);       // it will appends a new div inside the board element

// }


for(let row=0; row<rows; row++){                  // ab ye dono loop equal numbers of time chalenge
    for(let col=0; col<cols; col++){
            const block = document.createElement('div');   //it will create a div named 'block' 
    block.classList.add("block")             // this adds a classname to every div, here the classname is 'block'
    board.appendChild(block);       // it will appends a new div inside the board element
    blocks[ `${row}-${col}` ] = block      // all the blocks created are inside that array.....it is a copy of 2d array created in js
    }
}

function render(){

    let head = null

    blocks[ `${food.x}-${food.y}` ].classList.add("food")

    // to move the snake
    if(direction === 'left'){
        head = { x: snake[0].x, y: snake[0].y - 1}
    }else if(direction === 'right'){
        head = { x: snake[0].x, y: snake[0].y + 1}
    }else if(direction === 'down'){
        head = { x: snake[0].x + 1, y: snake[0].y}
    }else if(direction === 'up'){
        head = { x: snake[0].x - 1, y: snake[0].y}
    }


    // wall collision logic 
    if(head.x < 0 || head.x >=rows || head.y <0 || head.y >=cols ){
        clearInterval(intervalId)             // clearInterval will close the interval which was running
        modal.style.display = "flex"
        startGameModal.style.display = "none"              // after game over....game over modal will appear
        gameOverModal.style.display = "flex"
        return;
    }


    // food consume logic
    if(head.x==food.x && head.y==food.y){
        blocks[ `${food.x}-${food.y}` ].classList.remove("food")
        food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)}
        blocks[ `${food.x}-${food.y}` ].classList.add("food")

        snake.unshift(head)  
        
        score += 10
        scoreElement.innerText = score

        if(score>highScore){
            highScore = score 
            localStorage.setItem("highScore", highScore.toString())
        }
    }

    
    // remove the blocks from behind when the snake moves
    snake.forEach(segment => {
        blocks[ `${segment.x}-${segment.y}` ].classList.remove("fill")
    })


    snake.unshift(head)             //.unshift adds an element in the starting of an array
    snake.pop()                     //.pop removes an element from end of an array


    snake.forEach(segment => {
            blocks[ `${segment.x}-${segment.y}` ].classList.add("fill")     
    })
}

// setInterval will call the function after every given time....here after every 300ms render function will be called

// intervalId = setInterval(() => {    
    
    
    

//     render()
// }, 300)



// now when we click on the start button, the game will start, we added the render button in setInterval
startButton.addEventListener("click", ()=>{
    modal.style.display = "none"
    intervalId = setInterval(()=>{
        render()
    }, 200)

    timerIntervalId = setInterval(()=>{
        let [min, sec] = time.split("-").map(Number)

        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }
        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
})

restartButton.addEventListener("click", restartGame)

function restartGame () {

    blocks[ `${food.x}-${food.y}` ].classList.remove("food")
     snake.forEach(segment => {
        blocks[ `${segment.x}-${segment.y}` ].classList.remove("fill")
    })


    score = 0
    time = `00-00`

    scoreElement.innerText = score
    timeElement.innerText = time
    highScoreElement.innerText = highScore
    

    modal.style.display = "none"
    direction = 'down'
    snake = [ {x: 1, y: 3} ]
    food = {x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)} 
    intervalId = setInterval(()=>{
        render()
    }, 300)

    //time logic
    timerIntervalId = setInterval(()=>{
        let [min, sec] = time.split("-").map(Number)

        if(sec==59){
            min+=1
            sec=0
        }else{
            sec+=1
        }
        time = `${min}-${sec}`
        timeElement.innerText = time
    }, 1000)
}

document.addEventListener("keydown", (event) => {

console.log(event.key)
    if(event.key=="ArrowUp"){
        direction='up'
    }else if(event.key=="ArrowDown"){
        direction='down'
    }else if(event.key=="ArrowRight"){
        direction='right'
    }else if(event.key=="ArrowLeft"){
        direction='left'
    }
})