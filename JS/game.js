//another tip id which we create while declaring variables can be directly used in javascript as variables, they refer that element only

console.log(`Welcome to Snake Run`);
//origin is top left corner of board horizontal axis- x, vertical axis-y

//Game Constants, and Variables
let inputDirection= {x:0, y:0};  //x-axis; horizontal(columns)  y-axis; vertical(rows)
const foodSound= new Audio("./music/food.mp3");
const gameOverSound= new Audio("./music/gameover.mp3");
const moveSound= new Audio("./music/move.mp3");
const music= new Audio("./music/music.mp3");
let lastPrintTime=0;
let speed=16;  //by altering this variable we can change the fps of game
let score=0;
let snakeArray=[{x:15,y:15}];  //array of objects, entering initial position of snake
let foodObject={x:5,y:7};  //creating it as object as it is only a particle but snake has many particles so it is array of object

let hiscorevalue;
let hiscore= localStorage.getItem("hiscore");  //searching localstorage for hiscore
if(hiscore === null){
    hiscorevalue=0;
    localStorage.setItem("hiscore",JSON.stringify(hiscorevalue)); //converting number to string
}
else{ 
    hiscorevalue = JSON.parse(hiscore); //recieving as number as parse convert string to element
    document.getElementById("hiscore").innerHTML= "Hi-Score: " +hiscore; 
}


//Game Functions
function main(currentTime){
    window.requestAnimationFrame(main); //by this command we created a game loop, without using set interval, we use recursion
    //condition to slow down fps as, normally in this condition it would be very tough to play the game, try printing currentime and see how fast frame changes normally
    if((currentTime-lastPrintTime)/1000 < 1/speed){ return; } //condition for skipping particular frame(not rendering), divide by 1000 because time in milliseconds
    lastPrintTime=currentTime;  //updating lastPrintTime
    gameEngine();  //calling function
}


function isCollide(array){
    //snake can collide with the walls and with its body
    for(let i=1; i<array.length; i++){ //not including head in this loop
        if(array[i].x === array[0].x && array[i].y === array[0].y){ return true; } //if head collide with body
    }
    if(array[0].x >=25 || array[0].x <=0 || array[0].y >=25 || array[0].y <=0){ return true; } //if head collide with walls
}


function gameEngine(){  //we are dividing this funct in two parts
//part 1; updating the snake array and food

    if(isCollide(snakeArray)){  //calling function and checking its value for collision (Collision logic)
        gameOverSound.play();
        music.pause();
        inputDirection={x:0, y:0}; //back to initial position
        alert("GAME OVER!!! Close alert to try again.")
        snakeArray=[{x:15,y:15}];  //back to initial position
        music.play();
        score=0; //initializing score
        document.getElementById("score").innerHTML= `Score: ${score}`;
    }

    //if food is eaten, incrementing score, and regenrating food
    if(snakeArray[0].y === foodObject.y && snakeArray[0].x === foodObject.x){   //(Eating logic)
        foodSound.play();  score+=1;
        document.getElementById("score").innerHTML= `Score: ${score}`;
        if(score>hiscorevalue){  //setting hiscore
            hiscorevalue=score;
            localStorage.setItem("hiscore",JSON.stringify(hiscorevalue));
            document.getElementById("hiscore").innerHTML= "Hi-Score: " + hiscorevalue;
        }
        //The unshift() method adds new elements to the beginning of an array.
        snakeArray.unshift({ x:(snakeArray[0].x+inputDirection.x), y:(snakeArray[0].y+inputDirection.y) });
        let a=2, b=23;  //as our grid size is between 0-25
        //generating food at random places on board, below logic genrates a random no. between a and b; Math.round(a+(b-a)*Math.random())
        foodObject={x:Math.round(a + (b-a)* Math.random()), y:Math.round(a + (b-a)* Math.random())}; 
    }

    //moving the snake, every particle of snake body will reach at position of particle ahead it, and head will move 1 position forward
    //traversing array from second last particle till head
    for(let i=snakeArray.length-2; i>=0; i--){
        //moving at place of particle ahead it, for which we are destructuring objects(it is a new structure with only arr[i])
        snakeArray[i+1] = {...snakeArray[i]};
    }
    snakeArray[0].x += inputDirection.x;  //position of head
    snakeArray[0].y += inputDirection.y;


//part 2; displaying; render the snake and food

    //displaying the snake
    document.getElementById("board").innerHTML="";  //emptying board before starting displaying( if not done multiple display can occur)
    snakeArray.forEach((e,index)=>{  //traversing for all the objects of array
        snakeElement=document.createElement("div"); //creating a div
        snakeElement.style.gridRowStart= e.y;   //defining position of snake
        snakeElement.style.gridColumnStart= e.x;
        if(index==0){ snakeElement.classList.add("snake-head"); }  //adding class snake-head only for first position
        else{ snakeElement.classList.add("snake-body"); }  //adding class snake-body
        document.getElementById("board").appendChild(snakeElement);
    });

    //displaying the food
    foodElement=document.createElement("div"); //creating a div
    foodElement.style.gridRowStart= foodObject.y;   //defining position of snake
    foodElement.style.gridColumnStart= foodObject.x;
    foodElement.classList.add("food");  //adding class food
    document.getElementById("board").appendChild(foodElement);
}



//Main Logic
//as we are going to change animations continuosly so instead of using set interval, we should use window's requestAnimationFrame
//which is function which we will use to create game loop, its first argument is a function which forwards its a time stamp
//main advantage of using requestAnimationFrame over set interaval is frames doesn't drops using it, and there is no lag
//between animations, requestAnimationFrame returns max FPS
music.play();  //on starting game playing music
window.requestAnimationFrame(main);
window.addEventListener("keydown", e=>{  //anykey pressed on keyboard
    moveSound.play(); //playing move sound
    switch(e.key){
        case "ArrowUp":
            inputDirection.x=0;
            inputDirection.y=-1;
            break;
        case "ArrowDown":
            inputDirection.x=0;
            inputDirection.y=1;
            break;
        case "ArrowLeft":
            inputDirection.x=-1;
            inputDirection.y=0;
            break;
        case "ArrowRight":
            inputDirection.x=1;
            inputDirection.y=0;
            break;
        case "w":
            inputDirection.x=0;
            inputDirection.y=-1;
            break;
        case "s":
            inputDirection.x=0;
            inputDirection.y=1;
            break;
        case "a":
            inputDirection.x=-1;
            inputDirection.y=0;
            break;
        case "d":
            inputDirection.x=1;
            inputDirection.y=0;
            break;
        default:
            break;
    }
});

//adding logic for ondisplay buttons visible for mobile/tablets
document.getElementById("up").addEventListener("click", ()=>{
    inputDirection.x=0;
    inputDirection.y=-1;
});
document.getElementById("left").addEventListener("click", ()=>{
    inputDirection.x=-1;
    inputDirection.y=0;
});
document.getElementById("right").addEventListener("click", ()=>{
    inputDirection.x=1;
    inputDirection.y=0;
});
document.getElementById("down").addEventListener("click", ()=>{
    inputDirection.x=0;
    inputDirection.y=1;
});