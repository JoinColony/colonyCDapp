import React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { ColonyRole, Id } from '@colony/colony-js';

import Avatar from '~shared/Avatar';
import { DialogSection } from '~shared/Dialog';
import { HookFormSelect as Select } from '~shared/Fields';
import Heading from '~shared/Heading';
import ExternalLink from '~shared/ExternalLink';
import Button, { AddItemButton } from '~shared/Button';
import Icon from '~shared/Icon';
import {
  SingleSafePicker,
  filterUserSelection,
} from '~shared/SingleUserPicker';
import { Safe } from '~types';

import { SAFE_INTEGRATION_LEARN_MORE } from '~constants/externalUrls';
import { useActionDialogStatus } from '~hooks';
import { isEmpty } from '~utils/lodash';

/* import {
 *   defaultTransaction,
 *   FormValues,
 *   UpdatedMethods,
 * } from './ControlSafeDialog'; */
import {
  TransferNFTSection,
  TransferFundsSection,
  RawTransactionSection,
  ContractInteractionSection,
  ErrorMessage,
} from './TransactionTypesSection';
import { TransactionTypes, transactionOptions } from './constants';
import { ControlSafeProps } from './types';

import styles from './ControlSafeForm.css';

const MSG = defineMessages({
  title: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.title',
    defaultMessage: 'Control Safe',
  },
  description: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.description',
    defaultMessage: `You can use Control Safe to interact with other third party smart contracts. Be careful. <a>Learn more</a>`,
  },
  selectSafe: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.selectSafe',
    defaultMessage: 'Select Safe',
  },
  safePickerPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.safePickerPlaceholder`,
    defaultMessage: 'Select Safe to control',
  },
  transactionLabel: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionLabel`,
    defaultMessage: 'Select transaction type',
  },
  transactionPlaceholder: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionPlaceholder`,
    defaultMessage: 'Select transaction',
  },
  buttonTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.buttonTransaction`,
    defaultMessage: 'Add another transaction',
  },
  buttonCreateTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.buttonCreateTransaction`,
    defaultMessage: 'Create transaction',
  },
  transactionTitle: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.transactionTitle`,
    defaultMessage: `Transaction #{transactionNumber} {transactionType, select, undefined {} other {({transactionType})}}`,
  },
  toggleTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.toggleTransaction`,
    defaultMessage:
      '{tabToggleStatus, select, true {Expand} false {Close}} transaction',
  },
  deleteTransaction: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.deleteTransaction`,
    defaultMessage: 'Delete transaction',
  },
  deleteTransactionTooltipText: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.deleteTransactionTooltipText`,
    defaultMessage: `Delete transaction.\nBe careful, data can be lost.`,
  },
  invalidSafeError: {
    id: `dashboard.ControlSafeDialog.ControlSafeForm.invalidSafeError`,
    defaultMessage:
      'Select a safe from the menu or add a new one via Safe Control',
  },
  warningIconTitle: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.warningIconTitle',
    defaultMessage: `Warning!`,
  },
  upgradeWarning: {
    id: 'dashboard.ControlSafeDialog.ControlSafeForm.upgradeWarning',
    defaultMessage: `Controlling a Safe is not supported on your current Colony version. Please upgrade Colony to at least version 12.{break}You can do this via <span>New Action > Advanced > Upgrade</span>`,
  },
});

export const { invalidSafeError } = MSG;
const displayName = 'dashboard.ControlSafeDialog.ControlSafeForm';

const renderAvatar = (item) => (
  <Avatar
    seed={item.address.toLocaleLowerCase()}
    size="xs"
    notSet={false}
    title={item.name}
    placeholderIcon="at-sign-circle"
  />
);

const ReadMoreLink = (chunks: React.ReactNode[]) => (
  <ExternalLink href={SAFE_INTEGRATION_LEARN_MORE}>{chunks}</ExternalLink>
);

const UpgradeWarning = (chunks: React.ReactNode[]) => (
  <span className={styles.upgradePath}>{chunks}</span>
);

const requiredRoles: ColonyRole[] = [ColonyRole.Root];

const hardcodedSafes: Safe[] = [
  {
    name: 'test',
    chainId: 56,
    address: '0xe759f388c97674D5B8a60406b254aB59f194163d',
    moduleContractAddress: '0xe759f388c97674D5B8a60406b254aB59f194163d',
  },
  {
    name: 'test2',
    chainId: 1,
    address: '0x3F107AFF0342Cfb5519A68B3241565F6FC9BAC1e',
    moduleContractAddress: '0xe759f388c97674D5B8a60406b254aB59f194163w',
  },
  {
    name: 'test3',
    chainId: 5,
    address: '0x3F107AFF0342Cfb5519A68B3241565F6FC9BAC2e',
    moduleContractAddress: '0xe759f388c97674D5B8a60406b254aB59f194163e',
  },
];

const ControlSafeForm = ({
  back,
  colony,
  colony: { version, metadata },
  enabledExtensionData,
}: ControlSafeProps) => {
  const {
    formState: { isSubmitting, dirtyFields },
    watch,
  } = useFormContext();
  const selectedSafe = watch('safe');
  const transactionType = watch('transactions.transactionType');

  const { userHasPermission } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  const submitButtonText = (() => {
    return { id: 'button.confirm' };
  })();

  const isSupportedColonyVersion = version >= 12;

  const disabledInputs =
    !userHasPermission || isSubmitting || !isSupportedColonyVersion;

  const renderTransactionSection = () => {
    switch (transactionType) {
      case TransactionTypes.TRANSFER_FUNDS:
        return <TransferFundsSection />;
      case TransactionTypes.RAW_TRANSACTION:
        return <RawTransactionSection />;
      case TransactionTypes.CONTRACT_INTERACTION:
        return <ContractInteractionSection />;
      case TransactionTypes.TRANSFER_NFT:
        return <TransferNFTSection />;
      default:
        return null;
    }
  };

  /* const handleSafeChange = (selectedSafe: SelectedSafe) => {
   *   const safeAddress = selectedSafe.profile.walletAddress;
   *   if (safeAddress !== prevSafeAddress) {
   *     setPrevSafeAddress(safeAddress);
   *     values.transactions.forEach((tx, i) => {
   *       if (tx.transactionType === TransactionTypes.TRANSFER_NFT) {
   *         setFieldValue(`transactions.${i}.nft`, null);
   *         setFieldValue(`transactions.${i}.nftData`, null);
   *       }
   *     });
   *   }
   * }; */

  const safes = metadata?.safes || hardcodedSafes;

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
            renderAvatar={renderAvatar}
            disabled={disabledInputs}
            /* onSelected={handleSafeChange} */
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
            disabled={false}
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
