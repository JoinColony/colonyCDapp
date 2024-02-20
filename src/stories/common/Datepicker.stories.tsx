import React, { type FC, useState } from 'react';

import Datepicker from '~v5/common/Fields/datepickers/Datepicker/index.ts';
import { type DatepickerProps } from '~v5/common/Fields/datepickers/Datepicker/types.ts';

import type { Meta, StoryObj } from '@storybook/react';

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

export const Base: StoryObj<typeof Datepicker> = {
  render: (args) => <DatepickerWithHooks {...args} />,
};
