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
    <div className="mt-6 flex flex-col gap-2 md:mt-0  md:flex-row md:gap-6">
      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalStreaming',
        })}
        value={
          <div className="align-center flex gap-2">
            <div className="flex">
              <h4 className="font-semibold heading-4">{prefix}</h4>
              <p className="self-center font-semibold heading-4">
                {getFormattedNumeralValue(streamingPerMonthDecimal, 0)}
              </p>
            </div>
            <p className="self-center text-1">{suffix} / month</p>
          </div>
        }
      />

      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalStreamed',
        })}
        value={
          <div className="align-center flex gap-2">
            <div className="flex">
              <h4 className="font-semibold heading-4">{prefix}</h4>
              <p className="self-center font-semibold heading-4">
                {getFormattedNumeralValue(totalStreamedDecimal, 0)}
              </p>
            </div>
            <p className="self-center text-1">{suffix}</p>
          </div>
        }
      />
      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.unclaimedFounds',
        })}
        value={
          <div className="align-center flex gap-2">
            <div className="flex">
              <h4 className="font-semibold heading-4">{prefix}</h4>
              <p className="self-center font-semibold heading-4">
                {getFormattedNumeralValue(unclaimedFoundsDecimal, 0)}
              </p>
            </div>
            <p className="self-center text-1">{suffix}</p>
          </div>
        }
      />
      <WidgetBox
        title={formatText({
          id: 'streamingPaymentsPage.widget.totalActiveStreams',
        })}
        value={<h4 className="font-thin heading-4">{totalActiveStreams}</h4>}
      />
    </div>
  );
};

StatsCards.displayName = displayName;

export default StatsCards;
