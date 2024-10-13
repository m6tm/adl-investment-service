import { type Socket } from "socket.io";
import { app } from '..';
import { connectContext } from '../components/connectContext';
import { getCorsOrigin, getNextDrawDate, startDrawing } from './tools/utils';
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { ConnectionSessionManager } from '../components/actions';
import cron from 'node-cron';
import WebSocket from 'ws';

dotenv.config()
var debug = require('debug')('kanban-websocket-serve:server');
var http = require('http');
const prisma = new PrismaClient()
const connexionSessionManager = new ConnectionSessionManager()

var port = process.env.PORT || '3500'
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);
var io = require('socket.io')(server, {
  cors: {
    origin: getCorsOrigin(),
    methods: ["GET", "POST"]
  },
});
const wss = new WebSocket.Server({ server, path: '/streaming' });

wss.on('connection', (ws) => {
  console.log('Client connecté');

  ws.on('message', (message) => {
    // Diffusez le message à tous les clients connectés
    console.log(wss.clients.size);
    wss.clients.forEach(client => {
      console.log(message);
      client.send(message);
      // if (client !== ws && client.readyState === WebSocket.OPEN) {
      // }
    });
  });

  ws.on('error', (error) => {
      console.error('Erreur WebSocket :', error);
  });

  ws.on('close', (code, reason) => {
      console.log(`Connexion fermée : Code=${code}, Raison=${reason}`);
  });
});

/**
 * Listen on provided port, on all network interfaces.
 */


async function main() {
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.log('Listening on ', `http://localhost:${addr.port}`);
}

io.sockets.on('connection', (socket: Socket) => {
  cron.schedule('0 19 1-7 * 1', () => startDrawing(socket), {
    timezone: 'Europe/London'
  });
  
  cron.schedule('0 19 * * 3', () => startDrawing(socket), {
    timezone: 'Europe/London'
  });
  
  cron.schedule('0 19 * * 6', () => startDrawing(socket), {
    timezone: 'Europe/London'
  });
  
  cron.schedule('39 12 * * 5', () => startDrawing(socket), {
    timezone: 'Europe/London'
  });

  socket.on('get next draw date', async () => {
    const angles = await prisma.win_wheel_angle_histories.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 20
    })
    socket.emit('send next draw date', JSON.stringify({
      nextDrawinDate: getNextDrawDate(),
      angles: angles.map((angle) => Number(angle.angle))
    }))
  })

  socket.on('get draw result', async (result: string) => {
    const data: { angle: number; winner: string; prize: string } = JSON.parse(result)
    await prisma.win_wheel_angle_histories.create({
      data: {
        angle: data.angle,
      }
    })
  })

  connexionSessionManager.socket = socket;
  connectContext(socket, connexionSessionManager)
});

export { prisma, connexionSessionManager }