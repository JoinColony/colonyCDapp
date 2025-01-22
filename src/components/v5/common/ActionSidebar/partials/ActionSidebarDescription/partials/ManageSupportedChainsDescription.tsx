import React from 'react';
import { useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import { ColonyActionType } from '~types/graphql.ts';
import { findSupportedChain } from '~utils/proxyColonies.ts';
import { ManageEntityOperation } from '~v5/common/ActionSidebar/consts.ts';
import { type ManageSupportedChainsFormValues } from '~v5/common/ActionSidebar/partials/forms/ManageSupportedChainsForm/consts.ts';

import CurrentUser from './CurrentUser.tsx';

const displayName =
  'v5.common.ActionsSidebar.partials.ActionSidebarDescription.partials.ManageSupportedChainsDescription';

const MSG = defineMessages({
  manageSupportedChainsTitle: {
    id: `${displayName}.manageSupportedChainsTitle`,
    defaultMessage: 'Manage supported chains by {initiator}',
  },
});

export const ManageSupportedChainsDescription = () => {
  const formValues =
    useFormContext<ManageSupportedChainsFormValues>().getValues();
  const { manageSupportedChains, chain } = formValues;
  const chainInfo = chain ? findSupportedChain(Number(chain)) : null;

  if (manageSupportedChains === undefined || !chainInfo) {
    return (
      <FormattedMessage
        {...MSG.manageSupportedChainsTitle}
        values={{
          initiator: <CurrentUser />,
        }}
      />
    );
  }

  return (
    <FormattedMessage
      id="action.title"
      values={{
        chain: chainInfo.shortName,
        actionType:
          manageSupportedChains === ManageEntityOperation.Add
            ? ColonyActionType.AddProxyColony
            : ColonyActionType.RemoveProxyColony,
        initiator: <CurrentUser />,
      }}
    />
  );
};
