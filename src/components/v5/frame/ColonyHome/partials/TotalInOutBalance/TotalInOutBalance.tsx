import React from 'react';

import { formatText } from '~utils/intl.ts';
import WidgetBox from '~v5/common/WidgetBox/WidgetBox.tsx';

import { BarChart } from './BarChart.tsx';
import { BarChartLegend } from './BarChartLegend.tsx';
import { displayName } from './consts.ts';
import { useData } from './hooks.ts';

const TotalInOutBalance = () => {
  const { timeframe, loading } = useData();
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
      className="col-span-2"
      value={
        <div className="flex flex-row justify-center sm:flex-col sm:justify-start">
          <div className="sm:self-end">
            <BarChart data={timeframe} isLoading={loading} />
          </div>
        </div>
      }
    />
  );
};

TotalInOutBalance.displayName = displayName;

export default TotalInOutBalance;
