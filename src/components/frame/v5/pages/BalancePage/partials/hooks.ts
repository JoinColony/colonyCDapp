import { useNavigate } from 'react-router-dom';
import { Id } from '@colony/colony-js';
import { getDomainOptions } from '~utils/domains';
import { notNull } from '~utils/arrays';
import { pipe, mapPayload, withMeta } from '~utils/actions';
import { ActionTypes } from '~redux/index';
import { useColonyContext, useEnabledExtensions } from '~hooks';
import { getTransferFundsDialogPayload } from '~common/Dialogs/TransferFundsDialog/helpers';

export const useTransferFunds = () => {
  const { colony } = useColonyContext();
  const navigate = useNavigate();
  const enabledExtensionData = useEnabledExtensions();
  const colonyDomains = colony?.domains?.items.filter(notNull) || [];
  const domainOptions = getDomainOptions(colonyDomains);
  const { isVotingReputationEnabled } = enabledExtensionData;

  const actionType = isVotingReputationEnabled
    ? ActionTypes.MOTION_MOVE_FUNDS
    : ActionTypes.ACTION_MOVE_FUNDS;

  const transform = pipe(
    mapPayload((payload) => getTransferFundsDialogPayload(colony, payload)),
    withMeta({ navigate }),
  );

  const defaultFromDomainId = Id.RootDomain;
  const defaultToDomainId =
    Number(
      domainOptions.find((option) => option.value !== defaultFromDomainId)
        ?.value,
    ) || Id.RootDomain;

  return {
    actionType,
    transform,
    defaultFromDomainId,
    defaultToDomainId,
    colony,
  };
};
