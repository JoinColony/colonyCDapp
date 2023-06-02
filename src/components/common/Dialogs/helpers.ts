import { Member } from '~types';
import { notNull, notUndefined } from '~utils/arrays';

export const extractUsersFromColonyMemberData = (
  members: Member[] | null | undefined,
) =>
  members
    ?.map((member) => member.user)
    .filter(notNull)
    .filter(notUndefined) || [];
