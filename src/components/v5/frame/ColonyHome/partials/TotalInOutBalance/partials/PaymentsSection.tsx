import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import { useTotalInOutBalanceContext } from '~context/TotalInOutBalanceContext/TotalInOutBalanceContext.ts';
import { formatText } from '~utils/intl.ts';
import { ACTION_TYPE_FIELD_NAME } from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from '../consts.ts';

import { TitledSection } from './TitledSection.tsx';

export const PaymentsSection = () => {
  const {
    loading: isLoading,
    totalOut,
    previousTotalOut,
  } = useTotalInOutBalanceContext();
  const { setShowTabletSidebar } = usePageLayoutContext();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const clickHandler = () => {
    setShowTabletSidebar(false);

    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.PaymentGroup,
    });
  };

  return (
    <TitledSection
      title={formatText(MSG.paymentsSectionTitle)}
      caption={formatText(MSG.last30DaysPeriod)}
      value={totalOut}
      previousValue={previousTotalOut}
      isLoading={isLoading}
    >
      <LoadingSkeleton isLoading={isLoading} className="h-8.5 w-11 rounded-lg">
        <Button
          onClick={clickHandler}
          text={formatText(MSG.payCTA)}
          mode="primaryOutlineFull"
          size="small"
          className="h-fit border-gray-900 px-3 text-gray-900"
        />
      </LoadingSkeleton>
    </TitledSection>
  );
};
