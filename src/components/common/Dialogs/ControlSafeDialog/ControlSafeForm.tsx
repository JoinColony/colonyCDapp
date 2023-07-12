import React /* { useCallback, useEffect, useMemo, useState } */ from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import { useFormContext } from 'react-hook-form';
import { ColonyRole, Id } from '@colony/colony-js';
/* import classnames from 'classnames';
 * import { nanoid } from 'nanoid'; */

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
/* import IconTooltip from '~shared/IconTooltip'; */

import { SAFE_INTEGRATION_LEARN_MORE } from '~constants/externalUrls';
import { useActionDialogStatus } from '~hooks';
/* import {
 *   Colony,
 *   ColonySafe,
 *   SafeTransaction,
 *   useLoggedInUser,
 * } from '~data/index'; */
/* import { useDialogActionPermissions } from '~utils/hooks/useDialogActionPermissions'; */
/* import { PrimitiveType } from '~types/index'; */
/* import { SelectedSafe } from '~modules/dashboard/sagas/utils/safeHelpers'; */
import { isEmpty } from '~utils/lodash';
/* import NotEnoughReputation from '~dashboard/NotEnoughReputation'; */

/* import SafeTransactionPreview from './SafeTransactionPreview'; */
/* import {
 *   defaultTransaction,
 *   FormValues,
 *   UpdatedMethods,
 * } from './ControlSafeDialog'; */
import {
  /* TransferNFTSection,
   * TransferFundsSection,
   * RawTransactionSection,
   * ContractInteractionSection, */
  ErrorMessage,
} from './TransactionTypesSection';
import {
  /* TransactionTypes, */
  transactionOptions,
} from './constants';
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

/* export interface TransactionSectionProps extends Pick<FormProps, 'colony'> {
 *   disabledInput: boolean;
 *   transactionFormIndex: number;
 *   handleInputChange: () => void;
 *   handleValidation: () => void;
 * } */

/* enum ContractFunctions {
 *   TRANSFER_FUNDS = 'transfer',
 *   TRANSFER_NFT = 'safeTransferFrom',
 * } */

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

const ControlSafeForm = ({
  back,
  colony,
  colony: { version, metadata },
  enabledExtensionData,
}: /* ,
 * handleSubmit,
 * isValid,
 * values,
 * setFieldValue,
 * showPreview,
 * setShowPreview,
 * validateForm,
 * dirty,
 * selectedContractMethods,
 * setFieldTouched,
 * setSelectedContractMethods,
 */
ControlSafeProps) => {
  /* const [transactionTabStatus, setTransactionTabStatus] = useState([true]);
   * const [prevSafeAddress, setPrevSafeAddress] = useState<string>(''); */
  const {
    formState: { isSubmitting, dirtyFields },
    watch,
  } = useFormContext();
  const selectedSafe = watch('safe');

  const { userHasPermission } = useActionDialogStatus(
    colony,
    requiredRoles,
    [Id.RootDomain],
    enabledExtensionData,
  );

  /* const handleValidation = useCallback(() => {
   *   // setTimeout ensures form state is latest. Related: https://github.com/jaredpalmer/formik/issues/529
   *   setTimeout(validateForm, 0);
   * }, [validateForm]); */

  /* const handleSelectedContractMethods = useCallback(
*   (contractMethods: UpdatedMethods, index: number) => {
*     // eslint-disable-next-line max-len
       // ++
*     const functionParamTypes: SafeTransaction['functionParamTypes'] =
\*       contractMethods[index]?.inputs?.map((input) => ({
*         name: input.name,
*         type: input.type,
*       }));

*     setSelectedContractMethods(contractMethods);
*     setFieldValue(
*       `transactions.${index}.functionParamTypes`,
*       functionParamTypes,
*     );
*   },
*   [setFieldValue, setSelectedContractMethods],
* ); */

  /* const getTransactionTypeLabel = useCallback(
   *   (transactionTypeValue: string) => {
   *     const transactionType = transactionOptions.find(
   *       (transaction) => transaction.value === transactionTypeValue,
   *     );
   *     return transactionType ? (
   *       <FormattedMessage {...transactionType.label} key={nanoid()} />
   *     ) : null;
   *   },
   *   [],
   * ); */

  const submitButtonText = (() => {
    return { id: 'button.confirm' };
  })();

  const isSupportedColonyVersion = version >= 12;

  const disabledInputs =
    !userHasPermission || isSubmitting || !isSupportedColonyVersion;

  /* const renderTransactionSection = (transaction: SafeTransaction) => {
   *   const { transactionType } = transaction;
   *   switch (transactionType) {
   *     case TransactionTypes.TRANSFER_FUNDS:
   *       return <TransferFundsSection />;
   *     case TransactionTypes.RAW_TRANSACTION:
   *       return <RawTransactionSection />;
   *     case TransactionTypes.CONTRACT_INTERACTION:
   *       return <ContractInteractionSection />;
   *     case TransactionTypes.TRANSFER_NFT:
   *       return <TransferNFTSection />;
   *     default:
   *       return null;
   *   }
   * }; */

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
        {
          /* renderTransactionSection(transaction, index) */
        }
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
