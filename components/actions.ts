import { Socket } from "socket.io";


// Joinning rooms
export function joinRoom(user: string, user_id: number, room: string, socket: Socket) {
    socket.join(room);
    socket.broadcast.in(room).emit('room-joined', user_id);
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}