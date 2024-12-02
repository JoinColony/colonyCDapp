import { isEqual } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import useBaseUrl from '~hooks/useBaseUrl.ts';
import { useGetColoniesMembersCount } from '~hooks/useGetColoniesMembersCount.ts';
import usePrevious from '~hooks/usePrevious.ts';
import { CREATE_COLONY_ROUTE_BASE } from '~routes';
import { getLastWallet } from '~utils/autoLogin.ts';

export type AvailableColonies = {
  address: string;
  avatar: string | undefined;
  displayName: string | undefined;
  name: string;
  membersCount: number | undefined;
}[];

export const useLandingPage = () => {
  const {
    canInteract,
    joinedColonies,
    joinedColoniesLoading,
    user,
    connectWallet,
    wallet,
    walletConnecting,
    userLoading,
  } = useAppContext();

  const navigate = useNavigate();

  const hasShareableInvitationCode =
    !!user?.privateBetaInviteCode?.shareableInvites;

  const remainingInvitations =
    user?.privateBetaInviteCode?.shareableInvites ?? 0;

  const invitationCode = user?.privateBetaInviteCode?.id;

  const baseInviteLink = `${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inviteLink = useBaseUrl(baseInviteLink);

  const onCreateColony = () => {
    navigate(baseInviteLink);
  };
  const { colonyMemberCounts, loading: membersLoading } =
    useGetColoniesMembersCount(
      joinedColonies.map((item) => item.colonyAddress),
      {
        or: [{ hasPermissions: { eq: true } }, { hasReputation: { eq: true } }],
      },
    );

  const availableColonies: AvailableColonies = joinedColonies.map(
    ({ metadata, colonyAddress, name }, index) => ({
      address: colonyAddress,
      avatar: metadata?.avatar
        ? metadata?.thumbnail ?? metadata?.avatar
        : undefined,
      displayName: metadata?.displayName,
      name,
      membersCount: colonyMemberCounts[index],
    }),
  );

  const previousJoinedColonies = usePrevious(joinedColonies);

  const joinedColoniesFirstTimeLoading =
    !isEqual(previousJoinedColonies, joinedColonies) && joinedColoniesLoading;

  const isContentLoading =
    (userLoading || joinedColoniesFirstTimeLoading || membersLoading) &&
    !!wallet;

  return {
    canInteract:
      canInteract && (hasShareableInvitationCode || !!joinedColonies.length),
    connectWallet,
    wallet,
    isLoading: walletConnecting,
    isContentLoading,
    onCreateColony,
    remainingInvitations,
    inviteLink,
    availableColonies,
    hasShareableInvitationCode,
    hasWalletConnected: !!getLastWallet(),
  };
};
