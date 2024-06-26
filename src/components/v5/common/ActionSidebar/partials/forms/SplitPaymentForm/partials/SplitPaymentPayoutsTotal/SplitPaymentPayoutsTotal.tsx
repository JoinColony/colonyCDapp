import clsx from 'clsx';
import { BigNumber } from 'ethers';
import moveDecimal from 'move-decimal-point';
import React, { useMemo, type FC } from 'react';

import Numeral from '~shared/Numeral/index.ts';
import { TokenAvatar } from '~v5/shared/TokenAvatar/TokenAvatar.tsx';

import { type SplitPaymentPayoutsTotalProps } from './types.ts';

const SplitPaymentPayoutsTotal: FC<SplitPaymentPayoutsTotalProps> = ({
  data,
  token,
  moveDecimals,
  className,
}) => {
  const summedAmount =
    useMemo(() => {
      return data.reduce<string>((result, { amount = '0' }) => {
        const tokenAmount = moveDecimals
          ? moveDecimal(amount, token.decimals)
          : amount;

        return BigNumber.from(result)
          .add(BigNumber.from(tokenAmount))
          .toString();
      }, '0');
    }, [data, moveDecimals, token.decimals]) || '0';

  return (
    <div
      className={clsx(
        className,
        'flex items-center gap-3 text-gray-900 text-1',
      )}
    >
      <Numeral value={summedAmount} decimals={token.decimals} />
      <div className="flex items-center gap-1">
        <TokenAvatar
          tokenAddress={token.tokenAddress}
          tokenAvatarSrc={token.avatar ?? undefined}
          tokenName={token.name}
          size={18}
          className="flex-shrink-0 text-gray-900"
        />
        <span>{token.symbol}</span>
      </div>
    </div>
  );
};

export default SplitPaymentPayoutsTotal;
