var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound;
var backgroundImg;
var backgroundImg2;
var Bg;
var runningImg, runningImg2


localStorage["HighestScore"] = 0


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  backgroundImg = loadImage("Tree.jpeg");
  backgroundImg2 = loadImage("cloud.jpeg1.jpg");

  runningImg = loadImage("Boy1.jpg");
  runningImg2 = loadImage("Boy2.jpg");

  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");


  
}

function setup() {
  createCanvas(1000, 900);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(250,600,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  

  Bg = createSprite(500,500,600,400);
  Bg.addImage(backgroundImg2);

  running1 = createSprite(620,245,10,10);
  running1.addImage(runningImg);
  running1.scale = 0.1;

  running2 = createSprite(650,245,10,10)
  running2.addImage(runningImg2);
  running2.scale = 0.1


  ground = createSprite(500,650,1000,100);
  ground.addImage("ground",groundImage);
  ground.x = 300
  ground.visible=false;
  
  gameOver = createSprite(500,500);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(500,400);
  restart.addImage(restartImg)

  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(500,660,1000,100);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  //trex.debug = true
  
  score = 0;
  
}

function draw() {
  
  background(backgroundImg);
  //displaying score
  textSize(25);
  fill("black");
  text("Score: "+ score, 880,50);
  textSize(40);
  fill("white");
  text("INFINITE T-REX RUNNER GAME", 200, 100);
  text("___________________________", 200,105);
  textSize(20);
  text("KEEP RUNNING RUNNING AND RUNNING!!", 195,250);
  textSize(20);
  fill("red");
  text("(HINT-Press Space Bar to jump)", 380,300)
  
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -4 
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    if (mousePressedOver(restart)) {
       
     }
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  if(localStorage["HighestScore"] < score){
    localStorage["highestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0; 
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(780,590,10,40);
   obstacle.velocityX = -6 ;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 90;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 50 === 0) {
    var cloud = createSprite(780,500,80,50);
    cloud.y = Math.round(random(400,500));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 185;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}