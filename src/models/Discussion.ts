import { discussions } from '@prisma/client'
import { DISCUSSION_TYPE } from '../enums/discussion'
import { DiscussionOwners } from './DiscussionOwner'
import { Messages } from './Message'

type Discussion = discussions & {
    owners: DiscussionOwners
    messages: Messages
}

export default Discussion