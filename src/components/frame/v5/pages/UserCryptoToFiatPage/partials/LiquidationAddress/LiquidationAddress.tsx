import { Cardholder, CopySimple, Eye } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { useState } from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/index.ts';
import { useCryptoToFiatContext } from '~frame/v5/pages/UserCryptoToFiatPage/context/CryptoToFiatContext.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import { formatText } from '~utils/intl.ts';
import Button from '~v5/shared/Button/index.ts';

import { BlockExplorerButton } from './partials/BlockExplorerButton.tsx';

const displayName = 'v5.pages.UserCryptoToFiatPage.partials.LiquidationAddress';

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
  const { handleClipboardCopy, isCopied } = useCopyToClipboard();

  const { kycStatusData, isKycStatusDataLoading } = useCryptoToFiatContext();

  const [showLiquidationAddress, setShowLiquidationAddress] = useState(false);

  const isLoading = isKycStatusDataLoading;

  const liquidationAddress = kycStatusData?.liquidationAddress;

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

  const addressCtaButtonIcon = () => {
    if (isCopied) {
      return undefined;
    }

    if (showLiquidationAddress) {
      return CopySimple;
    }

    return Eye;
  };

  const hideOrShow = (address: string) =>
    showLiquidationAddress ? liquidationAddress : '•'.repeat(address.length);

  return (
    <div>
      <section className="mb-2">
        <h1 className="mb-3 text-lg font-semibold">{formatText(MSG.header)}</h1>
        <p className="text-sm text-gray-600">{formatText(MSG.description)}</p>
      </section>
      <section className="flex min-h-16 w-full flex-col items-center justify-between gap-3 rounded-[4px] bg-gray-50 p-3 sm:flex-row">
        <div className="flex w-full items-center gap-2 overflow-hidden">
          <LoadingSkeleton
            className="aspect-square h-4 w-4 rounded-[4px]"
            isLoading={isLoading}
          >
            <Cardholder className="aspect-square h-[18px] w-auto flex-shrink-0" />
          </LoadingSkeleton>
          <LoadingSkeleton
            isLoading={isLoading}
            className="h-[27px] w-full max-w-full rounded-[4px] sm:max-w-[377px]"
          >
            <span
              className={clsx('text-md font-normal', {
                truncate: showLiquidationAddress,
              })}
            >
              {liquidationAddress
                ? hideOrShow(liquidationAddress)
                : formatText(MSG.incompleteDetails)}
            </span>
          </LoadingSkeleton>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-fit sm:flex-row">
          {liquidationAddress && showLiquidationAddress && (
            <BlockExplorerButton address={liquidationAddress} />
          )}
          <LoadingSkeleton
            className="h-10 w-full rounded-lg sm:w-[153px]"
            isLoading={isLoading}
          >
            <Button
              mode={isCopied ? 'completed' : 'primaryOutlineFull'}
              className={clsx('gap-2', {
                'border-gray-300': !isCopied,
              })}
              disabled={!liquidationAddress}
              onClick={onAddressCtaButtonClick}
              icon={addressCtaButtonIcon()}
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
