import React, { type FC } from 'react';

interface WidgetTitleProps {
  title: React.ReactNode;
}

export const WidgetTitle: FC<WidgetTitleProps> = ({ title }) => (
  <h3 className="text-md">{title}</h3>
);
