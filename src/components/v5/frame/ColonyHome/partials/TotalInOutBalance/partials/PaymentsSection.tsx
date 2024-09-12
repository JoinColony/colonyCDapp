import React from 'react';

import LoadingSkeleton from '~common/LoadingSkeleton/LoadingSkeleton.tsx';
import { Action } from '~constants/actions.ts';
import { useActionSidebarContext } from '~context/ActionSidebarContext/ActionSidebarContext.ts';
import { usePageLayoutContext } from '~context/PageLayoutContext/PageLayoutContext.ts';
import useGetSelectedDomainFilter from '~hooks/useGetSelectedDomainFilter.tsx';
import { formatText } from '~utils/intl.ts';
import {
  ACTION_TYPE_FIELD_NAME,
  FROM_FIELD_NAME,
} from '~v5/common/ActionSidebar/consts.ts';
import Button from '~v5/shared/Button/Button.tsx';

import { MSG } from '../consts.ts';
import { useLast30DaysData, usePreviousLast30DaysData } from '../hooks.ts';

import { TitledSection } from './TitledSection.tsx';

export const PaymentsSection = () => {
  const { totalOut, loading: isLoading } = useLast30DaysData();
  const { previousTotalOut } = usePreviousLast30DaysData();
  const selectedDomain = useGetSelectedDomainFilter();
  const { setShowTabletSidebar } = usePageLayoutContext();

  const {
    actionSidebarToggle: [, { toggleOn: toggleActionSidebarOn }],
  } = useActionSidebarContext();

  const clickHandler = () => {
    setShowTabletSidebar(false);

    toggleActionSidebarOn({
      [ACTION_TYPE_FIELD_NAME]: Action.SimplePayment,
      [FROM_FIELD_NAME]: selectedDomain?.nativeId ?? 1,
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
      <LoadingSkeleton isLoading={isLoading} className="h-8 w-11 rounded-lg">
        <Button
          onClick={clickHandler}
          text={formatText(MSG.payCTA)}
          mode="primaryOutlineFull"
          size="small"
          className="h-fit border-gray-900 px-3 py-2 text-gray-900"
        />
      </LoadingSkeleton>
    </TitledSection>
  );
};
