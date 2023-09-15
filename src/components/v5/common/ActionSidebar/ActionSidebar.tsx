import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { useIntl } from 'react-intl';

import { FormProvider } from 'react-hook-form';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import {
  useActionForm,
  useNotificationBanner,
  useUserHasPermissions,
} from './hooks';
import ActionButtons from './partials/ActionButtons';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import ActionTypeSelect from './ActionTypeSelect';
import PopularActions from './partials/PopularActions';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';
import Modal from '~v5/shared/Modal';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const {
    form,
    selectedAction,
    hasErrors,
    formComponent: FormComponent,
    getFormOptions,
    onSubmit,
  } = useActionForm();
  const intl = useIntl();
  const {
    actionSidebarToggle: [
      ,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggle: toggleCancelModalOff }],
  } = useActionSidebarContext();
  const [isSidebarFullscreen, { toggle: toggleIsSidebarFullscreen }] =
    useToggle();
  const isMobile = useMobile();
  const userHasPermissions = useUserHasPermissions();
  const notificationBanner = useNotificationBanner(hasErrors, selectedAction);

  return (
    <div
      className={clsx(
        `
          fixed
          top-0
          right-0
          bottom-0
          w-full
          h-full
          bg-base-white
          rounded-bl-lg
          border-l
          border-gray-200
          shadow-default
          transition-all
          z-[60]
          flex
          flex-col
        `,
        {
          'sm:max-w-[43.375rem]': !isSidebarFullscreen,
        },
      )}
      ref={registerContainerRef}
    >
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col h-full"
        >
          <div className="py-4 px-6 flex w-full items-center justify-between border-b border-gray-200">
            {isMobile ? (
              <button
                type="button"
                className="py-2.5 flex items-center justify-center text-gray-400"
                onClick={toggleActionSidebarOff}
                aria-label={intl.formatMessage({ id: 'ariaLabel.closeModal' })}
              >
                <Icon name="close" appearance={{ size: 'tiny' }} />
              </button>
            ) : (
              <button
                type="button"
                className="py-2.5 flex items-center justify-center text-gray-400"
                onClick={toggleIsSidebarFullscreen}
                aria-label={intl.formatMessage({ id: 'ariaLabel.fullWidth' })}
              >
                <Icon
                  name={
                    isSidebarFullscreen
                      ? 'arrow-right-line'
                      : 'arrows-out-simple'
                  }
                  appearance={{ size: 'tiny' }}
                />
              </button>
            )}
            {children}
          </div>
          <div className="px-6 py-8 flex-grow">
            <input
              type="text"
              className={`
                heading-3 placeholder:text-gray-500
                hover:text-blue-400 hover:placeholder:text-blue-400 text-gray-900
                transition-colors duration-normal mb-7
              `}
              placeholder={intl.formatMessage({ id: 'placeholder.title' })}
            />
            <ActionTypeSelect />
            {FormComponent && <FormComponent getFormOptions={getFormOptions} />}
            {notificationBanner && (
              <div className="mt-7">
                <NotificationBanner {...notificationBanner} />
              </div>
            )}
          </div>
          <div className="mt-auto">
            {!selectedAction && (
              <PopularActions
                setSelectedAction={(action) =>
                  form.setValue(ACTION_TYPE_FIELD_NAME, action)
                }
              />
            )}
            <ActionButtons
              isActionDisabled={!userHasPermissions || !selectedAction}
            />
          </div>
        </form>

        <Modal
          title={intl.formatMessage({ id: 'actionSidebar.cancelModal.title' })}
          subTitle={intl.formatMessage({
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
          confirmMessage={intl.formatMessage({ id: 'button.cancelAction' })}
          closeMessage={intl.formatMessage({
            id: 'button.continueAction',
          })}
        />
      </FormProvider>
    </div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
