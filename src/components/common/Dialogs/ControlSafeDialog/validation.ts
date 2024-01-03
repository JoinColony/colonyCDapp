import Decimal from 'decimal.js';
import { isHexString } from 'ethers/lib/utils';
import moveDecimal from 'move-decimal-point';
import { defineMessages, MessageDescriptor } from 'react-intl';
import { object, string, array, number } from 'yup';

import { SafeBalance, SafeTransactionType } from '~types';
import { intl } from '~utils/intl';
import { getSelectedSafeBalance, isAbiItem } from '~utils/safes';
import { validateType } from '~utils/safes/contractParserValidation';
import { isAddress } from '~utils/web3';

import { FormSafeTransaction } from './types';

const displayName = 'common.ControlSafeDialog.validation';

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
  notPositiveIntegerError: {
    id: `${displayName}.notPositiveIntegerError`,
    defaultMessage: 'Amount must be a positive integer',
  },
  invalidArrayError: {
    id: `${displayName}.invalidArrayError`,
    defaultMessage: `Value is not a valid array`,
  },
  invalidAtIndexError: {
    id: `${displayName}.invalidAtIndexError`,
    defaultMessage: `Item {idx} is not a valid {type}`,
  },
  notSafeIntegerError: {
    id: `${displayName}.notSafeIntegerError`,
    defaultMessage: `Amount must be a safe integer`,
  },
  notAddressError: {
    id: `${displayName}.notAddressError`,
    defaultMessage: `Address must be formatted correctly`,
  },
  notBooleanError: {
    id: `${displayName}.notBooleanError`,
    defaultMessage: `Value must be a valid boolean`,
  },
  notSafeHexError: {
    id: `${displayName}.notSafeHexError`,
    defaultMessage: `Hex string must be correct length and begin with 0x`,
  },
});

