var radius = 240; // radius of carousel
var autoRotate = true; // enable auto-rotation
var rotateSpeed = -30; // speed of rotation (negative for reverse)
var imgWidth = 120; // width of images (in px)
var imgHeight = 170; // height of images (in px)

// Set up carousel after a 1-second delay
setTimeout(init, 1000);

// Grab elements for carousel
var odrag = document.getElementById('drag-container');
var ospin = document.getElementById('spin-container');
var aImg = ospin.getElementsByTagName('img');
var aVid = ospin.getElementsByTagName('video');
var aEle = [...aImg, ...aVid]; // combine images and videos

// Set dimensions for spin-container
ospin.style.width = imgWidth + "px";
ospin.style.height = imgHeight + "px";

// Set dimensions for the ground
var ground = document.getElementById('ground');
ground.style.width = radius * 3 + "px";
ground.style.height = radius * 3 + "px";

// Initialize the carousel
function init(delayTime) {
  for (var i = 0; i < aEle.length; i++) {
    aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
    aEle[i].style.transition = "transform 1s";
    aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
  }
}

// Function to apply transformations to the container
function applyTranform(obj) {
  if (tY > 180) tY = 180;
  if (tY < 0) tY = 0;
  obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
}

// Toggle spin animation
function playSpin(yes) {
  ospin.style.animationPlayState = (yes ? 'running' : 'paused');
}

var sX, sY, nX, nY, desX = 0, desY = 0, tX = 0, tY = 10;

// Auto-rotate the carousel
if (autoRotate) {
  var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
  ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
}

// Mouse interaction
document.onpointerdown = function (e) {
  clearInterval(odrag.timer);
  e = e || window.event;
  sX = e.clientX;
  sY = e.clientY;

  this.onpointermove = function (e) {
    e = e || window.event;
    nX = e.clientX;
    nY = e.clientY;
    desX = nX - sX;
    desY = nY - sY;
    tX += desX * 0.1;
    tY += desY * 0.1;
    applyTranform(odrag);
    sX = nX;
    sY = nY;
  };

  this.onpointerup = function () {
    odrag.timer = setInterval(function () {
      desX *= 0.95;
      desY *= 0.95;
      tX += desX * 0.1;
      tY += desY * 0.1;
      applyTranform(odrag);
      playSpin(false);
      if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
        clearInterval(odrag.timer);
        playSpin(true);
      }
    }, 17);
    this.onpointermove = this.onpointerup = null;
  };
  return false;
};

// Zoom in/out with mouse wheel
document.onmousewheel = function(e) {
  e = e || window.event;
  var d = e.wheelDelta / 20 || -e.detail;
  radius += d;
  init(1);
};

// Fade out the gift message and show carousel after 5 seconds
setTimeout(function() {
  var giftMessage = document.getElementById('gift-message');
  giftMessage.classList.add('fade-out');
  setTimeout(function() {
    giftMessage.style.display = 'none';
    document.getElementById('drag-container').style.display = 'flex';
  }, 1000); // 1 second to ensure smooth fade transition
}, 5000); // Wait for 5 seconds before fading out the gift message

// Background Music Autoplay Fix
window.addEventListener('load', function () {
  // Play music on user interaction
  var bgMusic = document.getElementById('bg-music');
  document.body.addEventListener('click', function () {
    bgMusic.muted = false; // Unmute the audio after a click
    bgMusic.play(); // Ensure it starts playing
  });
});
