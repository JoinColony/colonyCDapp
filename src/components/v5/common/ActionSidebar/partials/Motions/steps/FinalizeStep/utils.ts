import { ColonyActionType } from '~gql';
import { type MotionAction } from '~types/motions.ts';
import { invalidateMemberQueries } from '~utils/members.ts';

export const handleMotionFinalized = (action: MotionAction) => {
  switch (action.type) {
    case ColonyActionType.AddVerifiedMembersMotion: {
      if (action.members) {
        invalidateMemberQueries(action.members, action.colonyAddress, true);
      }
      break;
    }
    case ColonyActionType.RemoveVerifiedMembersMotion: {
      if (action.members) {
        invalidateMemberQueries(action.members, action.colonyAddress, false);
      }
      break;
    }
    default: {
      break;
    }
  }
};
