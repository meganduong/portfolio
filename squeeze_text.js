let myFont;
let spacer;
let spacerHeight = 4000;

let video;
let maskedFillG;    // video clipped by filled text
let maskedStrokeG;  // video clipped by stroked text (outline)

function preload() {
  myFont = loadFont("data/WorkSans-VariableFont_wght.ttf");
}

function setup() {
  // Scroll space
  spacer = createDiv('');
  spacer.style('height', spacerHeight + 'px');
  spacer.style('position', 'relative');

  // Fixed canvas
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

  // Offscreen buffers
  maskedFillG   = createGraphics(windowWidth, windowHeight);
  maskedStrokeG = createGraphics(windowWidth, windowHeight);

  // Video
  video = createVideo('img/bgslideshow720p.mov', () => video.loop());
  video.elt.muted = true;
  video.elt.playsInline = true;
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

  // ---------- Fill mask ----------
  maskedFillG.clear();
  drawCoverImage(maskedFillG, video);   // <-- use helper

  maskedFillG.drawingContext.save();
  maskedFillG.drawingContext.globalCompositeOperation = 'destination-in';

  maskedFillG.push();
  maskedFillG.translate(maskedFillG.width / 2, maskedFillG.height / 2);
  maskedFillG.scale(1, sy);
  maskedFillG.textFont(myFont);
  maskedFillG.textAlign(CENTER, CENTER);
  maskedFillG.textSize(width / 7.5);
  maskedFillG.noStroke();
  maskedFillG.fill(255);
  maskedFillG.text("Meg(an)Duong", 0, 0);
  maskedFillG.pop();

  maskedFillG.drawingContext.restore();

  if (frameCount % 2 === 0) {
    const payload = { type: 'squeeze-progress', t: te, sy, sw };
    window.parent?.postMessage(payload, '*');
  }

  // ---------- Stroke mask ----------
  maskedStrokeG.clear();
  drawCoverImage(maskedStrokeG, video);   // <-- use helper

  maskedStrokeG.drawingContext.save();
  maskedStrokeG.drawingContext.globalCompositeOperation = 'destination-in';

  maskedStrokeG.push();
  maskedStrokeG.translate(maskedStrokeG.width / 2, maskedStrokeG.height / 2);
  maskedStrokeG.scale(1, sy);
  maskedStrokeG.textFont(myFont);
  maskedStrokeG.textAlign(CENTER, CENTER);
  maskedStrokeG.textSize(width / 7.5);
  maskedStrokeG.noFill();
  maskedStrokeG.stroke(255);
  maskedStrokeG.strokeWeight(sw);
  maskedStrokeG.text("Meg(an)Duong", 0, 0);
  maskedStrokeG.pop();

  maskedStrokeG.drawingContext.restore();

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

// Helpers
function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOutCubic(x) {
  return x < 0.5 ? 4*x*x*x : 1 - Math.pow(-2*x + 2, 3) / 2;
}

// Cover-draw helper
function drawCoverImage(pg, vid) {
  if (!vid || vid.width === 0 || vid.height === 0) return;

  const canvasRatio = pg.width / pg.height;
  const videoRatio  = vid.width / vid.height;

  let drawWidth, drawHeight;
  if (videoRatio > canvasRatio) {
    drawHeight = pg.height;
    drawWidth  = videoRatio * drawHeight;
  } else {
    drawWidth  = pg.width;
    drawHeight = drawWidth / videoRatio;
  }

  const offsetX = (pg.width  - drawWidth)  / 2;
  const offsetY = (pg.height - drawHeight) / 2;

  pg.image(vid, offsetX, offsetY, drawWidth, drawHeight);
}
