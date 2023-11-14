import { CREATE_COLONY_ROUTE_BASE } from '~routes';

import useAppContext from './useAppContext';

const useInvitationLink = () => {
  const { user } = useAppContext();
  const invitationCode = user?.privateBetaInviteCode?.id;
  const inviteLink = `${window.location.host}${CREATE_COLONY_ROUTE_BASE}/${invitationCode}`;

  return inviteLink;
};

export default useInvitationLink;
