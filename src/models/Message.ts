import { messages } from "@prisma/client";
import Discussion from './Discussion';
import { MessageOwners } from "./MessageOwner";


type Message = messages & {
    discussion: Discussion
    users: MessageOwners
}

export type Messages = Message[]

export default Message
