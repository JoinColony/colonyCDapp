import { useEffect, useState } from 'react';

import { ColonyActionType, useGetColonyHistoricRoleRolesLazyQuery } from '~gql';
import { type ActivityFeedColonyAction } from '~hooks/useActivityFeed/types.ts';
import { ExtendedColonyActionType } from '~types/actions.ts';
import { getHistoricRolesDatabaseId } from '~utils/databaseId.ts';
import { transformActionRolesToColonyRoles } from '~v5/common/CompletedAction/partials/SetUserRoles/utils.ts';

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

  const [getHistoricRoles] = useGetColonyHistoricRoleRolesLazyQuery({
    fetchPolicy: 'cache-and-network',
  });

  // I'm using simple stringification to help the useEffect hook with shallow comparison and avoid unnecessary rerenders
  const stringifiedColonyActions = JSON.stringify(colonyActions);

  useEffect(() => {
    const buildRedoEnabledActionsMap = async () => {
      const originalColonyActions = JSON.parse(
        stringifiedColonyActions,
      ) as typeof colonyActions;

      if (colonyActionsLoading || originalColonyActions.length === 0) {
        return;
      }

      const updatedActionsMap: typeof redoEnabledActionsMap = {};
      const promises: Promise<void>[] = [];

      originalColonyActions.forEach((colonyAction) => {
        switch (
          colonyAction.type as ColonyActionType | ExtendedColonyActionType
        ) {
          case ColonyActionType.SetUserRoles:
          case ColonyActionType.SetUserRolesMotion:
          case ColonyActionType.SetUserRolesMultisig: {
            const {
              blockNumber,
              colonyAddress,
              fromDomain,
              recipientAddress,
              rolesAreMultiSig,
              roles,
              motionData,
              multiSigData,
            } = colonyAction;

            const promise = async () => {
              const result = await getHistoricRoles({
                variables: {
                  id: getHistoricRolesDatabaseId({
                    blockNumber,
                    colonyAddress,
                    nativeId: fromDomain?.nativeId,
                    recipientAddress,
                    isMultiSig: rolesAreMultiSig,
                  }),
                },
              });

              const dbPermissionsNew = transformActionRolesToColonyRoles(
                result?.data?.getColonyHistoricRole || roles,
              );

              const isMotion = !!motionData;
              const isMultiSig = !!multiSigData;

              const shouldShowRedoItem =
                !!dbPermissionsNew.length ||
                (isMotion && !motionData?.isFinalized) ||
                (isMultiSig && !multiSigData?.isExecuted);

              updatedActionsMap[colonyAction.transactionHash] =
                shouldShowRedoItem;
            };

            promises.push(promise());
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
          case ExtendedColonyActionType.UpdateColonyObjective:
          case ExtendedColonyActionType.UpdateColonyObjectiveMotion:
          case ExtendedColonyActionType.UpdateColonyObjectiveMultisig:
            updatedActionsMap[colonyAction.transactionHash] = false;
            break;

          default:
            updatedActionsMap[colonyAction.transactionHash] = true;
        }
      });

      await Promise.all(promises);

      setRedoEnabledActionsMap(updatedActionsMap);
    };

    buildRedoEnabledActionsMap();
  }, [colonyActionsLoading, getHistoricRoles, stringifiedColonyActions]);

  return redoEnabledActionsMap;
};
