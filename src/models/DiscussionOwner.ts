import { discussion_owners } from '@prisma/client';
import UserModel from './User';
import Discussion from './Discussion';

type DiscussionOwner = discussion_owners & {
    user: UserModel
    discussion: Discussion 
}

export type DiscussionOwners = DiscussionOwner[]

export default DiscussionOwner