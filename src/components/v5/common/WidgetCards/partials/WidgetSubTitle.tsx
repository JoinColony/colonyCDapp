import React, { type FC } from 'react';

interface SubTitleProps {
  title: React.ReactNode;
}

export const WidgetSubTitle: FC<SubTitleProps> = ({ title }) => (
  <h4 className="heading-4">{title}</h4>
);
