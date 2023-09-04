import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  defineMessages,
  FormattedMessage,
  MessageDescriptor,
  useIntl,
} from 'react-intl';
import { useFormContext } from 'react-hook-form';

import { isAddress } from '~utils/web3';
import {
  HookFormInput as Input,
  HookFormSelect as Select,
  SelectOption,
  HookFormTextArea as Textarea,
} from '~shared/Fields';
import SingleUserPicker, {
  filterUserSelection,
} from '~shared/SingleUserPicker';
import { DialogSection } from '~shared/Dialog';
import {
  getContractUsefulMethods,
  AbiItemExtended,
  fetchContractABI,
  fetchContractName,
  getSafe,
  getChainNameFromSafe,
} from '~utils/safes';
import { isEmpty, isEqual, isNil } from '~utils/lodash';
import { Message, SafeTransactionData } from '~types';
import { isMessageDescriptor } from '~utils/intl';
import { BINANCE_NETWORK } from '~constants';

import { invalidSafeError } from '..';
import { ABIResponse, TransactionSectionProps, UpdatedMethods } from '../types';

import { ErrorMessage as Error, Loading, AvatarXS } from './shared';

import styles from './TransactionTypesSection.css';

const displayName = `common.ControlSafeDialog.ControlSafeForm.ContractInteractionSection`;

const MSG = defineMessages({
  abiLabel: {
    id: `${displayName}.abiLabel`,
    defaultMessage: 'ABI/JSON',
  },
  functionLabel: {
    id: `${displayName}.functionLabel`,
    defaultMessage: 'Select function to interact with',
  },
  functionPlaceholder: {
    id: `${displayName}.functionPlaceholder`,
    defaultMessage: 'Select function',
  },
  contractLabel: {
    id: `${displayName}.contractLabel`,
    defaultMessage: 'Target contract address',
  },
  userPickerPlaceholder: {
    id: `${displayName}.userPickerPlaceholder`,
    defaultMessage: 'Select or paste a contract address',
  },
  loadingContract: {
    id: `${displayName}.loadingContract`,
    defaultMessage: 'Loading Contract',
  },
  contractNotVerifiedError: {
    id: `${displayName}.contractNotVerifiedError`,
    defaultMessage: `Contract could not be verified. Ensure it exists on {network}`,
  },
  invalidAddressError: {
    id: `${displayName}.invalidAddressError`,
    defaultMessage: `Contract address is not a valid address`,
  },
  fetchFailedError: {
    id: `${displayName}.fetchFailedError`,
    defaultMessage: `Unable to fetch contract. Please check your connection`,
  },
  noUsefulMethodsError: {
    id: `${displayName}.noUsefulMethodsError`,
    defaultMessage: `No external methods were found in this ABI`,
  },
  unknownContract: {
    id: `${displayName}.unknownContract`,
    defaultMessage: `Unknown contract`,
  },
  etherscanAttribution: {
    id: `${displayName}.etherscanAttribution`,
    defaultMessage: 'Powered by Etherscan.io APIs',
  },
  bscScanAttribution: {
    id: `${displayName}.bscScanAttribution`,
    defaultMessage: 'Powered by BscScan APIs',
  },
});

interface Props extends TransactionSectionProps {
  selectedContractMethods?: UpdatedMethods;
  removeSelectedContractMethod: (index: number) => void;
  handleSelectedContractMethods: (
    selectedContractMethods: UpdatedMethods,
    index: number,
  ) => void;
}

const getAttributionMessage = (chainId: string | undefined) => {
  if (chainId === BINANCE_NETWORK.chainId.toString()) {
    return MSG.bscScanAttribution;
  }
  return MSG.etherscanAttribution;
};

