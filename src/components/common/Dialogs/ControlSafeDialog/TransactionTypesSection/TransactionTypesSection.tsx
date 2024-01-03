import classnames from 'classnames';
import React from 'react';
import { UseFieldArrayRemove, useFormContext } from 'react-hook-form';
import { defineMessages } from 'react-intl';

import { DialogSection } from '~shared/Dialog';
import { Select } from '~shared/Fields';
import {
  SelectedPickerItem,
  FunctionParamType,
  SafeTransactionType,
  Colony,
  SafeBalance,
} from '~types';
import { isEmpty, isEqual, omit } from '~utils/lodash';
import { defaultTransaction } from '~utils/safes';

import { transactionOptions, ContractFunctions } from '../helpers';
import { UpdatedMethods } from '../types';

import ContractInteractionSection from './ContractInteractionSection';
import RawTransactionSection from './RawTransactionSection';
import { ErrorMessage } from './shared';
import TransactionHeader from './TransactionHeader';
import TransferFundsSection from './TransferFundsSection';
import TransferNFTSection from './TransferNFTSection';

import styles from './TransactionTypesSection.css';

const displayName =
  'common.ControlSafeDialog.ControlSafeDialogForm.TransactionTypesSection';

const MSG = defineMessages({
  transactionLabel: {
    id: `${displayName}.transactionLabel`,
    defaultMessage: `Select transaction type`,
  },
  transactionPlaceholder: {
    id: `${displayName}.transactionPlaceholder`,
    defaultMessage: `Select transaction`,
  },
  invalidSafeError: {
    id: `${displayName}.invalidSafeError`,
    defaultMessage: `Select a safe from the menu or add a new one via Safe Control`,
  },
});

export const { invalidSafeError } = MSG;

interface Props {
  colony: Colony;
  selectedContractMethods: UpdatedMethods | undefined;
  handleSelectedContractMethodsChange: (
    methods: UpdatedMethods | undefined,
  ) => void;
  transactionIndex: number;
  disabledSectionInputs: boolean;
  prevSafeChainId: number | undefined;
  handlePrevSafeChainIdChange: (chainId: number | undefined) => void;
  savedTokenState: [
    Record<string, SafeBalance[]>,
    React.Dispatch<React.SetStateAction<Record<string, SafeBalance[]>>>,
  ];
  hasMultipleTransactions: boolean;
  transactionTabStatus: boolean[];
  handleTransactionTabStatusChange: React.Dispatch<
    React.SetStateAction<boolean[]>
  >;
  removeTab: UseFieldArrayRemove;
}

const TransactionTypesSection = ({
  colony,
  selectedContractMethods,
  handleSelectedContractMethodsChange,
  transactionIndex,
  disabledSectionInputs,
  prevSafeChainId,
  handlePrevSafeChainIdChange,
  savedTokenState,
  hasMultipleTransactions,
  transactionTabStatus,
  handleTransactionTabStatusChange,
  removeTab,
}: Props) => {
  const {
    formState: { dirtyFields },
    watch,
    setValue,
    resetField,
  } = useFormContext();
  const selectedSafe: SelectedPickerItem = watch('safe');

  const handleSelectedContractMethods = (contractMethods: UpdatedMethods) => {
    const functionParamTypes: FunctionParamType[] | undefined = contractMethods[
      transactionIndex
    ]?.inputs?.map((input) => ({
      name: input.name || '',
      type: input.type || '',
    }));

    handleSelectedContractMethodsChange(contractMethods);
    setValue(
      `transactions.${transactionIndex}.functionParamTypes`,
      functionParamTypes,
    );
  };

  const removeSelectedContractMethod = () => {
    const updatedSelectedContractMethods = omit(
      selectedContractMethods,
      transactionIndex,
    );

    if (!isEqual(updatedSelectedContractMethods, selectedContractMethods)) {
      handleSelectedContractMethods(updatedSelectedContractMethods);
      setValue(`transactions.${transactionIndex}.contractFunction`, '');
    }
  };

  const renderTransactionSection = () => {
    const transactionType = watch(
      `transactions.${transactionIndex}.transactionType`,
    );

    switch (transactionType) {
      case SafeTransactionType.TransferFunds:
        return (
          <TransferFundsSection
            colony={colony}
            disabledInput={disabledSectionInputs}
            transactionIndex={transactionIndex}
            savedTokenState={savedTokenState}
          />
        );
      case SafeTransactionType.RawTransaction:
        return (
          <RawTransactionSection
            colony={colony}
            disabledInput={disabledSectionInputs}
            transactionIndex={transactionIndex}
          />
        );
      case SafeTransactionType.ContractInteraction:
        return (
          <ContractInteractionSection
            colony={colony}
            disabledInput={disabledSectionInputs}
            transactionIndex={transactionIndex}
            selectedContractMethods={selectedContractMethods}
            handleSelectedContractMethods={handleSelectedContractMethods}
            removeSelectedContractMethod={removeSelectedContractMethod}
            prevSafeChainId={prevSafeChainId}
            handlePrevSafeChainIdChange={handlePrevSafeChainIdChange}
          />
        );
      case SafeTransactionType.TransferNft:
        return (
          <TransferNFTSection
            colony={colony}
            disabledInput={disabledSectionInputs}
            transactionIndex={transactionIndex}
          />
        );
      default:
        return null;
    }
  };

  const handleTransactionTypeChange = (type: string, index: number) => {
    const setContractFunction = (contractFunction: string) =>
      setValue(`transactions.${index}.contractFunction`, contractFunction);
    switch (type) {
      case SafeTransactionType.TransferFunds:
        setContractFunction(ContractFunctions.TRANSFER_FUNDS);
        break;
      case SafeTransactionType.TransferNft:
        setContractFunction(ContractFunctions.TRANSFER_NFT);
        break;
      default:
        setContractFunction('');
        break;
    }
  };

  return (
    <div>
      {hasMultipleTransactions && (
        <TransactionHeader
          transactionIndex={transactionIndex}
          transactionTabStatus={transactionTabStatus}
          handleTransactionTabStatusChange={handleTransactionTabStatusChange}
          selectedContractMethods={selectedContractMethods}
          handleSelectedContractMethodsChange={
            handleSelectedContractMethodsChange
          }
          removeTab={removeTab}
        />
      )}
      <div
        className={classnames({
          [styles.tabContentClosed]:
            hasMultipleTransactions && !transactionTabStatus[transactionIndex],
        })}
      >
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <div className={styles.transactionTypeSelectContainer}>
            <Select
              options={transactionOptions}
              label={MSG.transactionLabel}
              name={`transactions[${transactionIndex}].transactionType`}
              onChange={(type) => {
                removeSelectedContractMethod();
                resetField(`transactions.${transactionIndex}`, {
                  defaultValue: {
                    ...defaultTransaction,
                    transactionType: type,
                  },
                });
                handleTransactionTypeChange(type as string, transactionIndex);
              }}
              appearance={{ theme: 'grey', width: 'fluid' }}
              placeholder={MSG.transactionPlaceholder}
              disabled={disabledSectionInputs}
            />
          </div>
        </DialogSection>
        {isEmpty(selectedSafe) && !isEmpty(dirtyFields) ? (
          <ErrorMessage error={MSG.invalidSafeError} />
        ) : (
          renderTransactionSection()
        )}
      </div>
    </div>
  );
};

TransactionTypesSection.displayName = displayName;

export default TransactionTypesSection;
