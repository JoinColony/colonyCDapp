import React, { type FC, useState } from 'react';

import RangeDatepicker from '~v5/common/Fields/datepickers/RangeDatepicker/index.ts';
import { type RangeDatepickerProps } from '~v5/common/Fields/datepickers/RangeDatepicker/types.ts';

import type { Meta, StoryObj } from '@storybook/react';

const rangeDatepickerMeta: Meta<typeof RangeDatepicker> = {
  title: 'Common/Fields/Range Datepicker',
  component: RangeDatepicker,
};

export default rangeDatepickerMeta;

const RangeDatepickerWithHooks: FC<RangeDatepickerProps> = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <RangeDatepicker
      {...props}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
    />
  );
};

export const Base: StoryObj<typeof RangeDatepicker> = {
  render: (args) => <RangeDatepickerWithHooks {...args} />,
};

export const WithMaxDate: StoryObj<typeof RangeDatepicker> = {
  render: (args) => <RangeDatepickerWithHooks {...args} />,
  args: {
    maxDate: new Date(),
  },
};
