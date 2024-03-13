import { isAddress } from 'ethers/lib/utils';
import React, { type FC } from 'react';

import { DEFAULT_TOKEN_DECIMALS } from '~constants';
import { useGetTokenByAddressQuery } from '~gql';
import SpinnerLoader from '~shared/Preloaders/SpinnerLoader.tsx';
import TokenIcon from '~shared/TokenIcon/TokenIcon.tsx';

import { getFormattedTokenAmount } from '../../utils.ts';

interface AmountFieldProps {
  amount: string;
  token: string;
}

const AmountField: FC<AmountFieldProps> = ({ amount, token }) => {
  const { data: tokenData, loading } = useGetTokenByAddressQuery({
    variables: { address: token },
    skip: !isAddress(token),
  });

  if (loading) {
    return <SpinnerLoader appearance={{ size: 'small' }} />;
  }

  const currentToken = tokenData?.getTokenByAddress?.items?.[0];
  const formattedAmount = getFormattedTokenAmount(
    amount,
    currentToken?.decimals || DEFAULT_TOKEN_DECIMALS,
  );

  return (
    <div className="text-md text-gray-900 flex items-center gap-3">
      {formattedAmount}
      {currentToken && (
        <div className="flex items-center gap-1">
          <TokenIcon token={currentToken} size="xxs" />
          {currentToken.symbol}
        </div>
      )}
    </div>
  );
};

export default AmountField;
