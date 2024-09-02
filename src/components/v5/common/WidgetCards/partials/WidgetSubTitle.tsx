import React, { type FC } from 'react';

interface SubTitleProps {
  title: React.ReactNode;
}

export const WidgetSubTitle: FC<SubTitleProps> = ({ title }) => (
  <h3 className="py-1 heading-4">{title}</h3>
);
