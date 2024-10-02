import { type Socket } from "socket.io";
import { type ConnectionSessionManager, joinRoom } from './actions'
import groupCall from './GroupCallEvents'
import discussionEvents from './DiscussionEvents'
import { AppSocketType } from "../src/socket-type";

/**
 * Run when some client is connected
 */
export const connectContext = (socket: Socket, sessionManager: ConnectionSessionManager) => {
    //  When someone logs in
    socket.on('connected', async (data: AppSocketType) => {
        sessionManager.connectClient(data)
        // data.discussions.forEach(discussion => {
        //     joinRoom(`user_${data.user_id}`, data.user_id, discussion, socket)

        //     discussionEvents(socket, discussion)

        //     /**
        //      * Group Call Section
        //      */
        //     groupCall(socket, discussion)
        // })

    })
    socket.on('disconnect', (reason) => {
        sessionManager.disconnectClient(socket.id)
    });
}