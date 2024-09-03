import React, { type FC } from 'react';

import { titleClassName } from '../styles.ts';

interface WidgetTitleProps {
  title: React.ReactNode;
}

export const WidgetTitle: FC<WidgetTitleProps> = ({ title }) => (
  <h3 className={titleClassName}>{title}</h3>
);
