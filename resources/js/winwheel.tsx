
declare global {
  interface Window {
    io: () => any,
    moment: any,
  }
}

const moment = window.moment;

const socket: any = window.io();
let connexion_established = false;
let angle_history: number[] = []

function random_rang(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function define_safty_angle() {
  let randomAngle = random_rang(0, 360)
  while (randomAngle % 10 == 0 || angle_history.includes(randomAngle)) {
    randomAngle = random_rang(0, 360)
  }
  return randomAngle + 20
}

const canvas = document.getElementById('winwheelCanvas')! as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
const innerRadius = 80;
const centerRadius = 50;
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let angle = define_safty_angle();
let initialAngle = angle;

const INITIAL_SPEED = 0.2;
const DECELERATION_RATE = 0.99;
const MIN_SPEED = 0.0001;
const ANIMATION_DURATION = 60000;

const prix = [
  { id: 'p1', label: '$100' },
  { id: 'p2', label: '$250' },
  { id: 'p3', label: '$500' },
  { id: 'p4', label: '$1.000' },
  { id: 'p5', label: '$2.000' },
  { id: 'p6', label: '$5.000' },
  { id: 'p7', label: '$10.000' },
  { id: 'p8', label: '$25.000' },
  { id: 'p9', label: '$50.000' },
  { id: 'p10', label: '$100.000' },
  { id: 'p11', label: '$250.000' },
  { id: 'p12', label: '$500.000' },
  { id: 'p13', label: '$1.000.000' },
];

type Jackpot = {
  id: string;
  label: string;
  bgPriceColor: string;
  borderColor: string;
  textColor: string;
  bgTextColor: string;
  borderSize: number;
};

let jackpots: Array<Jackpot> = [
  { id: 'j1', label: '$100.000', bgPriceColor: '#e344d1', borderColor: '#fff', textColor: '#e344d1', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j2', label: '$250.000', bgPriceColor: '#5588c5', borderColor: '#fff', textColor: '#5588c5', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j3', label: '$500.000', bgPriceColor: '#7340c9', borderColor: '#fff', textColor: '#7340c9', bgTextColor: '#fff', borderSize: 2 },
  { id: 'j4', label: '$1.000.000', bgPriceColor: '#e75d6b', borderColor: '#fff', textColor: '#e75d6b', bgTextColor: '#fff', borderSize: 2 },
];
const JACKPOT_BG_COLOR = '#dddddd';

const centerImage = new Image();
centerImage.src = `/images/Roue_ADL.png`;

function drawWheel() {
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas!.width, canvas.height);

  const jackpotAngle = (2 * Math.PI) / jackpots.length;
  const newOuterRadius = 250; // Increased from 200 to 250

  jackpots.forEach((jackpot, jackpotIndex) => {
    const sectionAngle = jackpotAngle / prix.length;
    prix.forEach((section, sectionIndex) => {
      const startAngle = angle + jackpotAngle * jackpotIndex + sectionAngle * sectionIndex;
      const endAngle = startAngle + sectionAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, newOuterRadius, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = jackpot.bgPriceColor;
      ctx.fill();
      ctx.strokeStyle = jackpot.borderColor;
      ctx.lineWidth = jackpot.borderSize;
      ctx.stroke();
      ctx.closePath();

      const textAngle = startAngle + sectionAngle / 1.3;
      ctx.save();
      ctx.translate(centerX + Math.cos(textAngle) * (newOuterRadius * .6), centerY + Math.sin(textAngle) * (newOuterRadius * .6));
      ctx.rotate(textAngle);
      ctx.fillStyle = jackpot.bgTextColor;
      ctx.font = 'bold 15px Arial';
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
  ctx.translate(centerX, centerY - newOuterRadius - 20);
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
    if (connexion_established) socket.emit('get draw result', JSON.stringify({
      winner: winner.jackpot.label,
      prize: winner.prize.label,
      angle: initialAngle,
    }));
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



const countdownNumber = document.getElementById('countdown-number')!;
// eslint-disable-next-line no-unused-vars
function updateCountdown(date: string) {
  let timer = setInterval(() => {
    const now = moment()
    const nextDrawDate = moment(date)
    const diff = nextDrawDate.diff(now)
    const duration = moment.duration(diff)
    const duration_data = {
      days: duration.days() > 9 ? duration.days() : `0${duration.days()}`,
      hours: duration.hours() > 9 ? duration.hours() : `0${duration.hours()}`,
      minutes: duration.minutes() > 9 ? duration.minutes() : `0${duration.minutes()}`,
      seconds: duration.seconds() > 9 ? duration.seconds() : `0${duration.seconds()}`
    }
    countdownNumber.textContent = `${duration_data.days} jours ${duration_data.hours} heures ${duration_data.minutes} minutes ${duration_data.seconds} secondes`
    if (diff <= 0) {
      clearInterval(timer)
      startWheel()
    }
  }, 1000);
}

socket.on('connect', () => {
  connexion_established = true
  console.log('Connected to server');
  socket.emit('get next draw date')
  socket.on('send next draw date', (data: any) => {
    data = JSON.parse(data)
    if ('angles' in data) {
      angle_history = data.angles
      angle = define_safty_angle()
      initialAngle = angle
      drawWheel()
    }
    startWheel()
    if ('nextDrawinDate' in data) updateCountdown(data.nextDrawinDate)
  })
});

async function socketRequest(emit: String, on: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    socket.emit(emit, (data: any) => {
      resolve(true)
    })
  })
}

export {}
