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

function setup() {

  //Setting tensorflow to use CPU
  tf.setBackend('cpu');
  
  //Setting values to position elements
  x = windowWidth / 2;
  y = windowHeight / 2;
  
  //Creating all elements
  displayCanvas();
  displayControls();
  displayCheckbox();
  displaySlider();

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

}

function draw() {
  
  //Checking for NN play to allow slider
  if (cb.checked()) {
    trainSpeed = slider.value();
    slider.show();
  } else {
    trainSpeed = 1;
    slider.hide();  
  }
  
  //All game logic wrapped in for loop for training
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

function mousePressed() {

  //Using mouse buttons for gameplay
  players[0].playerJump();

}

function keyPressed() {

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