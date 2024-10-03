import { Socket, type Socket as TSocket } from "socket.io";
import { AppSocketType, RoomCollectionType, SocketSessionsType } from "../src/socket-type";
import { prisma } from "../src";
import UserModel from './../src/models/User';


// Joinning rooms
export function joinRoom(user_id: number, room: string, socket: Socket) {
    socket.join(room);
    socket.broadcast.in(room).emit('room-joined', user_id);
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export class ConnectionSessionManager {
    private _socket: TSocket;
    sessions: SocketSessionsType = {};
    rooms: RoomCollectionType = new Map();

    set socket(socket: TSocket) {
        this._socket = socket;
    }

    async connectClient(data: AppSocketType) {
        const user: UserModel = await prisma.users.findFirst({
            where: {
                id: data.user_id
            }
        }) as any;
        
        if (user) {
            this.sessions[data.client_socket_id] = { ...data, user };
            this.createUserRelations(user);

            data.discussions.forEach(room => {
                const roomExists = this.rooms.get(room);
                this.rooms.set(room, {
                    room,
                    users: roomExists ? [...roomExists.users, user.id] : [user.id]
                });

                joinRoom(Number(user.id), room, this._socket)
            });
        }
    }

    disconnectClient(client_socket_id: string) {
        delete this.sessions[client_socket_id];
    }

    createUserRelations = async (user: UserModel) => {
        const _user = Object.assign({}, user);
        _user.discussions = (await prisma.discussion_owners.findMany({
            where: {
                user_id: user.id
            }
        })) as any

        _user.discussions.forEach(async discussion => {
            discussion.discussion = await prisma.discussions.findFirst({
                where: {
                    id: discussion.discussion_id
                }
            }) as any
            discussion.discussion.owners = await prisma.discussion_owners.findMany({
                where: {
                    discussion_id: discussion.discussion_id
                }
            }) as any
            discussion.discussion.messages = await prisma.messages.findMany({
                where: {
                    discussion_id: discussion.discussion_id
                }
            }) as any
            console.log(discussion.discussion);
        })

        // console.log(_user);
    }
}