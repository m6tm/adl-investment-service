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
            const user_with_discussions_reletion = await this.createUserRelations(user);
            user_with_discussions_reletion.password = ""

            data.discussions.forEach(room => {
                const roomExists = this.rooms.get(room);
                this.rooms.set(room, {
                    room,
                    users: roomExists ? [...roomExists.users, user.id] : [user.id]
                });

                joinRoom(Number(user.id), room, this._socket)
            });
            this._socket.emit('get my discussions', JSON.stringify(user_with_discussions_reletion, (_, value) =>
                typeof value === 'bigint' ? value.toString() : value
            ));
        }
    }

    disconnectClient(client_socket_id: string) {
        if (!this.sessions[client_socket_id]) return
        this._socket.in(client_socket_id).emit('user disconnected', this.sessions[client_socket_id].user_id);
        this.sessions[client_socket_id].discussions.forEach(room => {
            const roomExists = this.rooms.get(room);
            if (roomExists) {
                roomExists.users = roomExists.users.filter(id => id !== this.sessions[client_socket_id].user.id);
                this.rooms.set(room, roomExists);
            }
        });
        delete this.sessions[client_socket_id];
    }

    createUserRelations = async (user: UserModel) => {
        return await prisma.users.findFirst({
            where: {
                id: user.id
            },
            include:{
                discussion_owners: {
                    include: {
                        discussions: {
                            include: {
                                messages: {
                                    include: {
                                        message_owners: {
                                            include: {
                                                users: {
                                                    select: {
                                                        id: true,
                                                        name: true,
                                                        email: true,
                                                        country_id: true,
                                                        pseudo: true,
                                                        first_name: true,
                                                        referal_link: true,
                                                        birth_date: true,
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                discussion_owners: {
                                    include: {
                                        users: true,
                                    }
                                },
                            }
                        }
                    }
                },
            }
        });
    }
}