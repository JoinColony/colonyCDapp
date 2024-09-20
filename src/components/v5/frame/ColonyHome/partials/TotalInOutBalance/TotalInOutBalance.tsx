import React from 'react';

import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/WidgetBox.tsx';

import { displayName } from './consts.ts';
import { BarChart } from './partials/BarChart.tsx';
import { BarChartLegend } from './partials/BarChartLegend.tsx';
import { IncomeSection } from './partials/IncomeSection.tsx';
import { PaymentsSection } from './partials/PaymentsSection.tsx';

const TotalInOutBalance = () => {
  return (
    <WidgetBox
      title={
        <div className="flex flex-row justify-between">
          <h3 className="text-lg font-semibold">
            {formatText({
              id: 'dashboard.totalInOut.widget.title',
            })}
          </h3>
          <BarChartLegend />
        </div>
      }
      titleClassName="text-2 mb-4"
      className="col-span-2 !items-start !px-5"
      contentClassName="flex flex-col w-full h-full"
      value={
        <div className="flex flex-col justify-center gap-8 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4 sm:self-center">
            <PaymentsSection />
            <div className="w-full border-t border-gray-200" />
            <IncomeSection />
          </div>
          <div className="self-center">
            <BarChart />
          </div>
        </div>
      }
    />
  );
};

TotalInOutBalance.displayName = displayName;

export default TotalInOutBalance;
