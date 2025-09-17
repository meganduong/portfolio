let messages = [];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.style('z-index', '-1');       // sits behind all content
  canvas.style('position', 'fixed');   // stays fixed while scrolling
  canvas.style('pointer-events', 'none'); // doesn’t block clicks

  textSize(16);
  textAlign(CENTER, CENTER);
  noStroke();
  fill(0);
  textFont('Work Sans'); // match site font
}

function draw() {
  background(255, 20); // translucent background for trail effect

  if (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height) {
    messages.push({ x: mouseX, y: mouseY, alpha: 100 });
  }

  for (let i = messages.length - 1; i >= 0; i--) {
    let m = messages[i];
    if (!m) continue;

    fill(0, m.alpha);
    text('click', m.x, m.y);
    m.alpha -= 1; // fade out

    if (m.alpha <= 0) {
      messages.splice(i, 1); // remove faded text
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
