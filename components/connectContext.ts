import { Socket } from "socket.io";
import { joinRoom } from './actions'
import groupCall from './GroupCallEvents'
import discussionEvents from './DiscussionEvents'

let client_socket_id!: string

/**
 * Run when some client is connected
 */
export const connectContext = (socket: Socket) => {
    //  When someone logs in
    socket.on('connected', async (data: { user_id: number, discussions: Array<string>, client_socket_id: string }) => {
        
        // client_socket_id = data.client_socket_id
        // data.discussions.forEach(discussion => {
        //     joinRoom(`user_${data.user_id}`, data.user_id, discussion, socket)

        //     discussionEvents(socket, discussion)

        //     /**
        //      * Group Call Section
        //      */
        //     groupCall(socket, discussion)
        // })
    })
}