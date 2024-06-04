import React from 'react';

import { ADDRESS_ZERO, DEFAULT_NETWORK_TOKEN } from '~constants';
import { type ApprovedTokenChanges } from '~types/graphql.ts';
import { formatText } from '~utils/intl.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import TokenRow from './TokenRow.tsx';

const displayName = 'v5.common.CompletedAction.partials.ApprovedTokens';

interface ApprovedTokensProps {
  approvedTokenChanges: ApprovedTokenChanges;
}

const ApprovedTokens = ({ approvedTokenChanges }: ApprovedTokensProps) => {
  const { added, removed, unaffected } = approvedTokenChanges || {};

  const convertArrayToObject = (
    tokenAddresses: (string | null)[] | null | undefined,
    type: 'added' | 'removed' | 'unaffected',
  ) => {
    if (!tokenAddresses) {
      return [];
    }
    return tokenAddresses.map((address) => ({ address, type }));
  };

  const unaffectedTokens = convertArrayToObject(unaffected, 'unaffected');
  const addedTokens = convertArrayToObject(added, 'added');
  const removedTokens = convertArrayToObject(removed, 'removed');

  const tokenAddresses = [
    ...unaffectedTokens,
    ...addedTokens,
    ...removedTokens,
  ];

  return (
    <div className="mt-4">
      <h5 className="mb-3 text-md font-bold">
        {formatText({ id: 'actionSidebar.manageTokens.table.title' })}
      </h5>
      {/* @TODO: Temporary UI to be replaced by TokenTable */}
      <ul>
        <li className="flex items-center gap-2">
          <TokenAvatar
            size={18}
            tokenName={DEFAULT_NETWORK_TOKEN.name}
            tokenAddress={ADDRESS_ZERO}
          />
          {DEFAULT_NETWORK_TOKEN.name} - {DEFAULT_NETWORK_TOKEN.symbol}
        </li>
        {tokenAddresses.map((tokenData) => {
          return (
            <TokenRow
              key={tokenData.address}
              address={tokenData.address}
              type={tokenData.type}
            />
          );
        })}
      </ul>
    </div>
  );
};

ApprovedTokens.displayName = displayName;
export default ApprovedTokens;
