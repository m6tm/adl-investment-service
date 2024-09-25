import { Socket } from "socket.io";

export default function discussionEvents(socket: Socket, discussion: string) {
    // Audio call section
    socket.on('call request - audio', data => { // User request call
        socket.in(discussion).emit('call-request', data)
    })
    socket.on('call answer - audio', signal => {
        socket.in(discussion).emit('call answer received - audio', signal)
    })
    socket.on('call declined - audio', () => {
        socket.in(discussion).emit('decline call request received - audio')
    })

    // Video call section
    socket.on('call request - video', data => { // User request call
        socket.in(discussion).emit('call-request', data)
    })
    socket.on('call answer - video', signal => {
        socket.in(discussion).emit('call answer received - video', signal)
    })
    socket.on('toggle video state event', muted => {
        socket.in(discussion).emit('toggle video state', muted)
    })
    socket.on('call declined - video', () => {
        socket.in(discussion).emit('decline call request received - video')
    })

    // Message section
    socket.on('writting is pending', () => {
        socket.in(discussion).emit('writting is event received')
    })
    socket.on('message sent', () => {
        socket.in(discussion).emit('message sent - aknowledge')
    })
    socket.on('message - aknowledge', () => {
        socket.in(discussion).emit('message aknowledge - received')
    })
    socket.on('thread has been pinned to top', () => {
        socket.in(discussion).emit('thread has been pinned to top - transmission')
    })
    socket.on('discussion has been deleted', () => {
        socket.in(discussion).emit('discussion has been deleted - transmission')
    })
    socket.on('block/unblock chat', () => {
        socket.in(discussion).emit('block/unblock chat - transmission')
    })
}