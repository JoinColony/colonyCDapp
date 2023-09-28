import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { useFormContext } from 'react-hook-form';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import {
  useActionFormProps,
  useCloseSidebarClick,
  useNotificationBanner,
  useSidebarActionForm,
  useUserHasPermissions,
} from './hooks';
import ActionButtons from './partials/ActionButtons';
import NotificationBanner from '~common/Extensions/NotificationBanner';
import ActionTypeSelect from './ActionTypeSelect';
import PopularActions from './partials/PopularActions';
import useToggle from '~hooks/useToggle';
import { ACTION_TYPE_FIELD_NAME } from './consts';
import Modal from '~v5/shared/Modal';
import { ActionForm } from '~shared/Fields';
import { ActionFormBaseProps } from './types';
import { formatText } from '~utils/intl';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import FormInputBase from '../Fields/InputBase/FormInputBase';
import { FIELD_STATE } from '../Fields/consts';

const displayName = 'v5.common.ActionSidebar';

interface Props extends ActionFormBaseProps {
  toggleIsSidebarFullscreen: () => void;
  isSidebarFullscreen: boolean;
}

const ActionSidebarFormContent: FC<PropsWithChildren<Props>> = ({
  children,
  toggleIsSidebarFullscreen,
  isSidebarFullscreen,
  getFormOptions,
}) => {
  const {
    formComponent: FormComponent,
    hasErrors,
    selectedAction,
  } = useSidebarActionForm();
  const isMobile = useMobile();
  const userHasPermissions = useUserHasPermissions();
  const form = useFormContext();
  const notificationBanner = useNotificationBanner(hasErrors, selectedAction);
  const closeSidebarClick = useCloseSidebarClick();

  return (
    <>
      <div className="py-4 px-6 flex w-full items-center justify-between border-b border-gray-200">
        {isMobile ? (
          <button
            type="button"
            className="py-2.5 flex items-center justify-center text-gray-400"
            onClick={closeSidebarClick}
            aria-label={formatText({ id: 'ariaLabel.closeModal' })}
          >
            <Icon name="close" appearance={{ size: 'tiny' }} />
          </button>
        ) : (
          <button
            type="button"
            className="py-2.5 flex items-center justify-center text-gray-400"
            onClick={toggleIsSidebarFullscreen}
            aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
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
      <div className="px-6 py-8 flex-grow overflow-y-auto mr-1">
        <FormInputBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          stateClassNames={{
            [FIELD_STATE.Error]: 'placeholder:text-red-400',
          }}
          className={clsx(
            `
              heading-3
              md:hover:text-blue-400 md:hover:placeholder:text-blue-400 text-gray-900
              transition-colors mb-7
            `,
          )}
          mode="secondary"
          message={false}
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
    </>
  );
};

const ActionSidebar: FC<PropsWithChildren> = ({ children }) => {
  const { getFormOptions, actionFormProps } = useActionFormProps();
  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();
  const [isSidebarFullscreen, { toggle: toggleIsSidebarFullscreen }] =
    useToggle();

  useDisableBodyScroll(isActionSidebarOpen);

  return (
    <div
      className={clsx(
        `
          fixed
          top-0
          right-0
          bottom-0
          w-full
          bg-base-white
          rounded-bl-lg
          border-l
          border-gray-200
          shadow-default
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
      <ActionForm {...actionFormProps} className="flex flex-col h-full">
        <ActionSidebarFormContent
          toggleIsSidebarFullscreen={toggleIsSidebarFullscreen}
          isSidebarFullscreen={isSidebarFullscreen}
          getFormOptions={getFormOptions}
        >
          {children}
        </ActionSidebarFormContent>
      </ActionForm>

      <Modal
        title={formatText({ id: 'actionSidebar.cancelModal.title' })}
        subTitle={formatText({
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
        confirmMessage={formatText({ id: 'button.cancelAction' })}
        closeMessage={formatText({
          id: 'button.continueAction',
        })}
      />
    </div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
