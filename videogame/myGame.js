// Milton Tomasino
// Student ID: 922762734
// GitHub: MiltonTomasino


// global variables for functions
var canvas = document.getElementById("gameArea");
var car;
var score;
var carHealth;
var road1;
var road2;
var road3;
var multiObstacles = []; // array for multiple objects
var speed = 10; // speed of player car
var laneSpeed = 5; // speed of obstacles
var downPressed = false;
var upPressed = false;
var leftPressed = false;
var rightPressed = false;

// starts the game by placing players and objects onto game area and runs .start()
function startGame(){
    car = new component(30, 50, "./Images/redCar.png", 400, 500, "image", 100);
    road1 = new backGroundImage(800, 630, "./Images/road.png", 0, 0, "image");
    road2 = new backGroundImage(800, 630, "./Images/road.png", 0, -630, "image");
    road3 = new backGroundImage(800, 630, "./Images/road.png", 0, -1260, "image");
    score = new component("30px", "Consolas", "white", 10, 30, "text");
    carHealth = new component("30px", "Consolas", "#6bf53d", canvas.width - 210, canvas.height - 600, "text");
    myGameArea.start();
}

// myGameArea object containing functions related to game sequence
var myGameArea = {
    // starts game
    start : function(){
        this.canvas = canvas;
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000/60);
    },
    // clears game
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // stops game
    stop : function(){
        clearInterval(this.interval);
    }
}

// function to construct custom objects
function component(width, height, color, x, y, type, health){
    this.type = type;
    // creates an image object if the inputed object type is image and uses the file src
    if (type == "image"){
        this.image = new Image();
        this.image.src = color;
    }
    // setting dimensions, location, and potential health of object
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.health = health;
    // updates every frame during runtime of game
    this.update = function(){
        ctx = myGameArea.context;
        // if object is of type text, create a background and text for every frame
        if(this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = "black";
            ctx.fillRect(this.x - 10, this.y - 30, myGameArea.canvas.width, myGameArea.canvas.height - 580);
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else if(type == "image"){
            // draw image onto canvas every frame
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        }
    }

    // allows for WASD inputs from keyboard to change position of player car
    // speed comes from global var
    this.newPos = function(){
        if (downPressed){
            this.y += speed;
        }
        if (upPressed){
            this.y -= speed;
        }
        if (leftPressed){
            this.x -= speed;
        }
        if (rightPressed){
            this.x += speed;
        }
    }

    // checks to see if player car and object overlap, leading to a crash
    this.crashWith = function(otherobj){
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
            (mytop > otherbottom) ||
            (myright < otherleft) ||
            (myleft > otherright)) {
                crash = false;
        }
        return crash;
    }
}

// checks to see if player car exceed boundry of canvas
// if it exceeds, reset position to before boundry
function boundryCheck(obj){
    if (obj.x > myGameArea.canvas.width - (obj.width + 120)){
        obj.x = myGameArea.canvas.width - (obj.width + 120);
    }
    if (obj.x < 125){
        obj.x = 125;
    }
    if (obj.y > myGameArea.canvas.height - obj.height){
        obj.y = myGameArea.canvas.height - obj.height;
    }
    if (obj.y < 50){
        obj.y = 50;
    }

}

// allows for creating of enemy cars using inputed parameters and image file
function enemyCar(width, height, image, x, y, type){
    this.type = type;
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // draws car on canvas according to specifications
    }
}

