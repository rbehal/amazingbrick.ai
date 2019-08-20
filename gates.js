class Gates {

  constructor() {
    //Values for gap length and min. dist of left gate
    let gap = 0.33 * width;
    let border = 0.1 * width;

    //Gate thickness
    this.h = 35;
    //Left gate length
    this.wl = random(border, 0.65 * width);
    //Right gate length
    this.wr = width - (this.wl + gap);

    //Gate x positions
    this.xr = this.wl + gap;
    this.xl = 0;

    //Gate y positions
    if (gates.length === 0) {
      this.y = -70;
    } else {
      this.y = gates[((gates.length) - 1)].y - 0.6 * height;
    }

    //Defining y positions of squares
    let bottom1 = this.y - 0.1 * height;
    let top1 = this.y - 0.25 * height;
    this.sqy1 = random(bottom1, top1);

    let bottom2 = this.y + 0.1 * height;
    let top2 = this.y + 0.25 * height;
    this.sqy2 = random(bottom2, top2);

    //Defining x position of squares
    let leftWall = this.xl + this.wl;
    let rightWall = this.xr;
    this.sqx1 = random(leftWall, rightWall);
    this.sqx2 = random(leftWall, rightWall);

    //Defining square size
    this.sqs = 15 * sqrt(2);

    //Calculating colour of obstacles
    this.colourCalculate();
  }

  generate() {
    //Visualizing obstacles
    this.colourDisplay();
    rect(this.xl, this.y, this.wl, this.h);
    rect(this.xr, this.y, this.wr, this.h);
    square(this.sqx1, this.sqy1, this.sqs);
    square(this.sqx2, this.sqy2, this.sqs);
  }

  move() {
    //Moving obstacles and calculating score
    let scale = 1.75;
    this.y += -scale * players[0].vely;
    players[0].primeTime = 0;
    this.sqy1 += -scale * players[0].vely;
    this.sqy2 += -scale * players[0].vely;
    highscore();
  }

  hits() {
    //Calculating if player hits the gate
    if (players[0].realy > this.y && players[0].realy < (this.y + this.h)) {
      if (players[0].realx > this.xl && players[0].realx < this.wl) {
        return true
      }
      if (players[0].realx > this.xr) {
        return true
      }
    }

    //Calculating if player hits square 1
    if (players[0].realy > this.sqy1 && players[0].realy < (this.sqy1 + this.sqs)) {
      if (players[0].realx > this.sqx1 && players[0].realx < (this.sqx1 + this.sqs)) {
        return true
      }
    }

    //Calculating if player hits square 2
    if (players[0].realy > this.sqy2 && players[0].realy < (this.sqy2 + this.sqs)) {
      if (players[0].realx > this.sqx2 && players[0].realx < (this.sqx2 + this.sqs)) {
        return true
      }
    }
  }

  colourDisplay() {
    //Returning different colours
    noStroke();
    if (this.c === 1) {
      return fill(159, 255, 126) //green
    }
    if (this.c === 2) {
      return fill(255, 255, 0) //yellow
    }
    if (this.c === 3) {
      return fill(230, 0, 0) //red
    }
    if (this.c === 4) {
      return fill(120, 0, 255) //purple
    }
    if (this.c === 5) {
      return fill(135, 178, 255) //blue
    }
  }

  colourCalculate() {
    //Calculating colour value to return
    if (numGate % 30 === 0) {
      numGate = 5;
    } else if (numGate % 25 < 5) {
      this.c = 5;
    } else if (numGate % 20 < 5) {
      this.c = 1;
    } else if (numGate % 15 < 5) {
      this.c = 2;
    } else if (numGate % 10 < 5) {
      this.c = 3;
    } else if (numGate % 5 < 5) {
      this.c = 4;
    }
    numGate++;
  }

}