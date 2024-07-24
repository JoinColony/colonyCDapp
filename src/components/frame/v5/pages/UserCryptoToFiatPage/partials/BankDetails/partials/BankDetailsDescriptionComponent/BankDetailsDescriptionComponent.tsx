import React from 'react';
import { defineMessages } from 'react-intl';

import hocWithLoading from '~common/HocWithLoading/index.ts';
import { type CheckKycStatusMutation } from '~gql';
import { formatMessage } from '~utils/yup/tests/helpers.ts';

import { TABLE_TD_LOADER_STYLES } from './consts.ts';

const displayName =
  'v5.pages.UserCryptoToFiatPage.partials.BankDetails.partials.BankDetailsDescriptionComponent';

const MSG = defineMessages({
  componentTitle: {
    id: `${displayName}.componentTitle`,
    defaultMessage: 'Bank, address and currency information',
  },
  tableTitle: {
    id: `${displayName}.tableTitle`,
    defaultMessage: 'Bank details',
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
  columnHeadingPayoutCurrency: {
    id: `${displayName}.columnHeadingPayoutCurrency`,
    defaultMessage: 'Payout currency',
  },
});

interface BankDetailsDescriptionComponentProps {
  bankAccount: NonNullable<
    CheckKycStatusMutation['bridgeXYZMutation']
  >['bankAccount'];
  isDataLoading: boolean;
}

const TableDataCellValue = ({
  value = '-',
}: {
  value: string | null | undefined;
}) => <>{value}</>;

const TableDataCellValueWithLoading = hocWithLoading(TableDataCellValue);

const BankDetailsDescriptionComponent = ({
  bankAccount,
  isDataLoading,
}: BankDetailsDescriptionComponentProps) => {
  return (
    <div className="flex flex-col">
      <p className="mb-3 text-md">{formatMessage(MSG.componentTitle)}</p>
      <p className="mb-1 text-sm font-bold">{formatMessage(MSG.tableTitle)}</p>
      <table className="w-full max-w-[670px] table-fixed">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="font-thin">
              {formatMessage(MSG.columnHeadingBankName)}
            </th>
            <th className="font-thin">
              {formatMessage(MSG.columnHeadingAccountNumber)}
            </th>
            <th className="font-thin">{formatMessage(MSG.columnHeadingBic)}</th>
            <th className="font-thin">
              {formatMessage(MSG.columnHeadingPayoutCurrency)}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <TableDataCellValueWithLoading
                value={bankAccount?.bankName}
                isLoading={isDataLoading}
                loaderClassName={TABLE_TD_LOADER_STYLES}
              />
            </td>
            <td>
              <TableDataCellValueWithLoading
                value={
                  bankAccount?.usAccount?.last4 ?? bankAccount?.iban?.last4
                }
                isLoading={isDataLoading}
                loaderClassName={TABLE_TD_LOADER_STYLES}
              />
            </td>
            <td>
              <TableDataCellValueWithLoading
                value={
                  bankAccount?.usAccount?.routingNumber ??
                  bankAccount?.iban?.bic
                }
                isLoading={isDataLoading}
                loaderClassName={TABLE_TD_LOADER_STYLES}
              />
            </td>
            <td>
              <TableDataCellValueWithLoading
                value={bankAccount?.currency}
                isLoading={isDataLoading}
                loaderClassName={TABLE_TD_LOADER_STYLES}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

BankDetailsDescriptionComponent.displayName = displayName;

export default BankDetailsDescriptionComponent;
