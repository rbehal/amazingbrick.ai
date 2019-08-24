let ang;
let score = 0;
let tracker1 = 0;
let tracker2 = 0;
let tracker3 = 0;
let closest = null;
let numGate = 5;
let numGen = 1;
let Lkey = false;
let Rkey = false;
let savedPlayers = [];
let x;
let y;
let cb;
let slider;
let trainSpeed = 1;
let highestScore = 0;
let name = "";
let startGame;

function setup() {

  //Setting tensorflow to use CPU
  tf.setBackend('cpu');
  
  //Game not started yet
  startGame = false;
  
  //Setting values to position elements
  x = windowWidth / 2;
  y = windowHeight / 2;
  
  //Creating all elements
  displayAudio();
  displayCanvas();
  displayControls();
  displayCheckbox();
  displaySlider();
  displayLeaderboard();
  
  //Loading background and image
  background(255);
  img = loadImage('AmazingBrick.png');

  //Creating gates and player arrays
  gates = [];
  players = [];

  //Initializing gates
  for (let k = 0; k < 5; k++) {
    gates.push(new Gates());
    gates[k].c = 5;
  }

  //Initializing player
  ang = PI/4;
  players.push(new player());

  button = createButton('Pause');
  button.position(x+width/1.5+30,y-120);
  button.mousePressed(pause);

}

function pause() {
  noLoop();
  button = createButton('Play');
  button.position(x+width/1.5+30,y-90);
  button.mousePressed(playAgain);
}

function playAgain() {
  loop();
}

function draw() {
  /*button2 = createButton('Start Game');
  button2.position(x-1.75*width+90,y-150);
  button2.mousePressed(loop());
  noLoop();*/
  
  //Checking if game started
  if (!startGame) {
  image(img,width/4,height/3,img.width/2,img.height/2);
  } else {

  //Checking for NN play to allow slider
  if (cb.checked()) {
    trainSpeed = slider.value();
    slider.show();
  } else {
    trainSpeed = 1;
    slider.hide();  
  }

  for (var g = 0; g < trainSpeed; g++) {

    //Reinitializing gates
    if (gates.length === 0) {
      for (let k = 0; k < 5; k++) {
        gates.push(new Gates());
        gates[k].c = 5;
      }
    }

    //Generating new gates
    if (gates.length < 5) {
      gates.push(new Gates());
    }
    //Killing if player hits
    for (var i = 0; i < gates.length; i++) {
      if (players.length > 0) {
        if (gates[i].hits()) {
          players[0].hit -= 1;
          if (score>highestScore) {
            highestScore = score;
            let userName = "";
            if(isNaN(nameInput.value()) == false) {
              userName = "Anonymous User";
            }
            else {
              userName = nameInput.value();
            }
            var scoreString = `<p>`+userName+ ': '+highestScore+`</p>`;
            document.getElementById("playerScore").innerHTML = scoreString;
          }
          killGeneration();
        }
      }
    }

    //All player logic  
    if (players.length > 0) {
      //Neural network making a decision
      if (cb.checked()) {
        players[0].decide(gates);
      }
      //Updating fitness parameters
      if (cb.checked()) {
        players[0].fitnessParam();
      }
      //Gravity logic
      players[0].gravity();
      //X pos. logic
      players[0].drag();
    } else {
      //Spawning new player
      nextGeneration();
    }

  } 

  
  //All of the visualization -- not in for loop
  background(255);

  //Visualizing gates
  for (let o = 0; o < gates.length; o++) {
    gates[o].generate();
  }

  //Score & generation visualization
  if (cb.checked()) {
    displayGen();
  }
  displayScore();
  
  //Player visualization
  players[0].display();

 }  
}

function mousePressed() {
 
  //Starting game
  if (!startGame) {
    startGame = true;
  }

  //Using mouse buttons for gameplay
  players[0].playerJump();

}

function keyPressed() {

  //Starting game
  if (!startGame) {
    startGame = true;
  }
  
  //Using arrow keys for gameplay
  if (keyCode === LEFT_ARROW) {
    Lkey = true;
    players[0].nnJump();
  }

  if (keyCode === RIGHT_ARROW) {
    Rkey = true;
    players[0].nnJump();
  }
    
}

