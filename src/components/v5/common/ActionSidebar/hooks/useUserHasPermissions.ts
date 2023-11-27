import { ColonyRole } from '@colony/colony-js';
import {
  useAppContext,
  useColonyContext,
  useColonyHasReputation,
  useDialogActionPermissions,
  useEnabledExtensions,
  useTransformer,
} from '~hooks';
import { getAllUserRoles } from '~transformers';

export const useUserHasPermissions = (): boolean => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const hasReputation = useColonyHasReputation(colony?.colonyAddress);
  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const [hasRoles] = useDialogActionPermissions(
    colony,
    isVotingReputationEnabled,
    requiredRoles,
    allUserRoles,
    hasReputation,
  );

  return hasRoles || isVotingReputationEnabled;
};
