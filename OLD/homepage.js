<script>
const imageGroups = [
  ['img/DSCF5693.mp4', 'img/woolfe-3.jpeg', 'img/Artboard9.png', 'img/insitu_posters.png'],
  ['img/artbook1.jpg','img/solar-analysis.png', 'img/DSCF5581.mp4', 'img/Interior_Render.jpeg', 'img/DSCF3051.JPG'],
  ['img/visual-response.jpg', 'img/hvd_signage.jpg','img/loyaltycard_flat.jpg','img/woolfe-1.jpeg'],
  ['img/wk2bar.png', 'img/teuf.jpg'],
  ['img/insitu_laptop.mov', 'img/sony.png', 'img/pacify.jpg'],
];

const videoSources = [
  'img/Film-to-Book.mp4',
  'img/record_2024-10-21_19-12-19.mp4',
  'img/script-in-action.mov',
  'img/parting-msg.mov',
];

const main = document.getElementById('main-area');
const video = document.getElementById('bg-video');

let currentGroupIndex = 0;
let currentImageIndex = -1;
let zIndexCounter = 10;
const stackedImages = [];

function clearStack() {
  stackedImages.forEach(img => main.removeChild(img));
  stackedImages.length = 0;
  zIndexCounter = 10;
}

function loadNextGroup() {
  currentGroupIndex++;
  if (currentGroupIndex >= imageGroups.length) {
    currentGroupIndex = 0;
  }
  currentImageIndex = -1;

  const videoSrc = videoSources[currentGroupIndex % videoSources.length];
    video.src = videoSrc;
    video.load();
    video.play();


  clearStack();

 
}

function loadPreviousGroup() {
currentGroupIndex--;
if (currentGroupIndex < 0) {
currentGroupIndex = imageGroups.length - 1;
}

const group = imageGroups[currentGroupIndex];
currentImageIndex = group.length - 1;

const videoSrc = videoSources[currentGroupIndex % videoSources.length];
video.src = videoSrc;
video.load();
video.play();


clearStack();

// Show the last image of the previous group
const mediaSrc = group[currentImageIndex];
let mediaElement;

if (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.mov') || mediaSrc.endsWith('.webm')) {
mediaElement = document.createElement('video');
mediaElement.src = mediaSrc;
mediaElement.autoplay = true;
mediaElement.muted = true;
mediaElement.loop = true;
mediaElement.playsInline = true;
mediaElement.classList.add('media-video');
} else {
mediaElement = document.createElement('img');
mediaElement.src = mediaSrc;
}

mediaElement.classList.add('media-image');
mediaElement.style.zIndex = zIndexCounter++;
main.appendChild(mediaElement);
stackedImages.push(mediaElement);
}



function showNextImage() {
const group = imageGroups[currentGroupIndex];
if (currentImageIndex < group.length - 1) {
currentImageIndex++;
const mediaSrc = group[currentImageIndex];
let mediaElement;

if (!mediaSrc) return; // safety check

if (mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.mov') || mediaSrc.endsWith('.webm')) {
mediaElement = document.createElement('video');
mediaElement.src = mediaSrc;
mediaElement.autoplay = true;
mediaElement.muted = true;
mediaElement.loop = true;
mediaElement.playsInline = true;
mediaElement.classList.add('media-video');
} else {
mediaElement = document.createElement('img');
mediaElement.src = mediaSrc;
}

mediaElement.classList.add('media-image');
mediaElement.style.zIndex = zIndexCounter++;
main.appendChild(mediaElement);
stackedImages.push(mediaElement);
} else {
loadNextGroup();
}
}




main.addEventListener('click', function (e) {
const isLeftSide = e.clientX < window.innerWidth / 2;

if (isLeftSide) {
// Go backward
if (stackedImages.length > 0) {
const lastImg = stackedImages.pop();
main.removeChild(lastImg);
currentImageIndex--;
zIndexCounter--;

// After removing, if no more images left in current group:
if (currentImageIndex < 0) {
loadPreviousGroup();
}
} else {
// Just in case currentImageIndex is 0 but no images in stack (edge case)
loadPreviousGroup();
}
} else {
// Go forward
showNextImage();
}
});

const cursor = document.getElementById('custom-cursor');

// Update this with your own arrow images if needed
const leftArrowURL = 'img/arrow-left.svg';
const rightArrowURL = 'img/arrow-right.svg';

document.addEventListener('mousemove', (e) => {
const x = e.clientX;
const y = e.clientY;
const screenMid = window.innerWidth / 2;

cursor.style.left = x + 'px';
cursor.style.top = y + 'px';

// Change the background image depending on cursor position
if (x < screenMid) {
cursor.style.backgroundImage = `url(${leftArrowURL})`;
} else {
cursor.style.backgroundImage = `url(${rightArrowURL})`;
}
});



</script>