let maxFit = 0;
let maxIndex = 0;

function nextGeneration() {
  //Pushing mutated best player for NN
  if (cb.checked()) {
    players.push(eugenics());
  } else {
  //Pushing new player for manual
    players.push(new player());
  }
}

function killGeneration() {
  //Calculating player fitness
  calculateFitness();
  //Pushing player to savedPlayers for NN
  if (cb.checked()) {
    savedPlayers.push(players[0]);
  }
  //Deleting player
  players.splice(0, 1);
  //Deleting gates
  gates.splice(0, 5);
  //Resetting numGates
  numGate = 5;
  //Increasing generation number
  numGen++;
  //Resetting score
  score = 0;
}

function eugenics() {
  
  //Finding best player out of saved players
  for (let k = 0; k < savedPlayers.length; k++) {
    if (savedPlayers[k].fitness > maxFit) {
      maxFit = savedPlayers[k].fitness;
      maxIndex = k;
    }
  }

  //Next player is the best savedPlayer
  let childNN = savedPlayers[maxIndex];
  //Creating new player with best player's neural net
  let child = new player(childNN.nn);
  //Mutating best player's neural net
  //child.mutate(0.1);

  //Dynamic rate of mutation
  if (numGen > 20000) {
    child.mutate(0.05);
  } else if (numGen > 15000) {
    child.mutate(0.1); 
  } else if (numGen > 10000) {
    child.mutate(0.15); 
  } else if (numGen > 5000) {
    child.mutate(0.20); 
  } else if (numGen > 5000) {
    child.mutate(0.25); 
  } else if (numGen > 0) {
    child.mutate(0.3); 
  }

  //Returning mutated best player
  return child;
}

function calculateFitness() {
  //Traits fitness is based on
  let t1 = players[0].center;
  let t2 = players[0].fell;
  let t3 = players[0].time;
  let t4 = players[0].score;
  let t5 = players[0].wall;
  let t6 = players[0].hit;

  //Calculating fitness values
  players[0].fitness = 7*t1 + 200*t4 + 1000*t2 + 1000*t5;
}

function displayGen() {
  //Displaying Generation number, best fitness, and/or parameters for testing
  fill(0);
  textSize(20);
  //let testParam = players[0].center;
  text('Generation: '.concat(numGen.toString()), 0, 25)
  text('Best Fitness: '.concat((maxFit).toString()), 0, 50)
  //text('testParam: '.concat(testParam.toString()), 0, 75)
}