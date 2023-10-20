import React, { FC, PropsWithChildren } from 'react';
import clsx from 'clsx';

import Icon from '~shared/Icon';
import { useMobile } from '~hooks';
import { useActionSidebarContext } from '~context/ActionSidebarContext';
import { useCloseSidebarClick, useGetDefaultValues } from './hooks';
import useToggle from '~hooks/useToggle';
import Modal from '~v5/shared/Modal';
import { ActionSidebarProps } from './types';
import { formatText } from '~utils/intl';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  transactionId,
}) => {
  const { defaultValues, loadingAction } = useGetDefaultValues(
    transactionId || undefined,
  );

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
      {!loadingAction && (
        <ActionSidebarContent
          transactionId={transactionId}
          formRef={formRef}
          defaultValues={defaultValues}
        />
      )}

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
