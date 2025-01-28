import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
} from 'react';

import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import ActionStatusContextProvider from '~context/ActionStatusContext/ActionStatusContextProvider.tsx';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import { useDraftAgreement } from '~hooks/useDraftAgreement.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import CompletedAction from '../CompletedAction/index.ts';

import useCloseSidebarClick from './hooks/useCloseSidebarClick.ts';
import useGetActionData from './hooks/useGetActionData.ts';
import useGetGroupedActionComponent from './hooks/useGetGroupedActionComponent.tsx';
import { ActionNotFound } from './partials/ActionNotFound.tsx';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent.tsx';
import ActionSidebarLayout from './partials/ActionSidebarLayout/ActionSidebarLayout.tsx';
import ActionSidebarStatusPill from './partials/ActionSidebarStatusPill/ActionSidebarStatusPill.tsx';
import { type ActionSidebarProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  transactionId,
  className,
}) => {
  const {
    action,
    isInvalidTransactionHash,
    loadingAction,
    isMotion,
    motionState,
    loadingExpenditure,
    streamingPayment,
    startPollingForAction,
    stopPollingForAction,
  } = useGetActionData(transactionId);

  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
    actionSidebarInitialValues,
  } = useActionSidebarContext();

  const GroupedActionComponent = useGetGroupedActionComponent();

  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeout.current);

    // If the action has not been found for 20 seconds, then assume transaction doesn't exist.
    if (loadingAction) {
      timeout.current = setTimeout(() => {
        stopPollingForAction();
      }, 20000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [loadingAction, stopPollingForAction]);

  const { formRef, closeSidebarClick } = useCloseSidebarClick();

  const { getIsDraftAgreement } = useDraftAgreement({
    formContextOverride: formRef.current,
  });

  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  useDisableBodyScroll(isActionSidebarOpen);

  const isLoading =
    transactionId !== undefined &&
    (loadingAction ||
      loadingExpenditure ||
      streamingPayment.loadingStreamingPayment);

  const actionNotFound =
    transactionId &&
    !action &&
    !loadingAction &&
    !loadingExpenditure &&
    !streamingPayment.loadingStreamingPayment;

  const getSidebarContent = () => {
    if (action) {
      return <CompletedAction action={action} />;
    }

    if (actionNotFound) {
      return (
        <ActionNotFound
          isInvalidTransactionHash={isInvalidTransactionHash}
          onCloseSidebar={toggleActionSidebarOff}
          onRefetchAction={startPollingForAction}
        />
      );
    }

    if (GroupedActionComponent) {
      return <GroupedActionComponent />;
    }

    return (
      <ActionSidebarContent
        transactionId={transactionId}
        formRef={formRef}
        defaultValues={actionSidebarInitialValues}
        isMotion={!!isMotion}
      />
    );
  };

  return (
    <ActionStatusContextProvider
      actionType={action?.type}
      motionState={motionState}
    >
      <ActionSidebarLayout
        ref={registerContainerRef}
        onCloseClick={() =>
          closeSidebarClick({
            shouldShowCancelModal: !getIsDraftAgreement(),
          })
        }
        className={className}
        shareButtonProps={
          transactionId
            ? {
                isOpen: isCopied,
                isSuccess: isCopied,
                onShareButtonClick: () =>
                  handleClipboardCopy(window.location.href),
              }
            : undefined
        }
        additionalTopContent={children}
        isLoading={isLoading}
        statusPill={
          action && !isLoading ? <ActionSidebarStatusPill /> : undefined
        }
        transactionId={transactionId}
        isMotion={isMotion}
        actionNotFound={!!actionNotFound}
      >
        <div
          className={clsx('flex flex-grow overflow-y-auto', {
            hidden: isLoading,
          })}
        >
          {getSidebarContent()}
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
          icon={WarningCircle}
          buttonMode="primarySolid"
          confirmMessage={formatText({ id: 'button.cancelAction' })}
          closeMessage={formatText({
            id: 'button.continueAction',
          })}
        />
      </ActionSidebarLayout>
    </ActionStatusContextProvider>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
