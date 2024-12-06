import React from 'react';
import { defineMessages } from 'react-intl';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { CurrencyLabel } from '~frame/v5/pages/UserCryptoToFiatPage/partials/CurrencyLabel.tsx';
import { type SupportedCurrencies } from '~gql';
import { type BridgeBankAccount } from '~types/graphql.ts';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import { TABLE_TD_LOADER_STYLES } from './consts.ts';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.BankDetails.partials.BankDetailsDescription';

const MSG = defineMessages({
  componentTitle: {
    id: `${displayName}.componentTitle`,
    defaultMessage: 'Bank, address and currency information',
  },
  tableBankDetailsTitle: {
    id: `${displayName}.tableBankDetailsTitle`,
    defaultMessage: 'Bank details',
  },
  tableCurrencyTitle: {
    id: `${displayName}.tableCurrencyTitle`,
    defaultMessage: 'Currency',
  },
  columnHeadingBankName: {
    id: `${displayName}.columnHeadingBankName`,
    defaultMessage: 'Bank name',
  },
  columnHeadingAccountNumber: {
    id: `${displayName}.columnHeadingAccountNumber`,
    defaultMessage: 'Account number',
  },
  columnHeadingBic: {
    id: `${displayName}.columnHeadingBic`,
    defaultMessage: 'BIC',
  },
  columnHeadingRoutingNumber: {
    id: `${displayName}.columnHeadingRoutingNumber`,
    defaultMessage: 'Routing number',
  },
  columnHeadingPayoutCurrency: {
    id: `${displayName}.columnHeadingPayoutCurrency`,
    defaultMessage: 'Payout currency',
  },
});

interface BankDetailsDescriptionProps {
  isDataLoading: boolean;
  bankAccount?: BridgeBankAccount | null;
}

const BankDetailsDescription = ({
  bankAccount,
  isDataLoading,
}: BankDetailsDescriptionProps) => {
  return (
    <div className="flex flex-col">
      <p className="mb-4 text-md font-medium">
        {formatMessage(MSG.componentTitle)}
      </p>
      <div className="grid w-full min-w-full max-w-[670px] grid-flow-row grid-cols-1 gap-y-1 sm:grid-cols-4 sm:gap-x-4">
        <div className="order-0 col-span-1 mb-1 text-left text-sm font-semibold sm:order-none sm:col-span-3">
          {formatMessage(MSG.tableBankDetailsTitle)}
        </div>
        <div className="order-8 col-span-1 mb-1 mt-3 text-left text-sm font-semibold sm:order-none sm:mt-0">
          {formatMessage(MSG.tableCurrencyTitle)}
        </div>

        <div className="order-1 col-span-1 text-left text-xs font-thin text-gray-500 sm:order-none">
          {formatMessage(MSG.columnHeadingBankName)}
        </div>

        <div className="order-4 col-span-1 mt-3 text-left text-xs font-thin text-gray-500 sm:order-none sm:mt-0">
          {formatMessage(MSG.columnHeadingAccountNumber)}
        </div>

        <div className="order-6 col-span-1 mt-3 text-left text-xs font-thin text-gray-500 sm:order-none sm:mt-0">
          {formatMessage(
            bankAccount?.usAccount?.routingNumber
              ? MSG.columnHeadingRoutingNumber
              : MSG.columnHeadingBic,
          )}
        </div>

        <div className="order-8 col-span-1 text-left text-xs font-thin text-gray-500 sm:order-none">
          {formatMessage(MSG.columnHeadingPayoutCurrency)}
        </div>

        <div className="order-2 text-md font-normal sm:order-none">
          <LoadingSkeleton
            isLoading={isDataLoading}
            className={TABLE_TD_LOADER_STYLES}
          >
            {bankAccount?.bankName ?? '-'}
          </LoadingSkeleton>
        </div>

        <div className="order-5 text-md font-normal sm:order-none">
          <LoadingSkeleton
            isLoading={isDataLoading}
            className={TABLE_TD_LOADER_STYLES}
          >
            {bankAccount?.usAccount?.last4 ?? bankAccount?.iban?.last4 ?? '-'}
          </LoadingSkeleton>
        </div>

        <div className="order-7 text-md font-normal sm:order-none">
          <LoadingSkeleton
            isLoading={isDataLoading}
            className={TABLE_TD_LOADER_STYLES}
          >
            {bankAccount?.usAccount?.routingNumber ??
              bankAccount?.iban?.bic ??
              '-'}
          </LoadingSkeleton>
        </div>

        <div className="order-10 text-md font-normal sm:order-none">
          <LoadingSkeleton
            isLoading={isDataLoading}
            className={TABLE_TD_LOADER_STYLES}
          >
            {bankAccount?.currency ? (
              <CurrencyLabel
                currency={
                  bankAccount?.currency.toUpperCase() as SupportedCurrencies
                }
                labelClassName="font-normal"
              />
            ) : (
              '-'
            )}
          </LoadingSkeleton>
        </div>
      </div>
    </div>
  );
};

BankDetailsDescription.displayName = displayName;

export default BankDetailsDescription;