// creates a scrolling background simulating movement
// similar to creating other objects
function backGroundImage(width, height, image, x, y){
    this.image = new Image();
    this.image.src = image;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function(){
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    // once the image scrolls out of the bounds of canvas, loops back to top to resume process
    this.newPos = function(){
        this.y += 15;
        if (this.y >= 630){
            this.y = -1260;
        }
    }
}

// updates state of the game
function updateGameArea(){
    // checks to see if an object in array index crashes into player car
    for( let i = 0; i < multiObstacles.length; i += 1){
        if (car.crashWith(multiObstacles[i])){
            // if crash true, subract 25 from health and delete enemy car it crashed with
            car.health = car.health - 25;
            multiObstacles.splice(i, 1);
            //if health reaches 0, end game and throw an alert with your score
            if (car.health == 0){
                myGameArea.stop();
                alert('You lost! Your score was ' + myGameArea.frameNo);
                return;
            }
        }
    }

    myGameArea.clear();
    // updates positions of background image
    road1.newPos();
    road1.update();
    road2.newPos();
    road2.update();
    road3.newPos();
    road3.update();
    // tracks frames in game
    myGameArea.frameNo += 1;

    // everytime framNo = 1 or every 50 milliseconds...
    if (myGameArea.frameNo == 1 || everyInterval(50)){

        // each class of car has a 1/5 chance of spawning using the random function
        // pushes spawned car with specifications into array, then onto canvas
        if ((Math.floor(Math.random() * 50)) > 0 && (Math.floor(Math.random() * 50)) <= 10){

            multiObstacles.push(new enemyCar(30, 50, "./Images/pinkCar.png", 200, 0, "pinkCar"));

        }else if((Math.floor(Math.random() * 50)) > 10 && (Math.floor(Math.random() * 50)) <= 20){

            multiObstacles.push(new enemyCar(30, 50, "./Images/yellowCar.png", 440, 0, "yellowCar"));

        }else if((Math.floor(Math.random() * 50)) > 20 && (Math.floor(Math.random() * 50)) <= 30){

            multiObstacles.push(new enemyCar(30, 50, "./Images/greenCar.png", 400, 0, "greenCar"));

        }else if ((Math.floor(Math.random() * 50)) > 30 && (Math.floor(Math.random() * 50)) <= 40){

            multiObstacles.push(new enemyCar(50, 80, "./Images/truck.png", 310, 0, "truck"));

        }else if ((Math.floor(Math.random() * 50) > 40) && (Math.floor(Math.random() * 50) <= 50)){

            multiObstacles.push(new enemyCar(50, 80, "./Images/truck.png", 570, 0, "truck2"));
        }

    }
    // dictates the path the cars will take
    for (let i = 0; i < multiObstacles.length; i +=1){

        // all the cars excluding green move down in their respective lanes and speed of laneSpeed
        if(multiObstacles[i].type == "pinkCar" ||
           multiObstacles[i].type == "yellowCar" ||
           multiObstacles[i].type == "truck" ||
           multiObstacles[i].type == "truck2"){

            multiObstacles[i].y += laneSpeed;
            multiObstacles[i].update();

        }
        // green car moves left and right depending on where it is on the y axis
        else if (multiObstacles[i].type == "greenCar"){

            if (multiObstacles[i].y >= 0 && multiObstacles[i].y <= 200){
                multiObstacles[i].y += 5;
                multiObstacles[i].x += 3;
                multiObstacles[i].update();
            }
            if (multiObstacles[i].y > 200 && multiObstacles[i].y <= 400){
                multiObstacles[i].x -= 5;
                multiObstacles[i].y += 3;
                multiObstacles[i].update();
            }
            if(multiObstacles[i].y > 400 && multiObstacles[i].y <= 800){
                multiObstacles[i].x += 5;
                multiObstacles[i].y += 3;
                multiObstacles[i].update();
            }
            
        }
        
        // if enemy car exceeds boundry of canvas, delete it from array
        if(multiObstacles[i].y > 630 || 
            multiObstacles[i].y < 0 ||
            multiObstacles[i].x > 800 ||
            multiObstacles[i].x < 0){
            multiObstacles.splice(i, 1);
        }
    }
    score.text = "SCORE: " + myGameArea.frameNo; // update score base on fram count
    score.update();
    carHealth.text = "HEALTH " + car.health; // update health
    carHealth.update();
    car.newPos(); // update player car's position
    boundryCheck(car); // check if player car exceeds boundry
    car.update(); // update car object
    console.log(multiObstacles.length); // display # of objects in multiObstacles in terminal
    
}

// checks amount of time passed based on frame count
function everyInterval(n){
    if ((myGameArea.frameNo / n) % 1 == 0){return true;}
    return false;
    
}

// checks to see input coming from keyboard
document.body.addEventListener("keydown", keyDown);
document.body.addEventListener("keyup", keyUp);

// checks to see if WASD are pressed down
function keyDown(event){
    if (event.keyCode == 83)
        downPressed = true;
    if (event.keyCode == 87)
        upPressed = true;
    if (event.keyCode == 65)
        leftPressed = true;
    if (event.keyCode == 68)
        rightPressed = true;
}

// checks to see if WASD are not pressed.
function keyUp(event){
    if (event.keyCode == 83)
        downPressed = false;
    if (event.keyCode == 87)
        upPressed = false;
    if (event.keyCode == 65)
        leftPressed = false;
    if (event.keyCode == 68)
        rightPressed = false;
}