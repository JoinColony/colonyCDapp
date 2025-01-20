import { WarningCircle } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useRef,
} from 'react';

import { isFullScreen } from '~constants/index.ts';
import { useActionContext } from '~context/ActionContext/ActionContext.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import ActionStatusContextProvider from '~context/ActionStatusContext/ActionStatusContextProvider.tsx';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import { useDraftAgreement } from '~hooks/useDraftAgreement.ts';
import useToggle from '~hooks/useToggle/index.ts';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import CompletedAction from '../CompletedAction/index.ts';
import FourOFourMessage from '../FourOFourMessage/index.ts';
import PillsBase from '../Pills/PillsBase.tsx';

import { ACTION_TYPE_FIELD_NAME, actionSidebarAnimation } from './consts.ts';
import useCloseSidebarClick from './hooks/useCloseSidebarClick.ts';
import useGetGroupedActionComponent from './hooks/useGetGroupedActionComponent.tsx';
import { ActionNotFound } from './partials/ActionNotFound.tsx';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent.tsx';
import ActionSidebarLayout from './partials/ActionSidebarLayout/ActionSidebarLayout.tsx';
import ActionSidebarStatusPill from './partials/ActionSidebarStatusPill/ActionSidebarStatusPill.tsx';
import ExpenditureActionStatusBadge from './partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import { GoBackButton } from './partials/GoBackButton/GoBackButton.tsx';
import MotionOutcomeBadge from './partials/MotionOutcomeBadge/index.ts';
import { type ActionSidebarProps } from './types.ts';
import { getActionGroup, mapActionTypeToAction } from './utils.ts';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  className,
}) => {
  const {
    transactionHash,
    action,
    isValidTransactionHash,
    loadingAction,
    isMotion,
    motionState,
    loadingExpenditure,
    startActionPoll,
    stopActionPoll,
  } = useActionContext();

  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
    actionSidebarInitialValues,
  } = useActionSidebarContext();
  const actionType = mapActionTypeToAction(action);
  const actionGroupType = getActionGroup(
    actionSidebarInitialValues?.[ACTION_TYPE_FIELD_NAME] || actionType,
  );
  const GroupedActionComponent = useGetGroupedActionComponent();

  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    clearTimeout(timeout.current);

    // If the action has not been found for 20 seconds, then assume transaction doesn't exist.
    if (loadingAction) {
      timeout.current = setTimeout(() => {
        stopActionPoll();
      }, 20000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [loadingAction, stopActionPoll]);

  const { formRef, closeSidebarClick } = useCloseSidebarClick();

  const { getIsDraftAgreement } = useDraftAgreement({
    formContextOverride: formRef.current,
  });

  const { isCopied, handleClipboardCopy } = useCopyToClipboard();

  useDisableBodyScroll(isActionSidebarOpen);

  const isLoading = !!transactionHash && (loadingAction || loadingExpenditure);

  const actionNotFound = transactionHash && !action;

  const getSidebarContent = () => {
    if (action) {
      return <CompletedAction action={action} />;
    }

    if (actionNotFound) {
      return (
        <ActionNotFound
          isInvalidTransactionHash={!isValidTransactionHash}
          onCloseSidebar={toggleActionSidebarOff}
          onRefetchAction={startActionPoll}
        />
      );
    }

    if (GroupedActionComponent) {
      return <GroupedActionComponent />;
    }

    return (
      <ActionSidebarContent
        transactionHash={transactionHash}
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
        maxSize={!!transactionId && !actionNotFound ? 'big' : 'small'}
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
