import { messages } from "@prisma/client";
import Discussion from './Discussion';


type Message = messages & {
    discussion: Discussion
}

export type Messages = Message[]

export default Message
