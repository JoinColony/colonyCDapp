import { useEffect, useState } from 'react';

import { ColonyActionType } from '~gql';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { normalizeRolesForAction } from '~utils/colonyActions.ts';

export const useBuildRedoEnabledActionsMap = ({
  colonyActions = [],
  colonyActionsLoading,
}: {
  colonyActions?: ActivityFeedColonyAction[];
  colonyActionsLoading: boolean;
}) => {
  const [redoEnabledActionsMap, setRedoEnabledActionsMap] = useState<
    Record<ActivityFeedColonyAction['transactionHash'], boolean>
  >({});

  // I'm using simple stringification to help the useEffect hook with shallow comparison and avoid unnecessary rerenders
  const stringifiedColonyActions = JSON.stringify(colonyActions);

  useEffect(() => {
    const buildRedoEnabledActionsMap = () => {
      const originalColonyActions = JSON.parse(
        stringifiedColonyActions,
      ) as typeof colonyActions;

      if (colonyActionsLoading || originalColonyActions.length === 0) {
        return;
      }

      const updatedActionsMap: typeof redoEnabledActionsMap = {};

      originalColonyActions.forEach((colonyAction) => {
        switch (
          colonyAction.type as ColonyActionType | ExtendedColonyActionType
        ) {
          case ColonyActionType.SetUserRoles:
          case ColonyActionType.SetUserRolesMotion:
          case ColonyActionType.SetUserRolesMultisig: {
            const { roles, motionData, multiSigData } = colonyAction;

            const normalizedRoles = normalizeRolesForAction(roles ?? {});
            const isRemovingRoles =
              normalizedRoles.filter((role) => role.setTo).length === 0;

            const isMotion = !!motionData;
            const isMultiSig = !!multiSigData;

            const shouldShowRedoItem =
              !isRemovingRoles ||
              (isMotion && !motionData?.isFinalized) ||
              (isMultiSig && !multiSigData?.isExecuted);

            updatedActionsMap[colonyAction.transactionHash] =
              shouldShowRedoItem;

            break;
          }

          case ColonyActionType.AddVerifiedMembers:
          case ColonyActionType.AddVerifiedMembersMotion:
          case ColonyActionType.AddVerifiedMembersMultisig:
          case ColonyActionType.CreateDecisionMotion:
          case ColonyActionType.ColonyEdit:
          case ColonyActionType.ColonyEditMotion:
          case ColonyActionType.ColonyEditMultisig:
          case ColonyActionType.CreateDomain:
          case ColonyActionType.CreateDomainMotion:
          case ColonyActionType.CreateDomainMultisig:
          case ColonyActionType.EditDomain:
          case ColonyActionType.EditDomainMotion:
          case ColonyActionType.EditDomainMultisig:
          case ColonyActionType.RemoveVerifiedMembers:
          case ColonyActionType.RemoveVerifiedMembersMotion:
          case ColonyActionType.RemoveVerifiedMembersMultisig:
          case ColonyActionType.UnlockToken:
          case ColonyActionType.UnlockTokenMotion:
          case ColonyActionType.UnlockTokenMultisig:
          case ColonyActionType.VersionUpgrade:
          case ColonyActionType.VersionUpgradeMotion:
          case ColonyActionType.VersionUpgradeMultisig:
          case ColonyActionType.ManageTokens:
          case ColonyActionType.ManageTokensMotion:
          case ColonyActionType.ManageTokensMultisig:
          case ExtendedColonyActionType.UpdateColonyObjective:
          case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
          case ExtendedColonyActionType.UpdateColonyObjectiveMultisig:
            updatedActionsMap[colonyAction.transactionHash] = false;
            break;

          default:
            updatedActionsMap[colonyAction.transactionHash] = true;
        }
      });

      setRedoEnabledActionsMap(updatedActionsMap);
    };

    buildRedoEnabledActionsMap();
  }, [colonyActionsLoading, stringifiedColonyActions]);

  return redoEnabledActionsMap;
};
