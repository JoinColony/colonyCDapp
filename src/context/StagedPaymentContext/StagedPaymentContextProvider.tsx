import React, {
  type FC,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';

import useToggle from '~hooks/useToggle/index.ts';
import { TX_SEARCH_PARAM } from '~routes';
import { type MilestoneItem } from '~v5/common/CompletedAction/partials/PaymentBuilder/partials/StagedPaymentStep/partials/MilestoneReleaseModal/types.ts';

import { StagedPaymentContext } from './StagedPaymentContext.ts';
import { type MilestoneState } from './types.ts';
import { getMilestoneStateWithFallback } from './utils.ts';

const StagedPaymentContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [
    isMilestoneModalOpen,
    { toggleOn: toggleOnMilestoneModal, toggleOff: toggleOffMilestoneModal },
  ] = useToggle();
  const [milestonesState, setMilestonesState] = useState<
    Record<string, MilestoneState>
  >({});
  const [searchParams] = useSearchParams();
  const transactionId = searchParams?.get(TX_SEARCH_PARAM) || '';

  // The current state for the given transactionId
  const {
    allMilestonesSlotIdsAwaitingRelease,
    currentMilestonesAwaitingRelease,
    isPendingStagesRelease,
  } = getMilestoneStateWithFallback(milestonesState[transactionId]);

  const setCurrentMilestonesAwaitingRelease = useCallback(
    (milestones: MilestoneItem[]) => {
      if (transactionId) {
        setMilestonesState((previousState) => {
          const previousStateForTransaction = getMilestoneStateWithFallback(
            previousState[transactionId],
          );

          return {
            ...previousState,
            [transactionId]: {
              ...previousStateForTransaction,
              currentMilestonesAwaitingRelease: milestones,
            },
          };
        });
      }
    },
    [transactionId],
  );

  const setPendingState = useCallback(
    (isPending: boolean) => {
      if (transactionId) {
        setMilestonesState((previousState) => {
          const previousStateForTransaction = getMilestoneStateWithFallback(
            previousState[transactionId],
          );

          const allMilestones = isPending
            ? [
                ...new Set([
                  ...previousStateForTransaction.allMilestonesSlotIdsAwaitingRelease,
                  ...previousStateForTransaction.currentMilestonesAwaitingRelease.map(
                    (milestone) => milestone.slotId,
                  ),
                ]),
              ]
            : previousStateForTransaction.allMilestonesSlotIdsAwaitingRelease;

          return {
            ...previousState,
            [transactionId]: {
              ...previousStateForTransaction,
              isPendingStagesRelease: isPending,
              allMilestonesSlotIdsAwaitingRelease: allMilestones,
            },
          };
        });
      }
    },
    [transactionId],
  );

  const removeSlotIdsFromPending = useCallback(
    (slotIds: number[]) => {
      if (transactionId) {
        setMilestonesState((previousState) => {
          const previousStateForTransaction = getMilestoneStateWithFallback(
            previousState[transactionId],
          );

          const updatedAllMilestones =
            previousStateForTransaction.allMilestonesSlotIdsAwaitingRelease.filter(
              (slotId) => !slotIds.includes(slotId),
            );

          return {
            ...previousState,
            [transactionId]: {
              ...previousStateForTransaction,
              allMilestonesSlotIdsAwaitingRelease: updatedAllMilestones,
            },
          };
        });
      }
    },
    [transactionId],
  );

  const resetMilestonesState = useCallback(() => {
    if (transactionId) {
      setMilestonesState((previousState) => {
        const updatedState = { ...previousState };
        delete updatedState[transactionId];
        return updatedState;
      });
    }
  }, [transactionId]);

  const value = useMemo(
    () => ({
      currentMilestonesAwaitingRelease,
      allMilestonesSlotIdsAwaitingRelease,
      setCurrentMilestonesAwaitingRelease,
      isPendingStagesRelease,
      setPendingState,
      isMilestoneModalOpen,
      toggleOffMilestoneModal,
      toggleOnMilestoneModal,
      resetMilestonesState,
      removeSlotIdsFromPending,
    }),
    [
      allMilestonesSlotIdsAwaitingRelease,
      currentMilestonesAwaitingRelease,
      setCurrentMilestonesAwaitingRelease,
      isPendingStagesRelease,
      setPendingState,
      isMilestoneModalOpen,
      toggleOffMilestoneModal,
      toggleOnMilestoneModal,
      resetMilestonesState,
      removeSlotIdsFromPending,
    ],
  );

  return (
    <StagedPaymentContext.Provider value={value}>
      {children}
    </StagedPaymentContext.Provider>
  );
};

export default StagedPaymentContextProvider;
