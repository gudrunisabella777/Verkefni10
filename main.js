// Byrjum á að importa style.css og animejs (animation pakki(sjá README.md))
 
import './styles.css'
// import { anime } from 'animejs';
import anime from 'animejs';

let audio = new Audio('/birds.mp3');
audio.play()

// Byrjum á að skilgreina breyturnar....

const c = document.getElementById('c');
const ctx = c.getContext('2d');
let cH;
let cW;
let bgColor = '#FF6138';
const animations = [];



// Skilgreinum hérna litna sem birtast þegar að notandi smellir á skjáinn

 const colorPicker = (() => {
  const colors = ['#FF6138', '#FFBE53', '#2980B9', '#282741'];
  let index = 0;
  function next() {
    index = index++ < colors.length-1 ? index : 0;
    return colors[index];
  }
  function current() {
    return colors[index]
  }
  return {
    next,
    current
  }
})();

// Stillingar fyrir animation....

function removeAnimation(animation) {
  const index = animations.indexOf(animation);
  if (index > -1) animations.splice(index, 1);
}

function calcPageFillRadius(x, y) {
  const l = Math.max(x - 0, cW - x);
  const h = Math.max(y - 0, cH - y);
  return Math.sqrt(l**2 + h**2);
}

function addClickListeners() {
  document.addEventListener('touchstart', handleEvent);
  document.addEventListener('mousedown', handleEvent);
};



function handleEvent(e) {
  let temp = e;
    if (e.touches) { 
      e.preventDefault();
      temp = e.touches[0]
      // e = e.touches[0];
    }
    const currentColor = colorPicker.current();
    const nextColor = colorPicker.next();
    const targetR = calcPageFillRadius(temp.pageX, temp.pageY);
    const rippleSize = Math.min(200, (cW * .4));
    const minCoverDuration = 750;
    
    const pageFill = new Circle({
      x: temp.pageX,
      y: temp.pageY,
      r: 0,
      fill: nextColor
    });
    const fillAnimation = anime({
      targets: pageFill,
      r: targetR,
      duration:  Math.min(targetR / 2 , minCoverDuration ),
      easing: 'easeOutQuart',
      complete(){
        bgColor = pageFill.fill;
        removeAnimation(fillAnimation);
      }
    });
    
    const ripple = new Circle({
      x: temp.pageX,
      y: temp.pageY,
      r: 0,
      fill: currentColor,
      stroke: {
        width: 3,
        color: currentColor
      },
      opacity: 1
    });
    const rippleAnimation = anime({
      targets: ripple,
      r: rippleSize,
      opacity: 0,
      easing: 'easeOutExpo',
      duration: 900,
      complete: removeAnimation
    });
    
    const particles = [];
    for (let i=0; i<32; i++) {
      const particle = new Circle({
        x: temp.pageX,
        y: temp.pageY,
        fill: currentColor,
        r: anime.random(24, 48)
      })
      particles.push(particle);
    }
    const particlesAnimation = anime({
      targets: particles,
      x(particle){
        return particle.x + anime.random(rippleSize, -rippleSize);
      },
      y(particle){
        return particle.y + anime.random(rippleSize * 1.15, -rippleSize * 1.15);
      },
      r: 0,
      easing: 'easeOutExpo',
      duration: anime.random(1000,1300),
      complete: removeAnimation
    });
    animations.push(fillAnimation, rippleAnimation, particlesAnimation);
}

function extend(a, b){
  const i = a;
  const j = b;
  for(const key in j) {
    if(j.hasOwnProperty(key)) {
      i[key] = j[key];
    }
  }
  return i;
}

let Circle = function(opts) {
  extend(this, opts);
}

Circle.prototype.draw = function() {
  ctx.globalAlpha = this.opacity || 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
  if (this.stroke) {
    ctx.strokeStyle = this.stroke.color;
    ctx.lineWidth = this.stroke.width;
    ctx.stroke();
  }
  if (this.fill) {
    ctx.fillStyle = this.fill;
    ctx.fill();
  }
  ctx.closePath();
  ctx.globalAlpha = 1;
}

// eslint-disable-next-line
const animate = anime({
  duration: Infinity,
  update() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, cW, cH);
    animations.forEach((anim) => {
      anim.animatables.forEach((animatable) => {
        animatable.target.draw();
      });
    });
  }
});

const resizeCanvas = function() {
  cW = window.innerWidth;
  cH = window.innerHeight;
  c.width = cW * devicePixelRatio;
  c.height = cH * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
};

(function init() {
  resizeCanvas();
  if (window.CP) {
    
    window.CP.PenTimer.MAX_TIME_IN_LOOP_WO_EXIT = 6000; 
  }
  window.addEventListener('resize', resizeCanvas);
  addClickListeners();
  if (window.location.pathname.match(/fullcpgrid/)) {
    startFauxClicking();
  }
  handleInactiveUser();
})();

function handleInactiveUser() {
  const inactive = setTimeout(()=> {
    fauxClick(cW/2, cH/2);
  }, 2000);
  
  function clearInactiveTimeout() {
    clearTimeout(inactive);
    document.removeEventListener('mousedown', clearInactiveTimeout);
    document.removeEventListener('touchstart', clearInactiveTimeout);
  }
  
  document.addEventListener('mousedown', clearInactiveTimeout);
  document.addEventListener('touchstart', clearInactiveTimeout);
}

function startFauxClicking() {
  setTimeout(()=> {
    fauxClick(anime.random( cW * .2, cW * .8), anime.random(cH * .2, cH * .8));
    startFauxClicking();
  }, anime.random(200, 900));
}

function fauxClick(x, y) {
  const clicker= new Event('mousedown');
  clicker.pageX = x;
  clicker.pageY = y;
  document.dispatchEvent(clicker);
}