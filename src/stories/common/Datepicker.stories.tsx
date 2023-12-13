import React, { FC, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import Datepicker from '~v5/common/Fields/Datepicker';
import { DatepickerProps } from '~v5/common/Fields/Datepicker/types';

const datepickerMeta: Meta<typeof Datepicker> = {
  title: 'Common/Fields/Datepicker',
  component: Datepicker,
};

export default datepickerMeta;

const DatepickerWithHooks: FC<DatepickerProps> = (props) => {
  const [startDate, setStartDate] = useState<Date | null>(null);

  return (
    <Datepicker
      {...props}
      selected={startDate}
      onChange={(date) => setStartDate(date)}
    />
  );
};

const RangeDatepickerWithHooks: FC<DatepickerProps<true>> = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <Datepicker
      {...props}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      selectsRange
    />
  );
};

export const Base: StoryObj<typeof Datepicker<false>> = {
  render: (args) => <DatepickerWithHooks {...args} />,
};

export const Range: StoryObj<typeof Datepicker<true>> = {
  render: (args) => <RangeDatepickerWithHooks {...args} />,
};
