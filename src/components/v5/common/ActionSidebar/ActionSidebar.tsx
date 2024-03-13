import {
  ArrowLineRight,
  ArrowsOutSimple,
  WarningCircle,
  X,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { type FC, type PropsWithChildren, useLayoutEffect } from 'react';

import { isFullScreen } from '~constants/index.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/index.tsx';
import { ExpenditureStatus } from '~gql';
import { useMobile } from '~hooks/index.ts';
import useDisableBodyScroll from '~hooks/useDisableBodyScroll/index.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { SpinnerLoader } from '~shared/Preloaders/index.ts';
import { formatText } from '~utils/intl.ts';
import Modal from '~v5/shared/Modal/index.ts';

import CompletedAction from '../CompletedAction/index.ts';

import { actionSidebarAnimation } from './consts.tsx';
import {
  useCloseSidebarClick,
  useGetActionData,
  useRemoveTxParamOnClose,
} from './hooks/index.ts';
import { useGetExpenditureData } from './hooks/useGetExpenditureData.ts';
import ActionSidebarContent from './partials/ActionSidebarContent/ActionSidebarContent.tsx';
import ExpenditureBadge from './partials/ExpenditureBadge/ExpenditureBadge.tsx';
import MotionOutcomeBadge from './partials/MotionOutcomeBadge/index.ts';
import { type ActionSidebarProps } from './types.ts';

const displayName = 'v5.common.ActionSidebar';

const ActionSidebar: FC<PropsWithChildren<ActionSidebarProps>> = ({
  children,
  initialValues,
  transactionId,
}) => {
  const { action, defaultValues, loadingAction, isMotion, motionState } =
    useGetActionData(transactionId);
  const { expenditure, loadingExpenditure } = useGetExpenditureData(
    action?.expenditureId,
  );

  const isExpeditureDraft = expenditure?.status === ExpenditureStatus.Draft;
  const {
    actionSidebarToggle: [
      isActionSidebarOpen,
      { toggle: toggleActionSidebarOff, registerContainerRef },
    ],
    cancelModalToggle: [isCancelModalOpen, { toggleOff: toggleCancelModalOff }],
  } = useActionSidebarContext();
  const [isSidebarFullscreen, { toggle: toggleIsSidebarFullscreen, toggleOn }] =
    useToggle();

  useLayoutEffect(() => {
    if (localStorage.getItem(isFullScreen) === 'true') {
      toggleOn();
    }
  }, [toggleOn]);

  const { formRef, closeSidebarClick } = useCloseSidebarClick();
  const isMobile = useMobile();

  useDisableBodyScroll(isActionSidebarOpen);
  useRemoveTxParamOnClose();

  const getSidebarContent = () => {
    if (loadingAction || loadingExpenditure) {
      return (
        <div className="h-full flex items-center justify-center flex-col gap-4">
          <SpinnerLoader appearance={{ size: 'huge' }} />
          <p className="text-gray-600">
            {formatText({ id: 'actionSidebar.loading' })}
          </p>
        </div>
      );
    }

    if (action && !isExpeditureDraft) {
      return <CompletedAction action={action} />;
    }

    return (
      <ActionSidebarContent
        key={transactionId}
        transactionId={transactionId}
        formRef={formRef}
        defaultValues={defaultValues || initialValues}
        isMotion={!!isMotion}
        isExpenditureDraft={isExpeditureDraft}
      />
    );
  };

  return (
    <motion.div
      transition={{
        ease: 'easeInOut',
      }}
      variants={actionSidebarAnimation}
      exit="hidden"
      initial="hidden"
      animate="visible"
      // @todo: remove additional z-index change when the z-index issue is resolved
      className={clsx(
        `
          transition-[max-width]
          fixed
          top-0
          sm:top-4
          bottom-4
          sm:bottom-0
          right-0
          h-full
          sm:h-[calc(100vh-2rem)]
          w-full
          sm:w-[calc(100vw-8.125rem)]
          bg-base-white
          rounded-bl-lg
          border
          border-r-0
          border-gray-200
          rounded-l-lg
          shadow-default
          z-[65]
          md:z-[60]
          flex
          flex-col
        `,
        {
          'sm:max-w-full': isSidebarFullscreen,
          'sm:max-w-[43.375rem]': !isSidebarFullscreen && !isMotion,
          'sm:max-w-[67.3125rem]': !isSidebarFullscreen && !!transactionId,
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
            <X size={18} />
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="py-2.5 flex items-center justify-center text-gray-400 transition sm:hover:text-blue-400"
              onClick={toggleIsSidebarFullscreen}
              aria-label={formatText({ id: 'ariaLabel.fullWidth' })}
            >
              {isSidebarFullscreen ? (
                <ArrowLineRight size={18} />
              ) : (
                <ArrowsOutSimple size={18} />
              )}
            </button>

            {expenditure?.status && (
              <ExpenditureBadge status={expenditure.status} />
            )}
            <MotionOutcomeBadge motionState={motionState} />
          </div>
        )}
        <div>{children}</div>
      </div>
      {getSidebarContent()}
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
