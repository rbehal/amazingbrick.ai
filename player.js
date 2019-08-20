class player {

  constructor(nn) {
    //Positions before linear tranfsormation
    this.realx = width / 2;
    this.realy = height / 2;

    //Positions after linear transformation
    this.transx = (this.realx * cos(ang)) + (this.realy * sin(ang));
    this.transy = (-this.realx * sin(ang)) + (this.realy * cos(ang));

    //Acceleration values
    let grv = 0.23;
    let drg = 0.0001;

    //Accelerations
    this.accy = grv;
    this.accx = drg;

    //Velocities
    this.vely = 0;
    this.velx = 0;

    //Attributes for fitness func.
    this.score = 0;
    this.time = 0;
    this.primeTime = 0;
    this.fell = 0;
    this.center = 0;
    this.hit = 0;
    this.wall = 0;
    this.fitness = 0;

    //Creating or breeding neural net
    if (nn) {
      this.nn = nn.breed();
    } else {
      this.nn = new NeuralNetwork(10, 6, 3);
    }
  }

  decide(gates) {
    //Defining floor,ceiling,walls
    let floor = height + (sqrt(800));
    let ceiling = (height / 2 - (sqrt(800)) / 2);
    let leftWall = sqrt(200);
    let rightWall = width - (sqrt(200));

    //Find the closest gate -- Works
    let closestDist = Infinity;
    closest = null;
    for (let i = 0; i < gates.length; i++) {
      let dist = abs(this.realy - gates[i].y);
      if (dist < closestDist) {
        closest = gates[i];
        closestDist = dist;
      }
    }

    //Neural network inputs
    let inputs = [];
    inputs[0] = map(this.realx, leftWall, rightWall, 0, 1);
    inputs[1] = map(this.realy, floor, ceiling, 0, 1);
    inputs[2] = map(closest.xr, 0.43 * width, 0.98 * width, 0, 1);
    inputs[3] = map(closest.y, 0, height, 0, 1);
    //Works significantly better with vels as inputs
    inputs[4] = map(this.vely, -6, 11.73, 0, 1);
    inputs[5] = map(this.velx, -2, 2, 0, 1);
    inputs[6] = map(closest.sqy1, 0, height, 0, 1);
    inputs[7] = map(closest.sqy2, 0, height, 0, 1);
    inputs[8] = map(closest.sqx1, 0.1 * width, closest.xr, 0, 1);
    inputs[9] = map(closest.sqx2, 0.1 * width, closest.xr, 0, 1);

    //Neural network outputs
    let output = this.nn.predict(inputs);
    let frac = 1 / 3

    if (output[0] > frac) {
    } else if (output[1] > frac) {
      Lkey = true;
      players[0].nnJump();
    } else if (output[2] > frac) {
      Rkey = true;
      players[0].nnJump();
    }
  }

  mutate(rate) {
    //Mutating neural network weights
    this.nn.mutate(rate);
  }

  display() {
    //Visualizing player
    rotate(ang);
    fill(0);
    square(this.transx, this.transy, 15);
  }

  gravity() {
    //Defining floor and ceiling
    let floor = height + (sqrt(800));
    let ceiling = (height / 2 - (sqrt(800)) / 2);

    //Defining gravity
    this.vely += this.accy;
    this.realy += this.vely;

    //Constraining and killing at floor
    if (this.realy >= floor) {
      this.realy = floor;
      killGeneration();
      nextGeneration();
      this.vely = 0;
    }

    //Constraining at ceiling and calculating score
    if (this.realy <= ceiling) {
      this.realy = ceiling;
      highscore();
      //Moving gates down at ceiling
      for (var i = 0; i < gates.length; i++) {
        gates[i].move();
        if (gates[i].y > 2 * height) {
          gates.splice(i, 1);
        }
        redraw();
      }
    }

    //Transforming to x pos. after rotation
    this.transx = (this.realx * cos(ang)) + (this.realy * sin(ang));
    this.transy = (-this.realx * sin(ang)) + (this.realy * cos(ang));

    //Setting player score to current score
    this.score = score;
  }

  drag() {
    //Defining walls and middle
    let middle = width / 2;
    let leftWall = sqrt(200);
    let rightWall = width - (sqrt(200));

    // //Introducing drag to the game
    // if (this.velx < 0) {
    //   this.velx += this.accx;
    // } else if (this.velx > 0) {
    //   this.velx -= this.accx;
    // }

    //Constraining x position and vel.
    if (this.realx > leftWall && this.realx < rightWall) {
      this.realx += this.velx;
    } else if (this.realx < rightWall && this.velx > 0) {
      this.realx += this.velx;
    } else if (this.realx > leftWall && this.velx < 0) {
      this.realx += this.velx;
    }
  }

  playerJump() {
    //For playing with mouse buttons
    //Defining walls and middle
    let leftWall = sqrt(200);
    let rightWall = width - (sqrt(200));
    let middle = width / 2;

    //Jump y&x velocities
    let jvely = -6;
    let jvelx = 1.4;

    //Constraining where p can jump
    if (this.realx > leftWall && this.realx < rightWall) {
      this.vely = jvely;
    } else if (this.realx < middle && mouseX > middle) {
      this.vely = jvely;
    } else if (this.realx > middle && mouseX < middle) {
      this.vely = jvely;
    } else {
      this.vely = 0.5;
    }

    //Jumping based on mouse pos.
    if (mouseX > middle) {
      this.velx = jvelx;
    } else if (mouseX < middle) {
      this.velx = -jvelx;
    }
  }

  nnJump() {
    //For playing w/ arrow keys & nn moves
    //Defining walls and middle
    let leftWall = sqrt(200);
    let rightWall = width - (sqrt(200));
    let middle = width / 2;

    //Jump y&x velocities
    let jvely = -5;
    let jvelx = 1.4;

    //Constraining where p can jump
    if (this.realx > leftWall && this.realx < rightWall) {
      this.vely = jvely;
    } else if (this.realx < middle && Rkey) {
      this.vely = jvely;
    } else if (this.realx > middle && Lkey) {
      this.vely = jvely;
    } else {
      this.vely = 0.5;
    }

    //Jumping based on R/Lkey
    if (Rkey) {
      this.velx = jvelx;
      Rkey = false;
    } else if (Lkey) {
      this.velx = -jvelx;
      Lkey = false;
    }
  }

  fitnessParam() {
    //Logs wasted time, resets to 0 when center is hit
    if (this.time % 359 === 0) {
      this.primeTime++;
      if (this.primeTime > 1) {
        killGeneration();
        nextGeneration();
      }
    }

    //Rewards with survival time.
    this.time++;

    //Defining top/bottom and left/right
    let floor = height + (sqrt(800));
    let ceiling = (height / 2 - (sqrt(800)) / 2);
    let leftWall = sqrt(200);
    let rightWall = width - (sqrt(200));

    //Punishes for dying by floor
    if (this.realy >= floor) {
      this.fell -= 1;
    }

    //Punishes for hitting walls -- Works
    if (this.realx < leftWall || this.realx > rightWall) {
      this.wall -= 1;
    }

    //Rewards for being center -- Works
    if (this.realx > closest.wl && this.realx < closest.xr) {
      this.center += 1;
    }
  }
  
}