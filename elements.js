function displayCanvas() {
  //Scale for canvas, maintains aspect ratio
  let scale = 35;
  
  //Creating and positioning canvas
  var cnv = createCanvas(scale * 9, scale * 16);
  cnv.position(x-width/2, y-height/2);
}

function displayControls() {
  //Control textbox content
  let controlString = createP("Controls: <br><br> For Manual Play: Use mouse buttons to click on canvas or L/R arrow keys to move player. <br><br> For Neural Network Play: Tick checkbox. Use slider to adjust training speed");
  
  //Positioning and styling textbox
  controlString.position(x-1.75*width,y-75);
  controlString.class("rectangle");
}

function displayCheckbox() {
  //Creating,styling,positioning checkbox
  cb = createCheckbox('Let a NN play!',false);
  cb.style('font-size','18px');
  cb.style('color','#FFFFFF');
  cb.position(x+width/1.5,y);  
}

function displaySlider() {
  //Creating and positioning slider
  slider = createSlider(1, 75, 1);
  slider.position(x+width/1.5,y+25);
}

function displayScore() {
  fill(0);
  textSize(32);
  
  //Changing position of score depending on digits
  if (score>=100000) {
    return text(score.toString(), width-110, 25)
  } else if (score>=10000) {
      return text(score.toString(), width-90, 25)
  } else if (score>=1000) {
      return text(score.toString(), width-75, 25)
  } else if (score>=100) {
      return text(score.toString(), width-55, 25)
  } else if (score>=10) {
      return text(score.toString(), width-38, 25)
  } else {
      return text(score.toString(), width-20, 25)
  } 
}

function highscore() {
  let scale = 1.75;

  //Calculates the score for first gate.
  if (players[0].realy > gates[0].y) {
    tracker1 += -scale * players[0].vely;
  }
  if (tracker1 > 195 && players[0].realy < gates[0].y) {
    tracker1 = 0;
    score++;
  }

  //Calculates the score for second gate.
  if (players[0].realy < gates[0].y && players[0].realy > gates[1].y) {
    tracker2 += -scale * players[0].vely;
  }
  if (tracker2 > 195 && players[0].realy < gates[1].y) {
    tracker2 = 0;
    score++;
  }

  //Calculates the score for all other gates.
  if (players[0].realy < gates[1].y && players[0].realy > gates[2].y) {
    tracker3 += -scale * players[0].vely;
  }
  if (tracker3 > 195 && players[0].realy < gates[2].y) {
    tracker3 = 0;
    score++; 
  }
}