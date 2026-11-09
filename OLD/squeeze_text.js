let myFont;
let spacer;
let spacerHeight = 4000;

let video;            // kept but unused
let maskedFillG;
let maskedStrokeG;

function preload() {
  myFont = loadFont("data/WorkSans-VariableFont_wght.ttf");
}

function setup() {
  spacer = createDiv('');
  spacer.style('height', spacerHeight + 'px');
  spacer.style('position', 'relative');

  const c = createCanvas(windowWidth, windowHeight);
  c.style('position', 'fixed');
  c.style('top', '0');
  c.style('left', '0');
  c.style('z-index', '10');

  textFont(myFont);
  textAlign(CENTER, CENTER);
  textSize(windowWidth / 7.5);
  strokeJoin(ROUND);
  strokeCap(ROUND);

  maskedFillG   = createGraphics(windowWidth, windowHeight);
  maskedStrokeG = createGraphics(windowWidth, windowHeight);

  // keep video element to avoid structural changes, but don't use it
  video = createVideo('img/bgslideshow720p.mov');
  video.hide();
}

function draw() {
  background(255);

  const doc = document.documentElement;
  const scrollY = window.scrollY || doc.scrollTop;
  const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  const t  = constrain(scrollY / maxScroll, 0, 1);
  const te = easeInOutCubic(t);

  const sy = lerp(10, 0.5, te);
  const sw = lerp(70, 0, te);

  // ---------- Fill layer (now solid black) ----------
  maskedFillG.clear();
  maskedFillG.push();
  maskedFillG.translate(maskedFillG.width / 2, maskedFillG.height / 2);
  maskedFillG.scale(1, sy);
  maskedFillG.textFont(myFont);
  maskedFillG.textAlign(CENTER, CENTER);
  maskedFillG.textSize(width / 7.5);
  maskedFillG.noStroke();
  maskedFillG.fill(225,235,28);               // solid black
  maskedFillG.text("Meg(an)Duong", 0, 0);
  maskedFillG.pop();

  if (frameCount % 2 === 0) {
    const payload = { type: 'squeeze-progress', t: te, sy, sw };
    window.parent?.postMessage(payload, '*');
  }

  // ---------- Stroke layer (still animates stroke) ----------
  maskedStrokeG.clear();
  maskedStrokeG.push();
  maskedStrokeG.translate(maskedStrokeG.width / 2, maskedStrokeG.height / 2);
  maskedStrokeG.scale(1, sy);
  maskedStrokeG.textFont(myFont);
  maskedStrokeG.textAlign(CENTER, CENTER);
  maskedStrokeG.textSize(width / 7.5);
  maskedStrokeG.noFill();
  maskedStrokeG.stroke(225,235,28);           // solid black stroke
  maskedStrokeG.strokeWeight(sw);
  maskedStrokeG.text("Meg(an)Duong", 0, 0);
  maskedStrokeG.pop();

  // ---------- Composite ----------
  image(maskedFillG,   0, 0);
  image(maskedStrokeG, 0, 0);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  textSize(windowWidth / 7.5);
  maskedFillG   = createGraphics(windowWidth, windowHeight);
  maskedStrokeG = createGraphics(windowWidth, windowHeight);
}

function lerp(a, b, t) { return a + (b - a) * t; }

function easeInOutCubic(x) {
  return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
}
