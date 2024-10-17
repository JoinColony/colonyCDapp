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
import PillsBase from '../Pills/PillsBase.tsx';

import { actionSidebarAnimation } from './consts.ts';
import useCloseSidebarClick from './hooks/useCloseSidebarClick.ts';
import useGetActionData from './hooks/useGetActionData.ts';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent.tsx';
import ActionSidebarLoadingSkeleton from './partials/ActionSidebarLoadingSkeleton/ActionSidebarLoadingSkeleton.tsx';
import ExpenditureActionStatusBadge from './partials/ExpenditureActionStatusBadge/ExpenditureActionStatusBadge.tsx';
import MotionOutcomeBadge from './partials/MotionOutcomeBadge/index.ts';
import { type ActionSidebarProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  initialValues,
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
    startPollingForAction,
    stopPollingForAction,
  } = useGetActionData(transactionId);

  const {
    actionSidebarMotions: { motionsLoading },
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();
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
    transactionId !== undefined && (loadingAction || loadingExpenditure);

  const isContentLoading = isLoading || motionsLoading;

  const actionNotFound = transactionId && !action;

  const getSidebarContent = () => {
    if (action) {
      return <CompletedAction action={action} />;
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

    return (
      <ActionSidebarContent
        key={transactionId}
        transactionId={transactionId}
        formRef={formRef}
        defaultValues={initialValues}
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
          bottom-4
          right-0
          top-0
          isolate
          z-sidebar
          flex
          h-full
          w-full
          flex-col
          border
          border-r-0
          border-gray-200
          bg-base-white
          shadow-default
          transition-[max-width]
          md:bottom-0
          md:top-4
          md:h-[calc(100vh-2rem)]
          md:w-[calc(100vw-8.125rem)]
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
                {action &&
                  !isMotion &&
                  !isMultiSig &&
                  !expenditure &&
                  !loadingExpenditure && (
                    <PillsBase
                      className="bg-success-100 text-success-400"
                      isCapitalized={false}
                    >
                      {formatText({ id: 'action.passed' })}
                    </PillsBase>
                  )}
                {!!expenditure && (
                  <ExpenditureActionStatusBadge
                    expenditure={expenditure}
                    withAdditionalStatuses
                  />
                )}
                {(!!isMotion || !!isMultiSig) && motionState && (
                  <MotionOutcomeBadge motionState={motionState} />
                )}
              </div>
            )}
            {isMobile && getShareButton()}
          </div>
          <div>{children}</div>
        </div>
      </div>
      {isContentLoading && <ActionSidebarLoadingSkeleton />}
      <div
        className={clsx('flex flex-grow', {
          hidden: isContentLoading,
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
