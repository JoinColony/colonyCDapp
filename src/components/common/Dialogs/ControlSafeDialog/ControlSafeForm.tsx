import React, { useEffect, useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ColonyRole } from '@colony/colony-js';
import classnames from 'classnames';

import { DialogSection } from '~shared/Dialog';
import { HookFormSelect as Select } from '~shared/Fields';
import Heading from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import Button from '~shared/Button';
import Icon from '~shared/Icon';
import { filterUserSelection } from '~shared/SingleUserPicker';
import {
  SelectedPickerItem,
  FunctionParamType,
  SafeTransactionType,
} from '~types';
import { SAFE_INTEGRATION_LEARN_MORE } from '~constants/externalUrls';
import { isEmpty, isEqual, omit } from '~utils/lodash';
import { defaultTransaction } from '~utils/safes';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';

import { NotEnoughReputation } from '../Messages';
import {
  TransferNFTSection,
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
  ErrorMessage,
} from './TransactionTypesSection';
import {
  transactionOptions,
  ContractFunctions,
  useControlSafeDialogStatus,
} from './helpers';
import { ControlSafeProps, UpdatedMethods } from './types';
import AddItemButton from './AddItemButton';
import SingleSafePicker from './SingleSafePicker';
import TransactionHeader from './TransactionHeader';
import SafeTransactionPreview from './SafeTransactionPreview';

import styles from './ControlSafeForm.css';

const displayName = 'common.ControlSafeDialog.ControlSafeForm';

