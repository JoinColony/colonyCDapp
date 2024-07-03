import { ColonyActionType } from '~gql';
import { type ColonyAction } from '~types/graphql.ts';
import { updateContributorVerifiedStatus } from '~utils/members.ts';

export const handleMultiSigFinalized = (action: ColonyAction) => {
  switch (action.type) {
    case ColonyActionType.AddVerifiedMembersMotion: {
      if (action.members) {
        updateContributorVerifiedStatus(
          action.members,
          action.colonyAddress,
          true,
        );
      }
      break;
    }
    case ColonyActionType.RemoveVerifiedMembersMotion: {
      if (action.members) {
        updateContributorVerifiedStatus(
          action.members,
          action.colonyAddress,
          false,
        );
      }
      break;
    }
    default: {
      break;
    }
  }
};
