import { apolloClient } from '~apollo';
import { ColonyActionType, SearchActionsDocument } from '~gql';
import { type MotionAction } from '~types/motions.ts';
import { updateContributorVerifiedStatus } from '~utils/members.ts';

export const handleMotionFinalized = (action: MotionAction) => {
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
    case ColonyActionType.CreateDecisionMotion: {
      apolloClient.refetchQueries({ include: [SearchActionsDocument] });

      break;
    }
    default: {
      break;
    }
  }
};
