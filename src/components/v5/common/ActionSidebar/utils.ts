import { apolloClient } from '~apollo';
import { type Action } from '~constants/actions.ts';
import { SearchActionsDocument } from '~gql';
import { type DecisionMethod } from '~types/actions.ts';
import { type ColonyAction, ColonyActionType } from '~types/graphql.ts';
import { isQueryActive } from '~utils/isQueryActive.ts';
import {
  clearContributorsAndRolesCache,
  updateContributorVerifiedStatus,
} from '~utils/members.ts';

export const translateAction = (action?: Action) => {
  const actionName = action
    ?.split('-')
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join('');

  return `actions.${actionName}`;
};

export const handleMotionCompleted = (action: ColonyAction) => {
  switch (action.type) {
    case ColonyActionType.AddVerifiedMembersMotion:
    case ColonyActionType.AddVerifiedMembersMultisig: {
      if (action.members) {
        updateContributorVerifiedStatus(
          action.members,
          action.colonyAddress,
          true,
        );
      }
      break;
    }
    case ColonyActionType.RemoveVerifiedMembersMotion:
    case ColonyActionType.RemoveVerifiedMembersMultisig: {
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
      if (isQueryActive('SearchActions')) {
        apolloClient.refetchQueries({ include: [SearchActionsDocument] });
      }
      break;
    }
    case ColonyActionType.SetUserRolesMotion:
    case ColonyActionType.SetUserRolesMultisig: {
      clearContributorsAndRolesCache();
      break;
    }
    default: {
      break;
    }
  }
};

export const createUnsupportedDecisionMethodFilter =
  (unsupportedDecisionMethods: DecisionMethod[] = []) =>
  ({ value }: { value: DecisionMethod }) =>
    !unsupportedDecisionMethods.includes(value);
