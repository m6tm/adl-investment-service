import { Socket } from "socket.io";

export default function groupCall(socket: Socket, room: string) {
        ['audio', 'video'].forEach(type => {
                socket.on(`group call request - ${type}`, data => {
                        socket.in(room).emit(`group call request sent - ${type}`, data)
                })
                socket.on(`group call answer - ${type}`, data => {
                        socket.in(room).emit(`group call answer received - ${type}`, data)
                })
                socket.on(`send credentiels - ${type}`, data => {
                        socket.in(room).emit(`send credentiels received - ${type}`, data, socket.id)
                })
                socket.on(`send credentiels acknowledge - ${type}`, (user_credentials: { user_id: number, stream_id: string }, new_client_socket_id: string) => {
                        socket.to(new_client_socket_id).emit(`send credentiels acknowledge received - ${type}`, user_credentials)
                })
                socket.on(`on microphone changed state - ${type}`, data => {
                        socket.in(room).emit(`on microphone changed state received - ${type}`, data)
                })
        })
        socket.on(`decline call request`, () => {
            socket.in(room).emit(`decline call request received`);
        });
}