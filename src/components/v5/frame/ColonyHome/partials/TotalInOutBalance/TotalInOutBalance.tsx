import React from 'react';

import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/WidgetBox.tsx';

import { displayName } from './consts.ts';
import { BarChart } from './partials/BarChart.tsx';
import { BarChartLegend } from './partials/BarChartLegend.tsx';

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
      className="col-span-2 !px-5 !items-start"
      value={
        <div className="flex flex-row justify-center sm:flex-col sm:justify-start">
          <div className="sm:self-end">
            <BarChart />
          </div>
        </div>
      }
    />
  );
};

TotalInOutBalance.displayName = displayName;

export default TotalInOutBalance;
