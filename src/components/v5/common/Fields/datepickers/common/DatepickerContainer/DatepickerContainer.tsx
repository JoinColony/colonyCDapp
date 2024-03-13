import React, { type FC } from 'react';
import {
  CalendarContainer,
  type CalendarContainerProps,
} from 'react-datepicker';

import Card from '~v5/shared/Card/index.ts';

const DatepickerContainer: FC<CalendarContainerProps> = ({
  children,
  className,
}) => (
  <Card
    withPadding={false}
    hasShadow
    className="flex items-center justify-center border-gray-200 bg-base-white"
  >
    <CalendarContainer className={className}>{children}</CalendarContainer>
  </Card>
);

export default DatepickerContainer;
