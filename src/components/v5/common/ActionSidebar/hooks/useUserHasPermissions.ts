import { ColonyRole } from '@colony/colony-js';
import {
  useAppContext,
  useColonyContext,
  useColonyHasReputation,
  useDialogActionPermissions,
  useEnabledExtensions,
  useTransformer,
} from '~hooks';
import { Colony } from '~types';
import { getAllUserRoles } from '~transformers';

export const useUserHasPermissions = (): boolean => {
  const { isVotingReputationEnabled } = useEnabledExtensions();
  const { colony } = useColonyContext();
  const { wallet } = useAppContext();

  const requiredRoles: ColonyRole[] = [ColonyRole.Root];

  const hasReputation = useColonyHasReputation(colony?.colonyAddress as string);

  const allUserRoles = useTransformer(getAllUserRoles, [
    colony,
    wallet?.address,
  ]);

  const [hasRoles] = useDialogActionPermissions(
    colony as Colony,
    isVotingReputationEnabled,
    requiredRoles,
    allUserRoles,
    hasReputation,
  );

  return hasRoles || isVotingReputationEnabled;
};
