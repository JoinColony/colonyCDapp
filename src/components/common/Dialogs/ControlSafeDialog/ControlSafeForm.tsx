import React, { useState } from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { ColonyRole, Id } from '@colony/colony-js';
import classnames from 'classnames';

import { DialogSection } from '~shared/Dialog';
import { HookFormSelect as Select } from '~shared/Fields';
import Heading from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import Button from '~shared/Button';
import Icon from '~shared/Icon';
import { filterUserSelection } from '~shared/SingleUserPicker';
import { SelectedSafe } from '~types';
import { SAFE_INTEGRATION_LEARN_MORE } from '~constants/externalUrls';
import { useActionDialogStatus } from '~hooks';
import { isEmpty } from '~utils/lodash';

import {
  TransferNFTSection,
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
  ErrorMessage,
} from './TransactionTypesSection';
import {
  TransactionTypes,
  defaultTransaction,
  transactionOptions,
} from './helpers';
import { ControlSafeProps } from './types';
import AddItemButton from './AddItemButton';
import SingleSafePicker from './SingleSafePicker';
import TransactionHeader from './TransactionHeader';

import styles from './ControlSafeForm.css';
import { SelectedSafe } from '~types/safes';

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
});

export const { invalidSafeError } = MSG;

const ReadMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={SAFE_INTEGRATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const UpgradeWarning = (chunks: React.ReactNode[]) => (
  <span className={styles.upgradePath}>{chunks}</span>
);

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

enum ContractFunctions {
  TRANSFER_FUNDS = 'transfer',
  TRANSFER_NFT = 'safeTransferFrom',
}

const ControlSafeForm = ({
  back,
  colony,
  colony: { version, metadata },
  enabledExtensionData,
}: ControlSafeProps) => {
  const [prevSafeAddress, setPrevSafeAddress] = useState<string>('');
  const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
  const savedTokenState = useState({});

  const {
    formState: { isSubmitting, dirtyFields },
    watch,
    setValue,
    trigger,
    control,
  } = useFormContext();
  const selectedSafe = watch('safe');

  const {
    fields,
    append,
    remove: removeTab,
  } = useFieldArray({
    control,
    name: 'transactions',
  });

  const { userHasPermission } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  const handleNewTab = () => {
    append(defaultTransaction);
    setTransactionTabStatus([
      ...Array(transactionTabStatus.length).fill(false),
      true,
    ]);
    trigger();
  };

  const submitButtonText = (() => {
    return { id: 'button.confirm' };
  })();

  const isSupportedColonyVersion = version >= 12;

  /* invert this only for testing! */
  const disabledInputs =
    !userHasPermission || isSubmitting || !isSupportedColonyVersion;

  const renderTransactionSection = (transactionIndex: number) => {
    const transactionType = watch(
      `transactions.${transactionIndex}.transactionType`,
    );

    switch (transactionType) {
      case TransactionTypes.TRANSFER_FUNDS:
        return (
          <TransferFundsSection
            colony={colony}
            disabledInput={disabledInputs}
            transactionFormIndex={0}
            savedTokenState={savedTokenState}
            /* handleInputChange={handleInputChange}
             * handleValidation={handleValidation} */
          />
        );
      case TransactionTypes.RAW_TRANSACTION:
        return (
          <RawTransactionSection
            colony={colony}
            disabledInput={disabledInputs}
            transactionIndex={transactionIndex}
          />
        );
      case TransactionTypes.CONTRACT_INTERACTION:
        return <ContractInteractionSection />;
      case TransactionTypes.TRANSFER_NFT:
        return <TransferNFTSection />;
      default:
        return null;
    }
  };

  const handleSafeChange = (newSafe: SelectedSafe) => {
    const safeAddress = newSafe?.profile?.walletAddress;
    if (safeAddress !== prevSafeAddress) {
      setPrevSafeAddress(safeAddress);
      /* values.transactions.forEach((tx, i) => {
       *   if (tx.transactionType === TransactionTypes.TRANSFER_NFT) {
       *     setFieldValue(`transactions.${i}.nft`, null);
       *     setFieldValue(`transactions.${i}.nftData`, null);
       *   }
       * }); */
    }
  };

  const handleTransactionTypeChange = (type: string, index: number) => {
    const setContractFunction = (contractFunction: string) =>
      setValue(`transactions.${index}.contractFunction`, contractFunction);
    switch (type) {
      case TransactionTypes.TRANSFER_FUNDS:
        setContractFunction(ContractFunctions.TRANSFER_FUNDS);
        break;
      case TransactionTypes.TRANSFER_NFT:
        setContractFunction(ContractFunctions.TRANSFER_NFT);
        break;
      default:
        setContractFunction('');
        break;
    }
  };

  const safes = metadata?.safes || [];

  return (
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
            disabled={disabledInputs}
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
                    /* removeSelectedContractMethod(index); */
                    handleTransactionTypeChange(type as string, index);
                  }}
                  appearance={{ theme: 'grey', width: 'fluid' }}
                  placeholder={MSG.transactionPlaceholder}
                  disabled={disabledInputs}
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
            disabled={isSubmitting}
            handleClick={() => handleNewTab()}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ theme: 'sidePadding' }}>
        <div className={styles.transactionTypeSelectContainer}>
          <Select
            options={transactionOptions}
            label={MSG.transactionLabel}
            name="transactions.transactionType"
            onChange={() =>
              /* type */
              {
                /* removeSelectedContractMethod(index);
              handleTransactionTypeChange(type, index); */
              }
            }
            appearance={{ theme: 'grey', width: 'fluid' }}
            placeholder={MSG.transactionPlaceholder}
            disabled={disabledInputs}
          />
        </div>
      </DialogSection>
      {isEmpty(selectedSafe) && dirtyFields ? (
        <ErrorMessage error={MSG.invalidSafeError} />
      ) : (
        renderTransactionSection()
      )}
      <DialogSection>
        <div className={styles.addTransaction}>
          <AddItemButton
            text={MSG.buttonTransaction}
            disabled
            handleClick={() => {}}
          />
        </div>
      </DialogSection>
      <DialogSection appearance={{ align: 'right', theme: 'footer' }}>
        <Button
          appearance={{ theme: 'secondary', size: 'large' }}
          onClick={back}
          text={{ id: 'button.back' }}
        />
        <Button
          appearance={{ theme: 'primary', size: 'large' }}
          onClick={() => {}}
          text={submitButtonText}
          disabled
          style={{ width: styles.wideButton }}
        />
      </DialogSection>
    </>
  );
};

ControlSafeForm.displayName = displayName;

export default ControlSafeForm;
