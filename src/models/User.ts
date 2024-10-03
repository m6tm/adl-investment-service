import { users } from "@prisma/client"
import { DiscussionOwners } from "./DiscussionOwner"

type UserModel = users & {
    discussions: DiscussionOwners
}

export default UserModel 