const MSG = defineMessages({
  title: {
    id: `${displayName}.title`,
    defaultMessage: `Control Safe`,
  },
  description: {
    id: `${displayName}.description`,
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: `${displayName}.selectSafe`,
    defaultMessage: `Select Safe`,
  },
  safePickerPlaceholder: {
    id: `${displayName}.safePickerPlaceholder`,
    defaultMessage: `Select Safe to control`,
  },
  transactionLabel: {
    id: `${displayName}.transactionLabel`,
    defaultMessage: `Select transaction type`,
  },
  transactionPlaceholder: {
    id: `${displayName}.transactionPlaceholder`,
    defaultMessage: `Select transaction`,
  },
  buttonTransaction: {
    id: `${displayName}.buttonTransaction`,
    defaultMessage: `Add another transaction`,
  },
  invalidSafeError: {
    id: `${displayName}.invalidSafeError`,
    defaultMessage: `Select a safe from the menu or add a new one via Safe Control`,
  },
  warningIconTitle: {
    id: `${displayName}.warningIconTitle`,
    defaultMessage: `Warning!`,
  },
  upgradeWarning: {
    id: `${displayName}.upgradeWarning`,
    defaultMessage: `Controlling a Safe is not supported on your current Colony version. Please upgrade Colony to at least version 12.{break}You can do this via <span>New Action > Advanced > Upgrade</span>`,
  },
  buttonCreateTransaction: {
    id: `${displayName}.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
});

export const { invalidSafeError } = MSG;

const ReadMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={SAFE_INTEGRATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const UpgradeWarning = (chunks: React.ReactNode[]) => (
  <span className={styles.upgradePath}>{chunks}</span>
);

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

const ControlSafeForm = ({
  back,
  colony,
  colony: { metadata },
  enabledExtensionData,
  selectedContractMethods,
  setSelectedContractMethods,
  showPreview,
  setShowPreview,
  handleIsForceChange,
  isForce,
}: ControlSafeProps) => {
  const [prevSafeAddress, setPrevSafeAddress] = useState<string>('');
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const savedTokenState = useState({});

  const {
    formState: { isSubmitting, dirtyFields, isValid, isDirty },
    watch,
    setValue,
    trigger,
    control,
  } = useFormContext();

  const selectedSafe: SelectedPickerItem = watch('safe');
  const safes = metadata?.safes || [];
  const forceAction: boolean = watch('forceAction');

  const {
    fields,
    append,
    remove: removeTab,
  } = useFieldArray({
    control,
    name: 'transactions',
  });

  const {
    userHasPermission,
    canOnlyForceAction,
    disabledInput: disablePreviewInputs,
    isSupportedColonyVersion,
  } = useControlSafeDialogStatus(colony, requiredRoles, enabledExtensionData);

  const { votingReputationVersion } = enabledExtensionData;

  const handleNewTab = () => {
    append(defaultTransaction);
    setTransactionTabStatus([
      ...Array(transactionTabStatus.length).fill(false),
      true,
    ]);
    trigger();
  };

  const handleSelectedContractMethods = (
    contractMethods: UpdatedMethods,
    transactionIndex: number,
  ) => {
    const functionParamTypes: FunctionParamType[] | undefined = contractMethods[
      transactionIndex
    ]?.inputs?.map((input) => ({
      name: input.name || '',
      type: input.type || '',
    }));

    setSelectedContractMethods(contractMethods);
    setValue(
      `transactions.${transactionIndex}.functionParamTypes`,
      functionParamTypes,
    );
  };

  const removeSelectedContractMethod = (transactionIndex: number) => {
    const updatedSelectedContractMethods = omit(
      selectedContractMethods,
      transactionIndex,
    );

    if (!isEqual(updatedSelectedContractMethods, selectedContractMethods)) {
      handleSelectedContractMethods(
        updatedSelectedContractMethods,
        transactionIndex,
      );
      setValue(`transactions.${transactionIndex}.contractFunction`, '');
    }
  };

  const disabledSectionInputs =
    !isSupportedColonyVersion || (!userHasPermission && canOnlyForceAction);

  const renderTransactionSection = (transactionIndex: number) => {
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

  const handleSafeChange = (newSafe: SelectedPickerItem) => {
    const safeAddress = newSafe?.walletAddress;

    if (safeAddress !== prevSafeAddress) {
      setPrevSafeAddress(safeAddress);
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

  useEffect(() => {
    if (!selectedSafe) {
      for (let i = 0; i < fields.length; i += 1) {
        const transactionType = watch(`transactions.${i}.transactionType`);

        if (transactionType === SafeTransactionType.TransferNft) {
          setValue(`transactions.${i}.nft`, null);
          setValue(`transactions.${i}.nftData`, null);
        }
      }
    }
  }, [fields, watch, setValue, selectedSafe]);

  const handleShowPreview = (isPreview: boolean) => {
    setShowPreview(!isPreview);
  };

  const submitButtonText = (() => {
    if (!showPreview) {
      return MSG.buttonCreateTransaction;
    }
    return { id: 'button.confirm' };
  })();

  const continueButtonProps = {
    text: submitButtonText,
    loading: isSubmitting,
    disabled:
      !isValid ||
      isSubmitting ||
      !isDirty ||
      (showPreview &&
        votingReputationVersion === noMotionsVotingReputationVersion &&
        !forceAction),
    style: { width: styles.wideButton },
  };

  useEffect(() => {
    if (forceAction !== isForce) {
      handleIsForceChange(forceAction);
    }
  }, [forceAction, isForce, handleIsForceChange]);

  return (
    <>
      {!showPreview ? (
        <>
          <DialogSection>
            <div className={styles.heading}>
              <Heading
                appearance={{ size: 'medium', margin: 'none', theme: 'dark' }}
                text={MSG.title}
              />
            </div>
          </DialogSection>
          <DialogSection appearance={{ theme: 'sidePadding' }}>
            <FormattedMessage
              {...MSG.description}
              values={{
                a: ReadMoreLink,
              }}
            />
          </DialogSection>
          {!isSupportedColonyVersion && (
            <DialogSection appearance={{ theme: 'sidePadding' }}>
              <div className={styles.upgradeWarning}>
                <Icon
                  name="triangle-warning"
                  className={styles.warningIcon}
                  title={MSG.warningIconTitle}
                />
                <div>
                  <FormattedMessage
                    {...MSG.upgradeWarning}
                    values={{
                      span: UpgradeWarning,
                      break: <br />,
                    }}
                  />
                </div>
              </div>
            </DialogSection>
          )}
          <DialogSection>
            <div className={styles.safePicker}>
              <SingleSafePicker
                label={MSG.selectSafe}
                name="safe"
                data={safes}
                placeholder={MSG.safePickerPlaceholder}
                filter={filterUserSelection}
                disabled={disabledSectionInputs}
                onSelected={handleSafeChange}
              />
            </div>
          </DialogSection>
          {fields.map((transaction, index) => (
            <div key={transaction.id}>
              {fields.length > 1 && (
                <TransactionHeader
                  transactionIndex={index}
                  transactionTabStatus={transactionTabStatus}
                  handleTransactionTabStatus={setTransactionTabStatus}
                  selectedContractMethods={selectedContractMethods}
                  handleSelectedContractMethods={setSelectedContractMethods}
                  removeTab={removeTab}
                />
              )}
              <div
                className={classnames({
                  [styles.tabContentClosed]:
                    fields.length > 1 && !transactionTabStatus[index],
                })}
              >
                <DialogSection appearance={{ theme: 'sidePadding' }}>
                  <div className={styles.transactionTypeSelectContainer}>
                    <Select
                      options={transactionOptions}
                      label={MSG.transactionLabel}
                      name={`transactions[${index}].transactionType`}
                      onChange={(type) => {
                        removeSelectedContractMethod(index);
                        handleTransactionTypeChange(type as string, index);
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
                  renderTransactionSection(index)
                )}
              </div>
            </div>
          ))}
          <DialogSection>
            <div className={styles.addTransaction}>
              <AddItemButton
                text={MSG.buttonTransaction}
                disabled={disabledSectionInputs}
                handleClick={() => handleNewTab()}
              />
            </div>
          </DialogSection>
        </>
      ) : (
        <SafeTransactionPreview
          colony={colony}
          selectedContractMethods={selectedContractMethods}
          isVotingExtensionEnabled={
            enabledExtensionData.isVotingReputationEnabled
          }
          userHasPermission={userHasPermission}
          disabledInput={disablePreviewInputs}
        />
      )}
      {canOnlyForceAction && (!userHasPermission || showPreview) && (
        <DialogSection appearance={{ theme: 'sidePadding' }}>
          <NotEnoughReputation
            appearance={{ marginTop: 'negative' }}
            includeForceCopy={userHasPermission}
          />
        </DialogSection>
      )}
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={showPreview ? () => handleShowPreview(showPreview) : back}
          text={{ id: 'button.back' }}
        />
        {showPreview && (
          <Button
            {...continueButtonProps}
            appearance={{ theme: 'primary', size: 'large' }}
            type="submit"
          />
        )}
        {!showPreview && (
          <Button
            {...continueButtonProps}
            type="button"
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleShowPreview(showPreview)}
          />
        )}
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
