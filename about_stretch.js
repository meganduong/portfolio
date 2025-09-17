let myFont;
let spacer;
let spacerHeight = 6000;

// Paragraphs as segments (strong/plain) — same content you had
const paragraphSegments = [
  [
    {txt:"Meg(an) Duong", strong:true},
    {txt:"is a design student with a major in", strong:false},
    {txt:"graphic design", strong:true},
    {txt:"and minor in architecture in her", strong:false},
    {txt:"final", strong:true},
    {txt:"year of her undergraduate degree.", strong:false}
  ],
  [
    {txt:"Her primary belief in her practice is", strong:false},
    {txt:"care", strong:true},
    {txt:":", strong:false},
    {txt:"care", strong:true},
    {txt:"for the design,", strong:false},
    {txt:"care", strong:true},
    {txt:"for the people,", strong:false},
    {txt:"care", strong:true},
    {txt:"for the impact.", strong:false}
  ],
  [
    {txt:"She also", strong:false},
     {txt:"nutures", strong:true},
      {txt:"interests of installation and spatial design, event architecture and creative coding.", strong:false},
  ],
  [
    {txt:"Equipped with knowledge in", strong:false},
    {txt:"softwares", strong:true},
    {txt:"including Adobe Suite programs (Ps, Ai, Id, Lr, Pr, Ae), Figma, Rhino7, Enscape, Grasshopper, Visual Studio Code, Processing, Arduino IDE…", strong:false}
  ],
  [
    {txt:"…and thus", strong:false},
    {txt:"skills", strong:true},
    {txt:"in vector art, image and video editing, typesetting, page layout, print-ready filing, interactive prototyping, 3D modelling, physical fabrication, rendering, HTML/CSS/JS, physical computing…", strong:false}
  ],
  [
    {txt:"She is eager to continue", strong:false},
    {txt:"growing", strong:true},
    {txt:"and", strong:false},
    {txt:"learning", strong:true},
    {txt:"as a designer and is looking forward to working", strong:false},
    {txt:"with you", strong:true},
    {txt:", which can just begin with a", strong:false},
    {txt:"conversation", link:true}
  ]
];

// Will hold tokenized paragraphs (word-level)
let paragraphs = [];

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
  textAlign(LEFT, TOP);
  textSize(25); // smaller so lines have more room
   strokeJoin(ROUND);
  strokeCap(ROUND);

  // Tokenize segments into words so wrapping can break anywhere needed
 paragraphs = paragraphSegments.map(segArr => {
  const words = [];
  for (const seg of segArr) {
    const parts = seg.txt.split(/\s+/).filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      // we append a space to every token so wrapping can break naturally
      const display = parts[i] + " ";
      words.push({
        txt: display,          // what we draw (includes trailing space)
        raw: parts[i],         // same word without the trailing space (for underline/bounds)
        strong: !!seg.strong,
        link: !!seg.link
      });
    }
  }
  return words;
});
}

function draw() {
  background(255);

  // Scroll progress drives the strong-word effect
  const doc = document.documentElement;
  const scrollY = window.scrollY || doc.scrollTop;
  const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  const t  = constrain(scrollY / maxScroll, 0, 1);
  const te = easeInOutCubic(t);

  const sy = lerp(10, 1, te);   // vertical squeeze for <strong>
  const sw = lerp(15, 0, te);   // stroke weight for <strong>

  drawParagraphs(sy, sw);
}

function drawParagraphs(sy, sw) {
  const margin = 30;
  const maxWidth = width - margin * 2;
  let x = margin;
  let y = margin;
  const leading = textSize() * 1.5;

  for (const para of paragraphs) {
    for (const w of para) {
      const tokenWidth = textWidth(w.txt);   // includes trailing space
      const wordWidth  = textWidth(w.raw);   // excludes trailing space

      // wrap if this token would overflow
      if (x + tokenWidth > margin + maxWidth) {
        x = margin;
        y += leading;
      }

      push();
      translate(x, y);

      if (w.link) {
        // check hover
        let hovering = w.bounds &&
          mouseX > w.bounds.x &&
          mouseX < w.bounds.x + w.bounds.w &&
          mouseY > w.bounds.y &&
          mouseY < w.bounds.y + w.bounds.h;

        if (hovering) {
          cursor('pointer');
          textStyle(BOLD);
        } else {
          cursor(ARROW);
          textStyle(NORMAL);
        }

        noStroke();
        fill('#0645AD');
        text(w.txt, 0, 0);

        // underline only under the word (not the trailing space)
        stroke('#0645AD');
        strokeWeight(2);
        line(0, textSize() * 1.05, wordWidth, textSize() * 1.05);

        // bounds for click/hover
        w.bounds = {
          x: x,
          y: y - textSize() * 0.2,
          w: wordWidth,
          h: textSize() * 1.3
        };

      } else if (w.strong) {
        scale(1, sy);
        stroke(0);
        strokeWeight(sw);
        fill(0);
        textStyle(NORMAL);
        text(w.txt, 0, 0);

      } else {
        noStroke();
        fill(0);
        textStyle(NORMAL);
        text(w.txt, 0, 0);
      }

      pop();
      x += tokenWidth;
    }

    // paragraph break
    x = margin;
    y += leading * 1.3;
  }
}



function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

function lerp(a, b, t) { return a + (b - a) * t; }
function easeInOutCubic(x) {
  return x < 0.5 ? 4*x*x*x : 1 - pow(-2*x + 2, 3) / 2;
}

function mousePressed() {
  for (const para of paragraphs) {
    for (const w of para) {
      if (w.link && w.bounds) {
        if (
          mouseX > w.bounds.x &&
          mouseX < w.bounds.x + w.bounds.w &&
          mouseY > w.bounds.y &&
          mouseY < w.bounds.y + w.bounds.h
        ) {
          window.open("mailto:meg4nduong@gmail.com");
        }
      }
    }
  }
}

