import { Extension } from '@colony/colony-js';
import React, { type PropsWithChildren, type FC } from 'react';
import { defineMessages, type MessageDescriptor } from 'react-intl';

import { formatText } from '~utils/intl.ts';
import MenuWithStatusText from '~v5/shared/MenuWithStatusText/MenuWithStatusText.tsx';
import { StatusTypes } from '~v5/shared/StatusText/consts.ts';

import ExtensionStatusBadge from '../Pills/ExtensionStatusBadge/ExtensionStatusBadge.tsx';

import { type UninstalledMessageProps } from './types.ts';

const displayName = 'Extensions.UninstalledMessage';

const extensionNames: Record<Extension, MessageDescriptor> = {
  FundingQueue: {
    id: `${displayName}.${Extension.FundingQueue}`,
    defaultMessage: 'Funding Queue',
  },
  IVotingReputation: {
    id: `${displayName}.${Extension.IVotingReputation}`,
    defaultMessage: 'IVoting Reputation',
  },
  MultisigPermissions: {
    id: `${displayName}.${Extension.MultisigPermissions}`,
    defaultMessage: 'Multi Sig Permissions',
  },
  OneTxPayment: {
    id: `${displayName}.${Extension.OneTxPayment}`,
    defaultMessage: 'One Transaction Payment',
  },
  ReputationBootstrapper: {
    id: `${displayName}.${Extension.ReputationBootstrapper}`,
    defaultMessage: 'Reputation Bootstrapper',
  },
  StagedExpenditure: {
    id: `${displayName}.${Extension.StagedExpenditure}`,
    defaultMessage: 'Staged Expenditure',
  },
  StakedExpenditure: {
    id: `${displayName}.${Extension.StakedExpenditure}`,
    defaultMessage: 'Staked Expenditure',
  },
  StreamingPayments: {
    id: `${displayName}.${Extension.StreamingPayments}`,
    defaultMessage: 'Streaming Payments',
  },
  TokenSupplier: {
    id: `${displayName}.${Extension.TokenSupplier}`,
    defaultMessage: 'Token Supplier',
  },
  VotingReputation: {
    id: `${displayName}.${Extension.VotingReputation}`,
    defaultMessage: 'Reputation Weighted',
  },
};

const MSG = defineMessages({
  warning: {
    id: `${displayName}.warning`,
    defaultMessage:
      'The extension was uninstalled and is no longer able to fetch the transaction history',
  },
  header: {
    id: `${displayName}.header`,
    defaultMessage: 'Extension Status',
  },
  unknownExtension: {
    id: `${displayName}.unknownExtension`,
    defaultMessage: 'Unknown extension',
  },
  uninstalled: {
    id: `${displayName}.uninstalled`,
    defaultMessage: 'Uninstalled',
  },
});

const UninstalledMessage: FC<PropsWithChildren<UninstalledMessageProps>> = ({
  extension,
}) => {
  const extensionName = formatText(
    extensionNames[extension] || MSG.unknownExtension,
  );

  return (
    <MenuWithStatusText
      statusTextSectionProps={{
        status: StatusTypes.Info,
        children: formatText(MSG.warning),
        iconAlignment: 'top',
        textClassName: 'text-xs font-medium text-gray-900',
        iconSize: 16,
      }}
      sections={[
        {
          key: '1',
          content: (
            <div className="flex items-center justify-between gap-2 text-sm font-normal text-gray-600">
              <p>{extensionName}</p>
              <ExtensionStatusBadge mode="disabled">
                {formatText(MSG.uninstalled)}
              </ExtensionStatusBadge>
            </div>
          ),
        },
      ]}
    />
  );
};

UninstalledMessage.displayName = displayName;

export default UninstalledMessage;
