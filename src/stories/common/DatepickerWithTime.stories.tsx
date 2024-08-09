import React, { type FC, useState } from 'react';

import { type DatepickerProps } from '~v5/common/Fields/datepickers/Datepicker/types.ts';
import DatepickerWithTime from '~v5/common/Fields/datepickers/DatepickerWithTime/DatepickerWithTime.tsx';

import type { Meta, StoryObj } from '@storybook/react';

const datepickerMeta: Meta<typeof DatepickerWithTime> = {
  title: 'Common/Fields/Datepicker With Time',
  component: DatepickerWithTime,
};

export default datepickerMeta;

const DatepickerWithHooks: FC<DatepickerProps> = (props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <DatepickerWithTime
      {...props}
      selected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  );
};

export const Base: StoryObj<typeof DatepickerWithTime> = {
  render: (args) => <DatepickerWithHooks {...args} />,
};
