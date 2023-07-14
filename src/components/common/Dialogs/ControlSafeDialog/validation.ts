import { BigNumber } from 'ethers';
import { isAddress, isHexString } from 'ethers/lib/utils';
import { defineMessages } from 'react-intl';
import { object, string, array, number } from 'yup';
import moveDecimal from 'move-decimal-point';

import { toFinite } from 'lodash';
import { Address } from '~types';
import { intl } from '~utils/intl';
import { ADDRESS_ZERO } from '~constants';

import { TransactionTypes } from './constants';
import { SafeBalance } from './types';

const displayName = 'dashboard.ControlSafeDialog.validation';
const requiredFieldError = 'Please enter a value';

const { formatMessage } = intl({
  [`${displayName}.requiredFieldError`]: requiredFieldError,
  [`${displayName}.notAddressError`]: 'Address must be formatted correctly',
  [`${displayName}.balanceError`]: 'Could not retreive balance information',
  [`${displayName}.gtZeroError`]: 'Amount must be greater than zero',
  [`${displayName}.insuffienctFundsError`]: 'Insufficient safe balance',
});

const MSG = defineMessages({
  requiredFieldError: {
    id: `${displayName}.requiredFieldError`,
    defaultMessage: requiredFieldError,
  },
  notAbiError: {
    id: `${displayName}.notAbiError`,
    defaultMessage: 'Value must be a valid contract ABI',
  },
  notHexError: {
    id: `${displayName}.notHexError`,
    defaultMessage: 'Value must be a valid hex string',
  },
  notIntegerError: {
    id: `${displayName}.notIntegerError`,
    defaultMessage: 'Amount must be an integer',
  },
});

// placeholder
export const getSelectedSafeBalance = (
  safeBalances?: SafeBalance[] | null,
  selectedTokenAddress?: Address,
) =>
  safeBalances?.find(
    (balance) =>
      balance.tokenAddress === selectedTokenAddress ||
      (!balance.tokenAddress && selectedTokenAddress === ADDRESS_ZERO),
  );

export const isAbiItem = (value: unknown): value is any[] => {
  return (
    Array.isArray(value) &&
    value.every((element) => typeof element === 'object')
  );
};

export const getValidationSchema = () => {
  return object()
    .shape({
      safe: object().shape({
        id: string().address().required(),
        walletAddress: string().address().required(),
        profile: object()
          .shape({
            displayName: string().required(),
          })
          .required(() => MSG.requiredFieldError),
      }),
      transactions: array(
        object().shape({
          transactionType: string().required(() => MSG.requiredFieldError),
          recipient: object().when('transactionType', {
            is: (transactionType) =>
              transactionType === TransactionTypes.TRANSFER_FUNDS ||
              transactionType === TransactionTypes.RAW_TRANSACTION ||
              transactionType === TransactionTypes.TRANSFER_NFT,
            then: object().shape({
              id: string()
                .required()
                .test(
                  'is-valid-id',
                  formatMessage({ id: `${displayName}.notAddressError` }),
                  function validateId(value) {
                    if (value) {
                      /*
                       * id may be 'filterValue' if a contract address is manually entered.
                       * May occur in raw transaction section.
                       */
                      if (value === 'filterValue') {
                        return isAddress(this.parent.profile.walletAddress);
                      }
                      return isAddress(value);
                    }
                    return false;
                  },
                ),
              profile: object().shape({
                walletAddress: string()
                  .address()
                  .required(() => MSG.requiredFieldError),
              }),
            }),
            otherwise: object().nullable(),
          }),
          amount: string().when('transactionType', {
            is: TransactionTypes.TRANSFER_FUNDS,
            then: string()
              .nullable()
              .test(
                'check-amount',
                formatMessage({ id: `${displayName}.balanceError` }),
                async function testSafeBalance(value) {
                  if (!value) {
                    return this.createError({
                      message: formatMessage({
                        id: `${displayName}.requiredFieldError`,
                      }),
                    });
                  }
                  if (Number(value) <= 0) {
                    return this.createError({
                      message: formatMessage({
                        id: `${displayName}.gtZeroError`,
                      }),
                    });
                  }
                  const selectedToken = this.parent.tokenData?.address;
                  const selectedTokenDecimals = this.parent.tokenData?.decimals;

                  const {
                    safeBalances,
                  }: {
                    safeBalances: SafeBalance[];
                    // Type is incorrect. "from" does appear in TextContext
                    // @ts-ignore
                  } = this.from[1].value;
                  const safeBalance = getSelectedSafeBalance(
                    safeBalances,
                    selectedToken,
                  );

                  if (safeBalance) {
                    const convertedAmount = BigNumber.from(
                      moveDecimal(value, selectedTokenDecimals),
                    );
                    const balance = BigNumber.from(safeBalance.balance);
                    if (balance.lt(convertedAmount) || balance.isZero()) {
                      return this.createError({
                        message: formatMessage({
                          id: `${displayName}.insuffienctFundsError`,
                        }),
                      });
                    }
                    return true;
                  }
                  return this.createError({
                    message: formatMessage({
                      id: `${displayName}.balanceError`,
                    }),
                  });
                },
              ),
            otherwise: string().nullable(),
          }),
          rawAmount: number().when('transactionType', {
            is: TransactionTypes.RAW_TRANSACTION,
            then: number()
              .transform((value) => toFinite(value))
              .required(() => MSG.requiredFieldError)
              .integer(() => MSG.notIntegerError),
            otherwise: number().nullable(),
          }),
          data: string().when('transactionType', {
            is: TransactionTypes.RAW_TRANSACTION,
            then: string()
              .required(() => MSG.requiredFieldError)
              .test(
                'is-hex',
                () => MSG.notHexError,
                (value) => isHexString(value),
              ),
            otherwise: string(),
          }),
          contract: object().when('transactionType', {
            is: TransactionTypes.CONTRACT_INTERACTION,
            then: object().shape({
              profile: object().shape({
                walletAddress: string()
                  .address()
                  .required(() => MSG.requiredFieldError),
              }),
            }),
            otherwise: object().nullable(),
          }),
          abi: string().when('transactionType', {
            is: TransactionTypes.CONTRACT_INTERACTION,
            then: string()
              .required(() => MSG.requiredFieldError)
              .test(
                'is-abi-item',
                () => MSG.notAbiError,
                (value) => {
                  if (value) {
                    try {
                      return isAbiItem(JSON.parse(value));
                    } catch (error) {
                      return false;
                    }
                  }
                  return false;
                },
              ),
            otherwise: string(),
          }),
          contractFunction: string().when('transactionType', {
            is: TransactionTypes.CONTRACT_INTERACTION,
            then: string().required(() => MSG.requiredFieldError),
            otherwise: string(),
          }),
          nft: object().when('transactionType', {
            is: TransactionTypes.TRANSFER_NFT,
            then: object().shape({
              profile: object().shape({
                displayName: string().required(() => MSG.requiredFieldError),
                walletAddress: string().required(() => MSG.requiredFieldError),
              }),
            }),
            otherwise: object().nullable(),
          }),
          nftData: object().when('transactionType', {
            is: TransactionTypes.TRANSFER_NFT,
            then: object().shape({
              address: string(),
              description: string().nullable(),
              id: string(),
              imageUri: string().nullable(),
              logoUri: string(),
              metadata: object(),
              name: string().nullable(),
              tokenName: string(),
              tokenSymbol: string(),
              uri: string(),
            }),
            otherwise: object().nullable(),
          }),
        }),
      ),
    })
    .defined();
};
