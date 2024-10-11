
const socket = io();

/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('winwheelCanvas');
const ctx = canvas.getContext('2d');
const outerRadius = 200;
const innerRadius = 80;
const centerRadius = 50;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let angle = 0;

const INITIAL_SPEED = 0.2;
const DECELERATION_RATE = 0.99;
const MIN_SPEED = 0.0001;
const ANIMATION_DURATION = 60000;

const prix = [
  { id: 'p1', label: 'Prix 1', color: 'gold' },
  { id: 'p2', label: 'Prix 2', color: 'orange' },
  { id: 'p3', label: 'Prix 3', color: 'darkgoldenrod' },
  { id: 'p4', label: 'Prix 4', color: 'purple' },
  { id: 'p5', label: 'Prix 5', color: 'gold' },
];

const jackpots = [
  { id: 'j1', label: '$100.000', bgPriceColor: '#e344d1', borderColor: '#fff', textColor: '#e344d1', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j2', label: '$250.000', bgPriceColor: '#5588c5', borderColor: '#fff', textColor: '#5588c5', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j3', label: '$500.000', bgPriceColor: '#7340c9', borderColor: '#fff', textColor: '#7340c9', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j4', label: '$1.000.000', bgPriceColor: '#e75d6b', borderColor: '#fff', textColor: '#e75d6b', bgTextColor: '#fff', borderSize: 2 },
];
const JACKPOT_BG_COLOR = '#dddddd';

const centerImage = new Image();
centerImage.src = 'http://place-hold.it/64';

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const jackpotAngle = (2 * Math.PI) / jackpots.length;

  jackpots.forEach((jackpot, jackpotIndex) => {
    const sectionAngle = jackpotAngle / prix.length;
    prix.forEach((section, sectionIndex) => {
      const startAngle = angle + jackpotAngle * jackpotIndex + sectionAngle * sectionIndex;
      const endAngle = startAngle + sectionAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = jackpot.bgPriceColor;
      ctx.fill();
      ctx.strokeStyle = jackpot.borderColor;
      ctx.lineWidth = jackpot.borderSize;
      ctx.stroke();
      ctx.closePath();

      const textAngle = startAngle + sectionAngle / 2;
      ctx.save();
      ctx.translate(centerX + Math.cos(textAngle) * (outerRadius * 0.5), centerY + Math.sin(textAngle) * (outerRadius * 0.5));
      ctx.rotate(textAngle);
      ctx.fillStyle = jackpot.bgTextColor;
      ctx.fillText(section.label, 0, 0);
      ctx.restore();
    });
  });

  jackpots.forEach((jackpot, i) => {
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, innerRadius, jackpotAngle * i + angle, jackpotAngle * (i + 1) + angle);
    ctx.fillStyle = JACKPOT_BG_COLOR;
    ctx.fill();
    ctx.strokeStyle = jackpot.borderColor;
    ctx.lineWidth = jackpot.borderSize;
    ctx.stroke();
    ctx.closePath();

    const textAngle = jackpotAngle * i + angle + jackpotAngle / 2;
    ctx.save();
    ctx.translate(centerX + Math.cos(textAngle) * (innerRadius * 0.70), centerY + Math.sin(textAngle) * (innerRadius * 0.70));
    ctx.rotate(textAngle + Math.PI / 2);
    ctx.fillStyle = jackpot.textColor;
    ctx.font = 'bold 12px ' + ctx.font.split(' ').slice(-1)[0];
    ctx.fillText(jackpot.label, -ctx.measureText(jackpot.label).width / 2, 0);
    ctx.restore();
  });

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(centerImage, centerX - centerRadius, centerY - centerRadius, centerRadius * 2, centerRadius * 2);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(centerX, centerY, centerRadius, 0, 2 * Math.PI);
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.save();
  ctx.translate(centerX, centerY - outerRadius - 20);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-10, -20);
  ctx.lineTo(10, -20);
  ctx.closePath();
  ctx.fillStyle = '#e75d6b';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function animate(startTime, currentSpeed) {
  const elapsedTime = Date.now() - startTime;

  if (elapsedTime < ANIMATION_DURATION && currentSpeed > MIN_SPEED) {
    angle = (angle + currentSpeed) % (2 * Math.PI);
    const newSpeed = currentSpeed * DECELERATION_RATE;
    drawWheel();
    requestAnimationFrame(() => animate(startTime, newSpeed));
  } else {
    // Assurez-vous que l'angle final est correctement défini
    angle = angle % (2 * Math.PI);
    drawWheel();
    const winner = getWinningSection();
    alert(`Résultat final :\nJackpot : ${winner.jackpot.label}\nPrix : ${winner.prize.label}`);
  }
}// eslint-disable-next-line no-unused-vars
function getWinningSection() {
  const pointerAngle = Math.PI * 1.5; // Le pointeur est en haut (270 degrés)
  const jackpotAngle = (2 * Math.PI) / jackpots.length;
  const sectionAngle = jackpotAngle / prix.length;

  let currentAngle = (pointerAngle - angle) % (2 * Math.PI);
  if (currentAngle < 0) currentAngle += 2 * Math.PI;

  const jackpotIndex = Math.floor(currentAngle / jackpotAngle);
  const prizeIndex = Math.floor((currentAngle % jackpotAngle) / sectionAngle);

  return {
    jackpot: jackpots[jackpotIndex],
    prize: prix[prizeIndex]
  };
}

// eslint-disable-next-line no-unused-vars
function startWheel() {
  const startTime = Date.now();
  animate(startTime, INITIAL_SPEED);
}

centerImage.onload = drawWheel;


const countdownNumber = document.getElementById('countdown-number');
const countdownProgress = document.querySelector('.countdown-progress');
let timeLeft = 60;

function updateCountdown() {
  if (timeLeft > 0) {
    countdownNumber.textContent = timeLeft;
    const progress = (60 - timeLeft) / 60;
    const dashoffset = 283 * (1 - progress);
    countdownProgress.style.strokeDashoffset = dashoffset;
    timeLeft--;
    setTimeout(updateCountdown, 1000);
  } else {
    countdownNumber.textContent = "0";
    countdownProgress.style.strokeDashoffset = 0;
  }
}

socket.on('connect', () => {
  console.log('Connected to server');
  // startWheel()
  updateCountdown();
});
