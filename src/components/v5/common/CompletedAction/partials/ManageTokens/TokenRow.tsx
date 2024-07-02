import clsx from 'clsx';
import { isAddress } from 'ethers/lib/utils';
import React from 'react';

import { useGetTokenFromEverywhereQuery } from '~gql';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import PillsBase from '~v5/common/Pills/PillsBase.tsx';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { TokenStatus } from './types.ts';

const displayName = 'v5.common.CompletedAction.partials.TokenRow';

// @TODO: Temporary UI to be replaced by TokenTable
const TokenRow = ({
  address,
  status,
}: {
  address: string;
  status: TokenStatus;
}) => {
  const { data, loading } = useGetTokenFromEverywhereQuery({
    variables: {
      input: {
        tokenAddress: address,
      },
    },
    skip: !isAddress(address),
  });

  const token = data?.getTokenFromEverywhere?.items?.[0] ?? null;

  if (loading) {
    return <SpinnerLoader appearance={{ size: 'small' }} />;
  }

  if (!token) {
    return <li>Something went wrong loading token</li>;
  }

  return (
    <li className="flex items-center gap-2">
      <TokenAvatar
        size={18}
        tokenName={token.name}
        tokenAddress={token.tokenAddress}
        tokenAvatarSrc={token.avatar ?? undefined}
      />
      {token.name} - {token.symbol}
      {status !== TokenStatus.Unaffected && (
        <PillsBase
          className={clsx({
            'bg-success-100 text-success-400': status === TokenStatus.Added,
            'bg-negative-100 text-negative-400': status === TokenStatus.Removed,
          })}
        >
          {status}
        </PillsBase>
      )}
    </li>
  );
};

TokenRow.displayName = displayName;
export default TokenRow;
