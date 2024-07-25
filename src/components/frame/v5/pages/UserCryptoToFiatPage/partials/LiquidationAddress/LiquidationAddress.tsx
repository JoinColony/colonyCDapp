import { Cardholder, Eye } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';
import { useAppContext } from '~context/AppContext/AppContext.ts';
import { useGetUserLiquidationAddressesQuery } from '~gql';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { getChainId } from '~redux/sagas/utils/index.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { useCryptoToFiatContext } from '../../context/CryptoToFiatContext.ts';

import { MOCK_LIQUIDATION_ADDRESSES } from './mocks.ts';
import { BlockExplorerButton } from './partials/BlockExplorerButton.tsx';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.LiquidationAddress';

const chainId = getChainId();

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

  const { bankAccountData, kycStatusData, isKycStatusDataLoading } =
    useCryptoToFiatContext();

  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const { loading: isLiquidationAddressLoading, data } =
    useGetUserLiquidationAddressesQuery({
      variables: {
        chainId: Number(chainId),
        userAddress: user?.walletAddress ?? '',
      },
      skip: !user,
    });

  const isLoading = isKycStatusDataLoading || isLiquidationAddressLoading;

  const [showAddress, setShowAddress] = useState(false);

  const isLiquidationEligible =
    !!bankAccountData && !!kycStatusData && !isLoading;

  const liquidationAddress = useMemo(() => {
    const liquidationAddresses = data?.getLiquidationAddressesByUserAddress
      ?.items.length
      ? data?.getLiquidationAddressesByUserAddress?.items
      : MOCK_LIQUIDATION_ADDRESSES;

    const address = liquidationAddresses[0]?.liquidationAddress;

    // Based on the Figma design, it sort of assumes that a user will have a liquidation address
    // once KYC is successful and bank details have been submitted. But what if we still don't have
    // a liquidation address after those two are satisfied?
    if (!address) return '';

    return showAddress ? address : '•'.repeat(address.length);
  }, [data?.getLiquidationAddressesByUserAddress?.items, showAddress]);

  const onAddressCtaButtonClick = () => {
    if (showAddress) {
      handleClipboardCopy(liquidationAddress);
    } else {
      setShowAddress(true);
    }
  };

  const addressCtaButtonCopy = () => {
    if (isCopied) {
      return {
        id: 'copy.addressCopied',
      };
    }

    if (showAddress) {
      return {
        id: 'copy.address',
      };
    }

    return MSG.showAddress;
  };

  return (
    <div>
      <section className="mb-2">
        <h1 className="mb-3 text-lg font-semibold">{formatText(MSG.header)}</h1>
        <p className="text-sm text-gray-600">{formatText(MSG.description)}</p>
      </section>
      <section className="flex h-16 w-full justify-between gap-2 rounded-[4px] bg-gray-100 p-3">
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
              {isLiquidationEligible
                ? liquidationAddress
                : formatText(MSG.incompleteDetails)}
            </span>
          </LoadingSkeleton>
        </div>
        <div className="flex flex-1 justify-end gap-2">
          {showAddress && <BlockExplorerButton address={liquidationAddress} />}
          <LoadingSkeleton
            className="h-10 w-full max-w-[153px] rounded-lg"
            isLoading={isLoading}
          >
            <Button
              mode={isCopied ? 'completed' : 'primaryOutlineFull'}
              className={clsx('gap-2', {
                'border-gray-300': !isCopied,
              })}
              disabled={!isLiquidationEligible}
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
