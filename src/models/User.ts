import { users } from "@prisma/client"
import DiscussionOwner from "./DiscussionOwner"

type UserModel = users & {
    discussions: DiscussionOwner
}

export default UserModel 