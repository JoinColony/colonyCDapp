import { ColonyRole } from '@colony/colony-js';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { defineMessages, FormattedMessage } from 'react-intl';

import { SAFE_INTEGRATION_LEARN_MORE } from '~constants/externalUrls';
import Button from '~shared/Button';
import { DialogSection } from '~shared/Dialog';
import ExternalLink from '~shared/ExternalLink';
import Heading from '~shared/Heading';
import Icon from '~shared/Icon';
import { filterUserSelection } from '~shared/SingleUserPicker';
import { SelectedPickerItem, SafeTransactionType } from '~types';
import { noMotionsVotingReputationVersion } from '~utils/colonyMotions';
import { defaultTransaction } from '~utils/safes';

import { NotEnoughReputation } from '../Messages';

import AddItemButton from './AddItemButton';
import { useControlSafeDialogStatus } from './helpers';
import SafeTransactionPreview from './SafeTransactionPreview';
import SingleSafePicker from './SingleSafePicker';
import TransactionTypesSection from './TransactionTypesSection';
import { ControlSafeProps } from './types';

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
  buttonTransaction: {
    id: `${displayName}.buttonTransaction`,
    defaultMessage: `Add another transaction`,
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
  handleShowPreviewChange,
  handleIsForceChange,
  isForce,
}: ControlSafeProps) => {
  const [prevSafeChainId, setPrevSafeChainId] = useState<number | undefined>();
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const savedTokenState = useState({});

  const {
    formState: { isSubmitting, isValid, isDirty },
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

  const disabledSectionInputs =
    !isSupportedColonyVersion || (!userHasPermission && canOnlyForceAction);

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

  const continueButtonProps = {
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
                excludeFilterValue
              />
            </div>
          </DialogSection>
          {fields.map((transaction, index) => (
            <TransactionTypesSection
              key={transaction.id}
              transactionIndex={index}
              colony={colony}
              selectedContractMethods={selectedContractMethods}
              handleSelectedContractMethodsChange={setSelectedContractMethods}
              transactionTabStatus={transactionTabStatus}
              handleTransactionTabStatusChange={setTransactionTabStatus}
              removeTab={removeTab}
              savedTokenState={savedTokenState}
              prevSafeChainId={prevSafeChainId}
              handlePrevSafeChainIdChange={setPrevSafeChainId}
              disabledSectionInputs={disabledSectionInputs}
              hasMultipleTransactions={fields.length > 1}
            />
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
        {(back || showPreview) && (
          <Button
            appearance={{ theme: 'secondary', size: 'large' }}
            onClick={
              showPreview ? () => handleShowPreviewChange(!showPreview) : back
            }
            text={{ id: 'button.back' }}
          />
        )}
        {showPreview && (
          <Button
            {...continueButtonProps}
            text={MSG.buttonCreateTransaction}
            appearance={{ theme: 'primary', size: 'large' }}
            type="submit"
          />
        )}
        {!showPreview && (
          <Button
            {...continueButtonProps}
            text={{ id: 'button.continue' }}
            type="button"
            appearance={{ theme: 'primary', size: 'large' }}
            onClick={() => handleShowPreviewChange(!showPreview)}
          />
        )}
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
