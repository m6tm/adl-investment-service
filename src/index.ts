import { type Socket } from "socket.io";
import { app } from '..';
import { connectContext } from '../components/connectContext';
import { getCorsOrigin } from './tools/utils';
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { ConnectionSessionManager } from '../components/actions';

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
  connexionSessionManager.socket = socket;
  connectContext(socket, connexionSessionManager)
});

export { prisma }