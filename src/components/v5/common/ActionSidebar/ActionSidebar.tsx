import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import { useFormContext } from 'react-hook-form';
import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import {
  useActionDescriptionMetadata,
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
import { ActionSidebarFormContentProps, ActionSidebarProps } from './types';
import { formatText } from '~utils/intl';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import FormInputBase from '../Fields/InputBase/FormInputBase';
import { FIELD_STATE } from '../Fields/consts';
import Motions from './partials/Motions';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebarFormContent: FC<ActionSidebarFormContentProps> = ({
  getFormOptions,
  isMotion,
}) => {
  const { formComponent: FormComponent, selectedAction } =
    useSidebarActionForm();
  const userHasPermissions = useUserHasPermissions();
  const form = useFormContext();
  const notificationBanner = useNotificationBanner();
  const descriptionMetadata = useActionDescriptionMetadata();

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        <FormInputBase
          name="title"
          placeholder={formatText({ id: 'placeholder.title' })}
          stateClassNames={{
            [FIELD_STATE.Error]: 'placeholder:text-red-400',
          }}
          className={`
            heading-3
            md:hover:text-blue-400 md:hover:placeholder:text-blue-400 text-gray-900
            transition-colors
          `}
          mode="secondary"
          message={false}
        />
        <p className="text-gray-600 font-medium mt-2">{descriptionMetadata}</p>
        {/* @todo: add preview mode to the form */}
        <ActionTypeSelect className="mt-7 mb-3" />
        {/* @todo: add motion action type to each action */}
        {FormComponent && <FormComponent getFormOptions={getFormOptions} />}
        {notificationBanner && (
          <div className="mt-7">
            <NotificationBanner {...notificationBanner} />
          </div>
        )}
      </div>
      {!isMotion && (
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
      )}
    </>
  );
};

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  transactionId,
}) => {
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
  const { formRef, closeSidebarClick } = useCloseSidebarClick();
  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);

  return (
    <div
      className={clsx(
        `
          fixed
          top-0
          right-0
          h-screen
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
          'sm:max-w-[43.375rem]': !isSidebarFullscreen && !transactionId,
          'sm:max-w-[67.3125rem]': !isSidebarFullscreen && transactionId,
        },
      )}
      ref={registerContainerRef}
    >
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
      <div
        className={clsx('flex w-full flex-grow overflow-hidden', {
          'flex-col-reverse md:flex-row': transactionId,
        })}
      >
        <div className="flex-grow px-6 py-8">
          <ActionForm
            {...actionFormProps}
            className="flex flex-col h-full"
            ref={formRef}
          >
            <ActionSidebarFormContent
              getFormOptions={getFormOptions}
              isMotion={!!transactionId}
            />
          </ActionForm>
        </div>
        {transactionId && (
          <div
            className={`
              w-full
              md:w-[35%]
              md:h-full
              md:overflow-y-auto
              px-6
              py-8
              border-b
              border-b-gray-200
              md:border-b-0
              md:border-l
              md:border-l-gray-200
              bg-gray-25
            `}
          >
            <Motions transactionId={transactionId} />
          </div>
        )}
      </div>

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
