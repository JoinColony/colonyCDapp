import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useOnClickOutside } from 'usehooks-ts';

import styles from './ActionSidebar.module.css';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import ActionSidebarRow from '../ActionSidebarRow';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import SearchSelect from '~v5/shared/SearchSelect';
import { useActionsList, useUserPermissionsErrors } from './hooks';
import { translateAction } from './utils';
import ActionsContent from '../ActionsContent';
import PopularActions from './partials/PopularActions';
import useToggle from '~hooks/useToggle';
import SinglePaymentForm from './partials/SinglePaymentForm';
import MintTokenForm from './partials/MintTokenForm';
import { Actions } from '~constants/actions';
import ActionButtons from './partials/ActionButtons';
import TransferFundsForm from './partials/TransferFundsForm';
import CreateNewTeamForm from './partials/CreateNewTeamForm';
import UnlockTokenForm from './partials/UnlockTokenForm';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import UpgradeColonyForm from './partials/UpgradeColonyForm/UpgradeColonyForm';
import Modal from '~v5/shared/Modal';
import { useActionFormContext } from './partials/ActionForm/ActionFormContext';
import TransactionTable from '../ActionsContent/partials/TransactionTable/TransactionTable';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const { toggleActionSidebarOff, selectedAction, setSelectedAction } =
    useActionSidebarContext();
  const actionsList = useActionsList();
  const [
    isSelectVisible,
    { toggle: toggleSelect, toggleOff: toggleSelectOff },
  ] = useToggle();
  const [
    isCancelModalOpen,
    { toggle: toggleCancelModal, toggleOff: toggleCancelModalOff },
  ] = useToggle({ defaultToggleState: false });
  const isUserHasPermission = useUserPermissionsErrors();
  const isUnlockTokenAction = selectedAction === Actions.UNLOCK_TOKEN;
  const showErrorBanner =
    (isUserHasPermission && selectedAction) || isUnlockTokenAction;
  const { formErrors } = useActionFormContext();

  const isFieldError = !!Object.keys?.(formErrors || {}).length;

  const prepareNofiticationTitle = () => {
    let errorMessage;

    if (isUnlockTokenAction) {
      errorMessage = 'actionSidebar.unlock.token.error';
    } else if (isFieldError) {
      errorMessage = 'actionSidebar.fields.error';
    } else {
      errorMessage = 'actionSidebar.mint.token.permission.error';
    }
    return errorMessage;
  };

  useOnClickOutside(
    ref,
    () => !isMobile && !isCancelModalOpen && toggleActionSidebarOff(),
  );

  const formContent = (
    <>
      <div className="px-6 py-8 overflow-scroll h-[40rem]">
        <input
          type="text"
          className={styles.titleInput}
          placeholder={formatMessage({ id: 'placeholder.title' })}
        />
        <ActionSidebarRow
          iconName="file-plus"
          title={{ id: 'actionSidebar.actionType' }}
        >
          <>
            {!selectedAction && (
              <>
                <button
                  type="button"
                  className="flex text-md text-gray-600 transition-colors hover:text-blue-400"
                  onClick={toggleSelect}
                >
                  {formatMessage({
                    id: 'actionSidebar.chooseActionType',
                  })}
                </button>
                {isSelectVisible && (
                  <SearchSelect
                    onToggle={toggleSelectOff}
                    items={actionsList}
                    isOpen={isSelectVisible}
                  />
                )}
              </>
            )}
            {selectedAction && (
              <span className="text-md">
                {formatMessage({ id: translateAction(selectedAction) })}
              </span>
            )}
          </>
        </ActionSidebarRow>
        <ActionsContent formErrors={formErrors} />
        {(showErrorBanner || isFieldError) && (
          <div className="mt-7">
            <NotificationBanner
              status={isUnlockTokenAction || isFieldError ? 'error' : 'warning'}
              title={{
                id: prepareNofiticationTitle(),
              }}
              actionText={
                isUnlockTokenAction ? { id: 'learn.more' } : undefined
              }
              actionType="call-to-action"
            />
          </div>
        )}
        {selectedAction === Actions.SIMPLE_PAYMENT && <TransactionTable />}
      </div>

      <div className="mt-auto">
        {!selectedAction && (
          <PopularActions setSelectedAction={setSelectedAction} />
        )}
        <ActionButtons
          isActionDisabled={isUserHasPermission}
          toggleCancelModal={toggleCancelModal}
        />
      </div>
    </>
  );

  const formComponentsByAction = {
    [Actions.SIMPLE_PAYMENT]: SinglePaymentForm,
    [Actions.MINT_TOKENS]: MintTokenForm,
    [Actions.TRANSFER_FUNDS]: TransferFundsForm,
    [Actions.CREATE_NEW_TEAM]: CreateNewTeamForm,
    [Actions.UNLOCK_TOKEN]: UnlockTokenForm,
    [Actions.UPGRADE_COLONY_VERSION]: UpgradeColonyForm,
  };

  const prepareFormContent = () => {
    const FormComponent = formComponentsByAction[selectedAction as Actions];
    return FormComponent ? (
      <FormComponent>{formContent}</FormComponent>
    ) : (
      formContent
    );
  };

  return (
    <div
      className={clsx(styles.sidebar, {
        'sm:max-w-[43.375rem]': !isSidebarFullscreen,
        'max-w-full': isSidebarFullscreen,
      })}
      ref={ref}
    >
      <Modal
        title={formatMessage({ id: 'actionSidebar.cancelModal.title' })}
        subTitle={formatMessage({
          id: 'actionSidebar.cancelModal.subtitle',
        })}
        isOpen={isCancelModalOpen}
        onClose={toggleCancelModalOff}
        onConfirm={() => {
          toggleCancelModalOff();
          toggleActionSidebarOff();
        }}
        icon="warning-circle"
        buttonMode="primarySolid"
        confirmMessage={formatMessage({ id: 'button.cancelAction' })}
        closeMessage={formatMessage({
          id: 'button.continueAction',
        })}
      />
      <div className="py-4 px-6 flex w-full items-center justify-between border-b border-gray-200">
        {isMobile ? (
          <button
            type="button"
            className={styles.button}
            onClick={toggleActionSidebarOff}
            aria-label={formatMessage({ id: 'ariaLabel.closeModal' })}
          >
            <Icon name="close" appearance={{ size: 'tiny' }} />
          </button>
        ) : (
          <button
            type="button"
            className={styles.button}
            onClick={() => setIsSidebarFullscreen((prevState) => !prevState)}
            aria-label={formatMessage({ id: 'ariaLabel.fullWidth' })}
          >
            <Icon
              name={
                isSidebarFullscreen ? 'arrow-right-line' : 'arrows-out-simple'
              }
              appearance={{ size: 'tiny' }}
            />
          </button>
        )}
        {children}
      </div>
      {prepareFormContent()}
    </div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
