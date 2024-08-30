import {
  ArrowLineRight,
  ArrowsOutSimple,
  ShareNetwork,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

import { isFullScreen } from '~constants/index.ts';
import { useActionContext } from '~context/ActionContext/ActionContext.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
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
import ActionSidebarLoadingSkeleton from './partials/ActionSidebarLoadingSkeleton/ActionSidebarLoadingSkeleton.tsx';
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
    isMultiSig,
    motionState,
    expenditure,
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
  const [isSidebarFullscreen, { toggle: toggleIsSidebarFullscreen, toggleOn }] =
    useToggle();

  const timeout = useRef<NodeJS.Timeout>();

  useLayoutEffect(() => {
    if (localStorage.getItem(isFullScreen) === 'true') {
      toggleOn();
    }
  }, [toggleOn]);

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
  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);

  const isLoading = !!transactionHash && (loadingAction || loadingExpenditure);

  const actionNotFound = transactionHash && !action;

  const getSidebarContent = () => {
    if (action) {
      return (
        <CompletedAction action={action} streamingPayment={streamingPayment} />
      );
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

  const getShareButton = () =>
    !!transactionHash && (
      <Tooltip
        tooltipContent={formatText({ id: 'copy.urlCopied' })}
        isOpen={isCopied}
        isSuccess={isCopied}
        placement="bottom"
      >
        <button
          type="button"
          className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
          onClick={() => handleClipboardCopy(window.location.href)}
          aria-label={formatText({ id: 'ariaLabel.shareAction' })}
        >
          <ShareNetwork size={18} />
        </button>
      </Tooltip>
    );

  return (
    <motion.div
      transition={{
        ease: 'easeInOut',
      }}
      variants={actionSidebarAnimation}
      exit="hidden"
      initial="hidden"
      animate="visible"
      data-testid="action-drawer"
      className={clsx(
        className,
        `
          fixed
          right-0
          top-[calc(var(--top-content-height))]
          isolate
          z-sidebar
          flex
          h-[calc(100dvh-var(--top-content-height))]
          w-full
          flex-col
          border
          border-r-0
          border-gray-200
          bg-base-white
          shadow-default
          transition-[max-width]
          md:bottom-0
          md:top-[calc(var(--top-content-height)+16px)]
          md:h-[calc(100dvh-var(--top-content-height)-2rem)]
          md:w-[calc(100vw-248px)]
          md:rounded-l-lg
        `,
        {
          'md:max-w-full': isSidebarFullscreen,
          'md:max-w-[43.375rem]': !isSidebarFullscreen && !isMotion,
          'md:max-w-[67.3125rem]':
            (!isSidebarFullscreen && !!transactionHash && !actionNotFound) ||
            (!isSidebarFullscreen && !!transactionHash && isLoading),
        },
      )}
      ref={registerContainerRef}
    >
      <div className="relative">
        <div className="flex w-full items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
              onClick={() =>
                closeSidebarClick({
                  shouldShowCancelModal: !getIsDraftAgreement(),
                })
              }
              aria-label={formatText({ id: 'ariaLabel.closeModal' })}
            >
              <X size={18} />
            </button>
            {actionGroupType && (
              <GoBackButton
                action={action}
                onClick={transactionHash ? closeSidebarClick : undefined}
              />
            )}
            {!isMobile && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 text-gray-400 transition sm:hover:text-blue-400"
                    onClick={toggleIsSidebarFullscreen}
                    aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
                  >
                    {isSidebarFullscreen ? (
                      <ArrowLineRight size={18} />
                    ) : (
                      <ArrowsOutSimple size={18} />
                    )}
                  </button>
                  {getShareButton()}
                </div>
                {action && !isLoading && (
                  <ActionSidebarStatusPill
                    action={action}
                    expenditure={expenditure}
                    streamingPaymentStatus={streamingPayment.paymentStatus}
                    motionState={motionState}
                    isMotion={isMotion}
                    isMultiSig={isMultiSig}
                  />
                )}
                {(!!(
                  isMotion && action?.motionData?.motionStateHistory.endedAt
                ) ||
                  !!isMultiSig) &&
                  motionState && (
                    <MotionOutcomeBadge motionState={motionState} />
                  )}
              </div>
            )}
            {isMobile && getShareButton()}
          </div>
          <div>{children}</div>
        </div>
      </div>
      {isLoading ? (
        <ActionSidebarLoadingSkeleton />
      ) : (
        <div className="flex flex-grow overflow-y-auto">
          {getSidebarContent()}
        </div>
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
        icon={WarningCircle}
        buttonMode="primarySolid"
        confirmMessage={formatText({ id: 'button.cancelAction' })}
        closeMessage={formatText({
          id: 'button.continueAction',
        })}
      />
    </motion.div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
