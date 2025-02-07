import { SpinnerGap } from '@phosphor-icons/react';
import clsx from 'clsx';
import React, { type FC, type PropsWithChildren, useEffect } from 'react';
import { type UseFormReturn } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';
import DescriptionList from '~v5/common/ActionSidebar/partials/Motions/MotionStep/VotingStep/partials/DescriptionList/DescriptionList.tsx';
import { type DescriptionListItem } from '~v5/common/ActionSidebar/partials/Motions/MotionStep/VotingStep/partials/DescriptionList/types.ts';
import PillsBase from '~v5/common/Pills/index.ts';
import IconButton from '~v5/shared/Button/IconButton.tsx';

interface FinalizeStepContentProps extends PropsWithChildren {
  items: DescriptionListItem[];
  formHelpers: UseFormReturn<Record<string, any>>;
  showButton?: boolean;
  showClaimedPill?: boolean;
  shouldResetFormState?: boolean;
  isClaimed?: boolean;
  isPolling?: boolean;
}

export const FinalizeStepContent: FC<FinalizeStepContentProps> = ({
  items,
  formHelpers: {
    getValues,
    formState: { isSubmitting },
    reset,
  },
  showButton,
  showClaimedPill,
  isPolling,
  shouldResetFormState,
  isClaimed,
  children,
}) => {
  const showPendingButton = (isPolling || isSubmitting) && !isClaimed;

  const showDescription = !!items.length;

  useEffect(() => {
    if (shouldResetFormState && isSubmitting) {
      reset(getValues());
    }
  }, [shouldResetFormState, isSubmitting, reset, getValues]);

  return (
    <>
      {showDescription && (
        <>
          <div className="mb-2">
            <h4 className="mb-3 flex items-center justify-between text-1">
              {formatText({ id: 'motion.finalizeStep.title' })}
              {showClaimedPill && (
                <PillsBase className="bg-teams-pink-100 text-teams-pink-500">
                  {formatText({
                    id: 'motion.finalizeStep.claimed',
                  })}
                </PillsBase>
              )}
            </h4>
          </div>
          <DescriptionList
            items={items}
            className={clsx({
              'mb-6': showButton && (showPendingButton || !!children),
            })}
          />
        </>
      )}
      {showButton && (
        <>
          {showPendingButton ? (
            <IconButton
              className="w-full"
              rounded="s"
              text={{ id: 'button.pending' }}
              icon={
                <span className="ml-1.5 flex shrink-0">
                  <SpinnerGap size={14} className="animate-spin" />
                </span>
              }
              title={{ id: 'button.pending' }}
              ariaLabel={{ id: 'button.pending' }}
            />
          ) : (
            children
          )}
        </>
      )}
    </>
  );
};
