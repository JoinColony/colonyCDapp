import { useNavigate } from 'react-router-dom';

import { useAppContext } from '~context/AppContext/AppContext.ts';
import { CREATE_COLONY_ROUTE_BASE, LANDING_PAGE_ROUTE } from '~routes';

export const useCreateColonyRedirect = () => {
  const { user } = useAppContext();

  const navigate = useNavigate();

  const handleCreateColonyRedirect = () => {
    const shareableInvites = user?.privateBetaInviteCode?.shareableInvites;
    const inviteCode = user?.privateBetaInviteCode?.id;

    const createNewColonyButtonRoute =
      shareableInvites && shareableInvites > 0
        ? `${CREATE_COLONY_ROUTE_BASE}/${inviteCode}`
        : LANDING_PAGE_ROUTE;

    navigate(createNewColonyButtonRoute);
  };

  return handleCreateColonyRedirect;
};
