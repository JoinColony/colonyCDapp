import React, { FC } from 'react';
import { CalendarContainer, CalendarContainerProps } from 'react-datepicker';

import Card from '~v5/shared/Card';

const DatepickerContainer: FC<CalendarContainerProps> = ({
  children,
  className,
}) => (
  <Card
    withPadding={false}
    hasShadow
    className="flex justify-center items-center bg-base-white border-gray-200"
  >
    <CalendarContainer className={className}>{children}</CalendarContainer>
  </Card>
);

export default DatepickerContainer;
