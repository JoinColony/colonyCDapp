import { Cardholder, Eye } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetUserLiquidationAddressesQuery } from '~gql';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { getChainId } from '~redux/sagas/utils/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { MOCK_LIQUIDATION_ADDRESS_CHAIN_ID } from './mocks.ts';
import { BlockExplorerButton } from './partials/BlockExplorerButton.tsx';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.LiquidationAddress';

const chainIdWithMockFallback = Number(
  import.meta.env.MODE === 'development'
    ? MOCK_LIQUIDATION_ADDRESS_CHAIN_ID
    : getChainId(),
);

const MSG = defineMessages({
  header: {
    id: `${displayName}.header`,
    defaultMessage: 'Crypto to fiat payment address',
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage:
      'This is the address crypto to fiat transfer payments will need to be made to.',
  },
  incompleteDetails: {
    id: `${displayName}.incompleteDetails`,
    defaultMessage:
      'Complete your verification and bank details to generate a payment address.',
  },
  showAddress: {
    id: `${displayName}.showAddress`,
    defaultMessage: 'Show address',
  },
});

const LiquidationAddress = () => {
  const { user } = useAppContext();

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const { loading: isLiquidationAddressLoading, data } =
    useGetUserLiquidationAddressesQuery({
      variables: {
        chainId: chainIdWithMockFallback,
        userAddress: user?.walletAddress ?? '',
      },
      skip: !user,
    });

  const [showLiquidationAddress, setShowLiquidationAddress] = useState(false);

  const isLoading = !data || isLiquidationAddressLoading;

  const liquidationAddressesData = data?.getLiquidationAddressesByUserAddress;

  const liquidationAddress =
    liquidationAddressesData?.items[0]?.liquidationAddress;

  const onAddressCtaButtonClick = () => {
    if (showLiquidationAddress && liquidationAddress) {
      handleClipboardCopy(liquidationAddress);
    } else {
      setShowLiquidationAddress(true);
    }
  };

  const addressCtaButtonCopy = () => {
    if (isCopied) {
      return {
        id: 'copy.addressCopied',
      };
    }

    if (showLiquidationAddress) {
      return {
        id: 'copy.address',
      };
    }

    return MSG.showAddress;
  };

  const hideOrShow = (address: string) =>
    showLiquidationAddress ? liquidationAddress : '•'.repeat(address.length);

  return (
    <div>
      <section className="mb-2">
        <h1 className="mb-3 text-lg font-semibold">{formatText(MSG.header)}</h1>
        <p className="text-sm text-gray-600">{formatText(MSG.description)}</p>
      </section>
      <section className="flex h-16 w-full justify-between gap-2 rounded-[4px] bg-gray-50 p-3">
        <div className="flex flex-1 items-center gap-2">
          <LoadingSkeleton
            className="aspect-square h-4 w-4 rounded-[4px]"
            isLoading={isLoading}
          >
            <Cardholder size={18} />
          </LoadingSkeleton>
          <LoadingSkeleton
            isLoading={isLoading}
            className="h-[27px] w-full max-w-[377px] rounded-[4px]"
          >
            <span className="text-md font-normal">
              {liquidationAddress
                ? hideOrShow(liquidationAddress)
                : formatText(MSG.incompleteDetails)}
            </span>
          </LoadingSkeleton>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          {liquidationAddress && (
            <BlockExplorerButton address={liquidationAddress} />
          )}
          <LoadingSkeleton
            className="h-10 w-full max-w-[153px] rounded-lg"
            isLoading={isLoading}
          >
            <Button
              mode={isCopied ? 'completed' : 'primaryOutlineFull'}
              className={clsx('gap-2', {
                'border-gray-300': !isCopied,
              })}
              disabled={!liquidationAddress}
              onClick={onAddressCtaButtonClick}
              icon={isCopied ? undefined : Eye}
              text={addressCtaButtonCopy()}
            />
          </LoadingSkeleton>
        </div>
      </section>
    </div>
  );
};

LiquidationAddress.displayName = displayName;

export default LiquidationAddress;