export const getValidationSchema = (
  showPreview: boolean,
  expandedValidationSchema: Record<string, any>,
) =>
  object()
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
      ...(showPreview
        ? {
            customActionTitle: string()
              .trim()
              .required(() => MSG.requiredFieldError),
          }
        : {}),
      transactions: array(
        object().shape({
          transactionType: string().required(() => MSG.requiredFieldError),
          recipient: object().when('transactionType', {
            is: (transactionType) =>
              transactionType === SafeTransactionType.TransferFunds ||
              transactionType === SafeTransactionType.RawTransaction ||
              transactionType === SafeTransactionType.TransferNft,
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
                        return isAddress(this.parent.walletAddress);
                      }
                      return isAddress(value);
                    }
                    return false;
                  },
                ),
              profile: object()
                .shape({
                  displayName: string().nullable(),
                })
                .defined()
                .nullable(),
              walletAddress: string().address().required(),
            }),
            otherwise: object().nullable(),
          }),
          amount: string()
            .when('transactionType', {
              is: SafeTransactionType.TransferFunds,
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
                    const selectedToken = this.parent.token?.tokenAddress;
                    const selectedTokenDecimals = this.parent.token?.decimals;

                    const {
                      safeBalances,
                      transactions,
                    }: {
                      safeBalances: SafeBalance[];
                      transactions: FormSafeTransaction[];
                      // Type is incorrect. "from" does appear in TextContext
                      // @ts-ignore
                    } = this.from[1].value;
                    const safeBalance = getSelectedSafeBalance(
                      safeBalances,
                      selectedToken,
                    );

                    if (safeBalance) {
                      const totalAmount = transactions.reduce(
                        (total, transaction) => {
                          if (
                            transaction.amount &&
                            transaction.token?.tokenAddress === selectedToken
                          ) {
                            const convertedAmount = new Decimal(
                              moveDecimal(
                                transaction.amount,
                                selectedTokenDecimals,
                              ),
                            );
                            return total.plus(convertedAmount);
                          }
                          return total;
                        },
                        new Decimal(0),
                      );
                      const balance = new Decimal(safeBalance.balance);
                      if (balance.lt(totalAmount) || balance.isZero()) {
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
            })
            .nullable(),
          rawAmount: number()
            .when('transactionType', {
              is: SafeTransactionType.RawTransaction,
              then: number()
                .typeError(() => MSG.notPositiveIntegerError)
                .required(() => MSG.requiredFieldError)
                .min(0, () => MSG.notPositiveIntegerError)
                .integer(() => MSG.notPositiveIntegerError),
              otherwise: number().nullable(),
            })
            .nullable(),
          data: string()
            .when('transactionType', {
              is: SafeTransactionType.RawTransaction,
              then: string()
                .required(() => MSG.requiredFieldError)
                .test(
                  'is-hex',
                  () => MSG.notHexError,
                  (value) => isHexString(value),
                ),
              otherwise: string(),
            })
            .nullable(),
          contract: object()
            .when('transactionType', {
              is: SafeTransactionType.ContractInteraction,
              then: object().shape({
                walletAddress: string()
                  .address()
                  .required(() => MSG.requiredFieldError),
              }),
              otherwise: object().nullable(),
            })
            .nullable(),
          abi: string()
            .when('transactionType', {
              is: SafeTransactionType.ContractInteraction,
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
            })
            .nullable(),
          contractFunction: string()
            .when('transactionType', {
              is: SafeTransactionType.ContractInteraction,
              then: string().required(() => MSG.requiredFieldError),
              otherwise: string(),
            })
            .nullable(),
          nft: object()
            .when('transactionType', {
              is: SafeTransactionType.TransferNft,
              then: object().shape({
                walletAddress: string().required(() => MSG.requiredFieldError),
                profile: object().shape({
                  displayName: string().required(() => MSG.requiredFieldError),
                }),
              }),
              otherwise: object().nullable(),
            })
            .nullable(),
          nftData: object()
            .when('transactionType', {
              is: SafeTransactionType.TransferNft,
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
            })
            .nullable(),
          ...expandedValidationSchema,
        }),
      ),
      motionDomainId: number().defined(),
    })
    .defined();

export const getMethodInputValidation = (
  type: string,
  functionName: string,
) => {
  const getContractFunctionSchema = (
    testName: string,
    defaultMessage: MessageDescriptor | string,
  ) => {
    // yup.string() to facilitate custom testing.
    return string().when('contractFunction', {
      is: functionName,
      then: string()
        .required(() => MSG.requiredFieldError)
        .test(
          testName,
          () => defaultMessage,
          function validateFunctionInput(value) {
            if (!value) {
              return false;
            }
            const result = validateType(type, value);
            if (result === -1) {
              return this.createError({
                message: formatMessage(MSG.invalidArrayError),
              });
            }
            if (typeof result === 'number') {
              return this.createError({
                message: formatMessage(MSG.invalidAtIndexError, {
                  idx: result,
                  type,
                }),
              });
            }
            return result;
          },
        ),
      otherwise: false,
    });
  };

  if (type.includes('int')) {
    return getContractFunctionSchema(
      'is-integer-correct',
      MSG.notSafeIntegerError,
    );
  }
  if (type.includes('address')) {
    return getContractFunctionSchema('is-address-correct', MSG.notAddressError);
  }
  if (type.includes('byte')) {
    return getContractFunctionSchema(
      'is-valid-byte-array',
      MSG.notSafeHexError,
    );
  }
  if (type.includes('bool')) {
    return getContractFunctionSchema('is-bool', MSG.notBooleanError);
  }
  if (type.includes('string')) {
    return getContractFunctionSchema(
      'is-string',
      '', // will never not be a valid string. But might not be a valid string array.
    );
  }
  // Minimal validation for less common types
  return string().when('contractFunction', {
    is: functionName,
    then: string().required(() => MSG.requiredFieldError),
    otherwise: false,
  });
};
