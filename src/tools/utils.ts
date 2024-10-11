import { type Socket } from "socket.io";
import { APP_STATUS } from "../enums/app_env";
import clients from '../clients.json'
import multer from 'multer';
import path from 'path';
import moment from 'moment-timezone'
import { connexionSessionManager } from "..";

type AppEnv = {
        APP_KEY: string
        APP_ENV: APP_STATUS
}

export function getEnv(): AppEnv {
        return process.env as AppEnv;
}

export function getCorsOrigin(): string[] {
        const URI = getEnv().APP_ENV == APP_STATUS.DEV ? clients.offline.URI : clients.online.URI
        return URI;
}

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les fichiers seront stockés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier avec un timestamp
  }
});

const upload = multer({ storage: storage });

export const uploader = upload;

export function getNextDrawDate(): Date {
  const now = moment().tz('GMT')
  const drawDays = [1, 3, 6]; // Monday, Wednesday, Saturday

  let nextDraw = moment.tz('GMT')

  // Set the time to 19:00 GMT
  nextDraw.hour(19).minute(0).second(0).millisecond(0)

  // If the current time is after 19:00, move to the next day
  if (now.isAfter(nextDraw)) {
    nextDraw.add(1, 'day')
  }

  // Find the next draw day
  while (!drawDays.includes(nextDraw.day())) {
    nextDraw.add(1, 'day')
  }

  return nextDraw.toDate()
}

export function getNextDrawDateString(): string {
  const nextDrawDate = getNextDrawDate()
  return nextDrawDate.toISOString()
}

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getNextDrawTimeLeft(): TimeLeft {
  const nextDrawDate = moment(getNextDrawDate())
  const now = moment()
  const diff = nextDrawDate.diff(now)

  const duration = moment.duration(diff)

  return {
    days: duration.days(),
    hours: duration.hours(),
    minutes: duration.minutes(),
    seconds: duration.seconds()
  }
}

export function startDrawing(socket: Socket): void {
}
