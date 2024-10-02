
import { users } from '@prisma/client';
export type AppSocketType = {
    user_id: number
    discussions: Array<string>
    client_socket_id: string
}

export type TAppSocket = AppSocketType & {
    user: users
}

export type SocketSessionsType = {
    [client_socket_id: string]: TAppSocket
}

export type RoomType = {
    room: string
    users: Array<bigint>
}

export type RoomCollectionType = Map<string, RoomType>