const ContractInteractionSection = ({
  colony: { metadata },
  disabledInput,
  transactionIndex,
  selectedContractMethods = {},
  handleSelectedContractMethods,
  removeSelectedContractMethod,
}: Props) => {
  const { formatMessage } = useIntl();

  const safes = metadata?.safes || [];

  const [formattedMethodOptions, setFormattedMethodOptions] = useState<
    SelectOption[]
  >([]);
  const [prevSafeChainId, setPrevSafeChainId] = useState<number>();
  const [isLoadingABI, setIsLoadingABI] = useState<boolean>(false);
  const [fetchABIError, setFetchABIError] = useState<Message>('');

  const {
    watch,
    setValue,
    trigger,
    formState: { isValid },
  } = useFormContext();
  const safe = watch('safe');
  const transactions: SafeTransactionData[] = watch(`transactions`);
  const transactionValues = transactions[transactionIndex];
  const selectedSafe = getSafe(safes, safe);

  const onContractABIChange = useCallback(
    (abiResponse: ABIResponse) => {
      const setTransactionAbi = (value: string) =>
        setValue(`transactions.${transactionIndex}.abi`, value);

      if (abiResponse.status === '0') {
        setFetchABIError(
          formatMessage(MSG.contractNotVerifiedError, {
            // onContractABIChange is only called if a safe has been selected
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: getChainNameFromSafe(safe!.profile.displayName),
          }),
        );
      } else if (
        !isNil(abiResponse.result) &&
        abiResponse.result !== transactionValues.abi
      ) {
        setTransactionAbi(abiResponse.result);
        removeSelectedContractMethod(transactionIndex);
      }
    },
    [
      transactionIndex,
      safe,
      setValue,
      transactionValues.abi,
      removeSelectedContractMethod,
      formatMessage,
    ],
  );

  const onContractChange = useCallback(
    async <T extends { walletAddress: string }>(contract: T) => {
      const setTransactionDisplayName = (value: string) =>
        setValue(
          `transactions.${transactionIndex}.contract.profile.displayName`,
          value,
        );

      setIsLoadingABI(true);
      setFetchABIError('');

      if (selectedSafe && isAddress(contract.walletAddress)) {
        const contractABIData = await fetchContractABI(
          contract.walletAddress,
          Number(selectedSafe.chainId),
        );

        if (contractABIData) {
          onContractABIChange(contractABIData);
        } else {
          setFetchABIError(MSG.fetchFailedError);
        }

        const contractName = await fetchContractName(
          contract.walletAddress,
          Number(selectedSafe?.chainId),
        );

        setTransactionDisplayName(
          contractName || formatMessage(MSG.unknownContract),
        );
        setIsLoadingABI(false);
      } else {
        const error = !isAddress(contract.walletAddress)
          ? MSG.invalidAddressError
          : invalidSafeError;
        setFetchABIError(error);

        setTransactionDisplayName(formatMessage(MSG.unknownContract));
        setIsLoadingABI(false);
      }
    },
    [
      selectedSafe,
      onContractABIChange,
      formatMessage,
      setValue,
      transactionIndex,
    ],
  );

  const usefulMethods: AbiItemExtended[] = useMemo(
    () => getContractUsefulMethods(transactionValues.abi),
    [transactionValues.abi],
  );

  const isSpecificError = (error: Message, comparison: MessageDescriptor) => {
    return (
      isMessageDescriptor(error) &&
      error.defaultMessage === comparison.defaultMessage
    );
  };

  useEffect(() => {
    if (
      transactionValues.contract &&
      safe &&
      // only run effect if safe chain changes or there was previously an error
      (prevSafeChainId !== selectedSafe?.chainId || fetchABIError)
    ) {
      if (selectedSafe) {
        setPrevSafeChainId(selectedSafe.chainId);
      }
      onContractChange(transactionValues.contract);
    }
    // Don't want to run when ABI error changes, or else cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    safe,
    selectedSafe,
    transactionValues.contract,
    onContractChange,
    prevSafeChainId,
  ]);

  useEffect(() => {
    const updatedFormattedMethodOptions =
      usefulMethods.map((method) => {
        return {
          label: method.name,
          value: method.name,
        };
      }) || [];

    if (!isEqual(updatedFormattedMethodOptions, formattedMethodOptions)) {
      setFormattedMethodOptions(updatedFormattedMethodOptions);
    }

    if (
      !fetchABIError && // so we don't override other errors
      transactionValues.abi &&
      !updatedFormattedMethodOptions.length
    ) {
      setFetchABIError(MSG.noUsefulMethodsError);
    }
  }, [
    fetchABIError,
    transactionValues.abi,
    usefulMethods,
    transactionIndex,
    formattedMethodOptions,
  ]);

  useEffect(() => {
    if (
      (isEmpty(usefulMethods) ||
        !usefulMethods?.find(
          (method) =>
            method.name === selectedContractMethods[transactionIndex]?.name,
        )) &&
      !isEmpty(selectedContractMethods[transactionIndex])
    ) {
      removeSelectedContractMethod(transactionIndex);
    }
  }, [
    selectedContractMethods,
    usefulMethods,
    transactionIndex,
    removeSelectedContractMethod,
  ]);

  // Ensures spinner doesn't show up when returning back from Preview
  if (isLoadingABI && !isValid) {
    return <Loading message={MSG.loadingContract} />;
  }

  return (
    <>
      <DialogSection>
        <div className={styles.singleUserPickerContainer}>
          <SingleUserPicker
            data={[]}
            label={MSG.contractLabel}
            name={`transactions.${transactionIndex}.contract`}
            filter={filterUserSelection}
            renderAvatar={AvatarXS}
            disabled={disabledInput}
            placeholder={MSG.userPickerPlaceholder}
            onSelected={onContractChange}
          />
        </div>
      </DialogSection>
      {fetchABIError &&
      !isSpecificError(fetchABIError, MSG.noUsefulMethodsError) &&
      !isSpecificError(fetchABIError, MSG.fetchFailedError) ? (
        <Error error={fetchABIError} />
      ) : (
        <>
          <DialogSection>
            <div className={styles.abiContainer}>
              <Textarea
                label={MSG.abiLabel}
                name={`transactions.${transactionIndex}.abi`}
                appearance={{ colorSchema: 'grey', resizable: 'vertical' }}
                disabled={disabledInput}
              />
              {selectedSafe?.chainId && (
                <span className={styles.attributionMessage}>
                  <FormattedMessage
                    {...getAttributionMessage(selectedSafe.chainId.toString())}
                  />
                </span>
              )}
            </div>
            {fetchABIError &&
              isSpecificError(fetchABIError, MSG.fetchFailedError) && (
                <div className={styles.fetchFailedErrorContainer}>
                  <Error error={fetchABIError} />
                </div>
              )}
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <div className={styles.contractFunctionSelectorContainer}>
              {fetchABIError &&
              isSpecificError(fetchABIError, MSG.noUsefulMethodsError) ? (
                <div className={styles.noUsefulMethods}>
                  <Error error={fetchABIError} />
                </div>
              ) : (
                <Select
                  label={MSG.functionLabel}
                  name={`transactions.${transactionIndex}.contractFunction`}
                  appearance={{ theme: 'grey', width: 'fluid' }}
                  placeholder={MSG.functionPlaceholder}
                  disabled={disabledInput}
                  options={formattedMethodOptions}
                  onChange={(value) => {
                    const updatedSelectedContractMethods = {
                      ...selectedContractMethods,
                      [transactionIndex]: usefulMethods.find(
                        (method) => method.name === value,
                      ),
                    };
                    handleSelectedContractMethods(
                      updatedSelectedContractMethods,
                      transactionIndex,
                    );

                    const methodName =
                      updatedSelectedContractMethods[transactionIndex]?.name;

                    updatedSelectedContractMethods[0]?.inputs?.map((input) =>
                      setValue(
                        `transactions.${transactionIndex}.${input.name}-${methodName}`,
                        '',
                      ),
                    );

                    setTimeout(
                      () => trigger(`transactions.${transactionIndex}`),
                      1,
                    );
                  }}
                />
              )}
            </div>
          </DialogSection>
          {selectedContractMethods[transactionIndex]?.inputs?.map((input) => (
            <DialogSection
              key={`${input.name}-${input.type}`}
              appearance={{ theme: 'sidePadding' }}
            >
              <div className={styles.inputParamContainer}>
                <Input
                  label={`${input.name} (${input.type})`}
                  // eslint-disable-next-line max-len
                  name={`transactions.${transactionIndex}.${input.name}-${selectedContractMethods[transactionIndex]?.name}`}
                  appearance={{ colorSchema: 'grey', theme: 'fat' }}
                  disabled={disabledInput}
                  placeholder={`${input.name} (${input.type})`}
                  formattingOptions={
                    input?.type?.includes('int') &&
                    input.type.substring(input.type.length - 2) !== '[]'
                      ? {
                          numeral: true,
                          numeralPositiveOnly:
                            input.type.substring(0, 4) === 'uint',
                          numeralDecimalScale: 0,
                        }
                      : undefined
                  }
                />
              </div>
            </DialogSection>
          ))}
        </>
      )}
    </>
  );
};

ContractInteractionSection.displayName = displayName;

export default ContractInteractionSection;
