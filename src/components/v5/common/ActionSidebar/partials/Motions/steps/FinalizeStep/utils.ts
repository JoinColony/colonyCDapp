import { ColonyActionType } from '~gql';
import { type MotionAction } from '~types/motions.ts';
import { invalidateMemberQueries } from '~utils/members.ts';

export const handleMotionFinalized = (action: MotionAction) => {
  switch (action.type) {
    case ColonyActionType.AddVerifiedMembersMotion:
    case ColonyActionType.RemoveVerifiedMembersMotion: {
      if (action.members) {
        // no need to await this, it can happen in the background
        invalidateMemberQueries(action.members, action.colonyAddress);
      }
      break;
    }
    default: {
      break;
    }
  }
};
