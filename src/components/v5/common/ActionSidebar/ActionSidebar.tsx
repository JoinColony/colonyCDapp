import React, { FC, PropsWithChildren, useRef, useState } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';
import { useOnClickOutside } from 'usehooks-ts';

import styles from './ActionSidebar.module.css';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useActionSidebar, useUserPermissionsErrors } from './hooks';
import ActionsContent from '../ActionsContent';
import { Actions } from '~constants/actions';
import ActionButtons from './partials/ActionButtons';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import TransactionTable from '../ActionsContent/partials/TransactionTable';
import ActionTypeSelect from './ActionTypeSelect';
import PopularActions from './partials/PopularActions';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef(null);
  const [isSidebarFullscreen, setIsSidebarFullscreen] = useState(false);
  const { formatMessage } = useIntl();
  const isMobile = useMobile();
  const {
    toggleActionSidebarOff,
    selectedAction,
    setSelectedAction,
    isCancelModalOpen,
    isAvatarModalOpened,
  } = useActionSidebarContext();
  const { prepareNofiticationTitle, formComponentsByAction, isFieldError } =
    useActionSidebar(selectedAction);

  const isUserHasPermission = useUserPermissionsErrors();
  const actionsWithErrorBanners =
    selectedAction === Actions.UNLOCK_TOKEN ||
    selectedAction === Actions.ENTER_RECOVERY_MODE;
  const showErrorBanner =
    (isUserHasPermission && selectedAction) || actionsWithErrorBanners;

  useOnClickOutside(
    ref,
    () =>
      !isMobile &&
      !isCancelModalOpen &&
      !isAvatarModalOpened &&
      toggleActionSidebarOff(),
  );

  const formContent = (
    <>
      <div className="px-6 py-8 overflow-scroll h-[40rem]">
        {!selectedAction && (
          <>
            <input
              type="text"
              className={styles.titleInput}
              placeholder={formatMessage({ id: 'placeholder.title' })}
            />
            <ActionTypeSelect />
          </>
        )}

        {selectedAction && <ActionsContent />}
        {(showErrorBanner || isFieldError) && (
          <div className="mt-7">
            <NotificationBanner
              status={
                actionsWithErrorBanners || isFieldError ? 'error' : 'warning'
              }
              title={{
                id: prepareNofiticationTitle(),
              }}
              action={{
                type: 'call-to-action',
                actionText: actionsWithErrorBanners ? { id: 'learn.more' } : '',
                onClick: () => {},
              }}
            />
          </div>
        )}
        {selectedAction === Actions.SIMPLE_PAYMENT && <TransactionTable />}
      </div>

      <div className="mt-auto">
        {!selectedAction && (
          <PopularActions setSelectedAction={setSelectedAction} />
        )}
        <ActionButtons isActionDisabled={isUserHasPermission} />
      </div>
    </>
  );

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
