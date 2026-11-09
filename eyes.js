
function setup() {
    let canvas = createCanvas(240, 120);
    canvas.parent('eye-container');
  }
  
  function draw() {
    clear();
  
    drawEye(65, 60);
    drawEye(175, 60);
  }
  
  function drawEye(x, y) {
    // White of eye
    stroke(0);
    strokeWeight(1.5);
    fill(255);
    circle(x, y, 90);
  
    // Iris follows cursor
    let xc = constrain(mouseX - x, -15, 15);
    let yc = constrain(mouseY - y, -15, 15);
  
    noStroke();
    fill(0);
    circle(x + xc, y + yc, 45);
  
    // Glare
    fill(255);
    circle(x + xc + 10, y + yc - 10, 10);
  }
  