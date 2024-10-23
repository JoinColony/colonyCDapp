import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { useTotalInOutBalanceContext } from '~context/TotalInOutBalanceContext/TotalInOutBalanceContext.ts';
import useToggle from '~hooks/useToggle/index.ts';
import { formatText } from '~utils/intl.ts';
import { AddFundsModal } from '~v5/common/Modals/AddFundsModal/AddFundsModal.tsx';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from '../consts.ts';

import { ClaimFundsButton } from './ClaimFundsButton.tsx';
import { TitledSection } from './TitledSection.tsx';

export const IncomeSection = () => {
  const {
    loading: isLoading,
    totalIn,
    previousTotalIn,
  } = useTotalInOutBalanceContext();
  const [
    isAddFundsModalOpened,
    { toggleOn: toggleAddFundsModalOn, toggleOff: toggleAddFundsModalOff },
  ] = useToggle();

  return (
    <TitledSection
      title={formatText(MSG.incomeSectionTitle)}
      caption={formatText(MSG.last30DaysPeriod)}
      value={totalIn}
      previousValue={previousTotalIn}
      isLoading={isLoading}
    >
      <div className="flex flex-row gap-2">
        <LoadingSkeleton
          isLoading={isLoading}
          className="h-8.5 w-14 rounded-lg"
        >
          <ClaimFundsButton />
        </LoadingSkeleton>
        <LoadingSkeleton
          isLoading={isLoading}
          className="h-8.5 w-12 rounded-lg"
        >
          <Button
            onClick={toggleAddFundsModalOn}
            text={formatText(MSG.addFundsCTA)}
            mode="primaryOutlineFull"
            size="small"
            className="h-fit border-gray-900 px-3 text-gray-900"
          />
        </LoadingSkeleton>
      </div>
      <AddFundsModal
        isOpen={isAddFundsModalOpened}
        onClose={toggleAddFundsModalOff}
      />
    </TitledSection>
  );
};
