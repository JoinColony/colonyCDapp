import { notNull, notUndefined } from '~utils/arrays';

export const extractUsersFromColonyMemberData = (
  members: any[] | null | undefined,
) =>
  members
    ?.map((member) => member.user)
    .filter(notNull)
    .filter(notUndefined) || [];
