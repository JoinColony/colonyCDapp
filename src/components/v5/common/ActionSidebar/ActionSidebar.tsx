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
import { Link } from 'react-router-dom';

import { isFullScreen } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { useMobile } from '~hooks/index.ts';
import useCopyToClipboard from '~hooks/useCopyToClipboard.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { COLONY_ACTIVITY_ROUTE, TX_SEARCH_PARAM } from '~routes';
import Tooltip from '~shared/Extensions/Tooltip/Tooltip.tsx';
import { formatText } from '~utils/intl.ts';
import { removeQueryParamFromUrl } from '~utils/urls.ts';
import Button from '~v5/shared/Button/Button.tsx';
import ButtonLink from '~v5/shared/Button/ButtonLink.tsx';
import Modal from '~v5/shared/Modal/index.ts';

import CompletedAction from '../CompletedAction/index.ts';
import FourOFourMessage from '../FourOFourMessage/index.ts';

import { actionSidebarAnimation } from './consts.ts';
import useCloseSidebarClick from './hooks/useCloseSidebarClick.ts';
import useGetActionData from './hooks/useGetActionData.ts';
import useGetGroupedActionComponent from './hooks/useGetGroupedActionComponent.tsx';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent.tsx';
import ActionSidebarLoadingSkeleton from './partials/ActionSidebarLoadingSkeleton/ActionSidebarLoadingSkeleton.tsx';
import ExpenditureActionStatusBadge from './partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from './partials/MotionOutcomeBadge/index.ts';
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
    isMultiSig,
    motionState,
    expenditure,
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
        stopPollingForAction();
      }, 20000);
    }

    return () => {
      clearTimeout(timeout.current);
    };
  }, [loadingAction, stopPollingForAction]);

  const { formRef, closeSidebarClick } = useCloseSidebarClick();
  const { isCopied, handleClipboardCopy } = useCopyToClipboard();
  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);

  const isLoading =
    transactionId !== undefined && (loadingAction || loadingExpenditure || streamingPayment.loadingStreamingPayment);

  const actionNotFound =
    transactionId &&
    !action &&
    !loadingAction &&
    !loadingExpenditure &&
    !streamingPayment.loadingStreamingPayment;

  const getSidebarContent = () => {
    if (action) {
      return (
        <CompletedAction action={action} streamingPayment={streamingPayment} />
      );
    }

    if (actionNotFound) {
      return (
        <div className="pt-14">
          <FourOFourMessage
            description={formatText({
              id: isInvalidTransactionHash
                ? 'actionSidebar.fourOfour.descriptionInvalidHash'
                : 'actionSidebar.fourOfour.description',
            })}
            links={
              <>
                {!isInvalidTransactionHash && (
                  <Link
                    to={COLONY_ACTIVITY_ROUTE}
                    className="mb-2 text-sm text-blue-400 underline"
                    onClick={toggleActionSidebarOff}
                  >
                    {formatText({
                      id: 'actionSidebar.fourOfour.activityPageLink',
                    })}
                  </Link>
                )}
                <Link
                  to={removeQueryParamFromUrl(
                    window.location.href,
                    TX_SEARCH_PARAM,
                  )}
                  className="mb-2 text-sm text-blue-400 underline"
                >
                  {formatText({
                    id: 'actionSidebar.fourOfour.createNewAction',
                  })}
                </Link>
              </>
            }
            primaryLinkButton={
              isInvalidTransactionHash ? (
                <ButtonLink
                  mode="primarySolid"
                  to={COLONY_ACTIVITY_ROUTE}
                  className="flex-1"
                  onClick={toggleActionSidebarOff}
                >
                  {formatText({
                    id: 'actionSidebar.fourOfour.activityPageLink',
                  })}
                </ButtonLink>
              ) : (
                <Button
                  mode="primarySolid"
                  className="flex-1"
                  onClick={startPollingForAction}
                >
                  {formatText({
                    id: 'button.retry',
                  })}
                </Button>
              )
            }
          />
        </div>
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

  const getShareButton = () =>
    !!transactionId && (
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
      className={clsx(
        className,
        `
          fixed
          right-0
          top-[calc(var(--top-content-height))]
          isolate
          z-sidebar
          flex
          h-[calc(100vh-var(--top-content-height))]
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
          md:h-[calc(100vh-var(--top-content-height)-2rem)]
          md:w-[calc(100vw-248px)]
          md:rounded-l-lg
        `,
        {
          'md:max-w-full': isSidebarFullscreen,
          'md:max-w-[43.375rem]': !isSidebarFullscreen && !isMotion,
          'md:max-w-[67.3125rem]':
            (!isSidebarFullscreen && !!transactionId && !actionNotFound) ||
            (!isSidebarFullscreen && !!transactionId && isLoading),
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
              onClick={closeSidebarClick}
              aria-label={formatText({ id: 'ariaLabel.closeModal' })}
            >
              <X size={18} />
            </button>
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
              </div>
            )}
            {isMobile && getShareButton()}
          </div>
          <div>{children}</div>
        </div>
      </div>
      {isLoading && <ActionSidebarLoadingSkeleton />}
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
    </motion.div>
  );
};

ActionSidebar.displayName = displayName;

export default ActionSidebar;
