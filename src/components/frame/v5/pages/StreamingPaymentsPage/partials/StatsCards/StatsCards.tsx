import React from 'react';

import { getFormattedNumeralValue } from '~shared/Numeral/helpers.tsx';
import { type NumeralValue } from '~shared/Numeral/types.ts';
import { convertToDecimal } from '~utils/convertToDecimal.ts';
import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/WidgetBox.tsx';

export interface StatsCardsProps {
  streamingPerMonth: NumeralValue;
  totalActiveStreams: number;
  totalStreamed: NumeralValue;
  unclaimedFounds: NumeralValue;
  prefix: string;
  suffix: string;
}

const displayName = 'v5.pages.StreamingPaymentsPage.partials.StatsCards';

const StatsCards = ({
  streamingPerMonth,
  totalActiveStreams,
  totalStreamed,
  unclaimedFounds,
  prefix,
  suffix,
}: StatsCardsProps) => {
  const streamingPerMonthDecimal = convertToDecimal(streamingPerMonth, 0);
  const totalStreamedDecimal = convertToDecimal(totalStreamed, 0);
  const unclaimedFoundsDecimal = convertToDecimal(unclaimedFounds, 0);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalStreaming',
        })}
        titleClassName="font-normal text-md"
        value={
          <div className="align-center flex flex-wrap gap-x-2">
            <div className="flex">
              <h4 className="self-center font-semibold heading-4">
                {prefix}
                {getFormattedNumeralValue(streamingPerMonthDecimal, 0)}
              </h4>
            </div>
            <p className="self-center text-1">{suffix} / month</p>
          </div>
        }
      />

      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalStreamed',
        })}
        titleClassName="font-normal text-md"
        value={
          <div className="align-center flex flex-wrap gap-x-2">
            <div className="flex">
              <h4 className="self-center font-semibold heading-4">
                {prefix}
                {getFormattedNumeralValue(totalStreamedDecimal, 0)}
              </h4>
            </div>
            <p className="self-center text-1">{suffix}</p>
          </div>
        }
      />
      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.unclaimedFounds',
        })}
        titleClassName="font-normal text-md"
        value={
          <div className="align-center flex flex-wrap gap-x-2">
            <div className="flex">
              <h4 className="self-center font-semibold heading-4">
                {prefix}
                {getFormattedNumeralValue(unclaimedFoundsDecimal, 0)}
              </h4>
            </div>
            <p className="self-center text-1">{suffix}</p>
          </div>
        }
      />
      <WidgetBox
        className="sm:hidden lg:block"
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalActiveStreams',
        })}
        titleClassName="font-normal text-md"
        value={<h4 className="font-thin heading-4">{totalActiveStreams}</h4>}
      />
    </div>
  );
};

StatsCards.displayName = displayName;

export default StatsCards;