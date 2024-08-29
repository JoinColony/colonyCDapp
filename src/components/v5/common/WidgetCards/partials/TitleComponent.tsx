import React, { type FC } from 'react';

import { titleClassName } from '../styles.ts';

interface TitleProps {
  title: React.ReactNode;
}

export const TitleComponent: FC<TitleProps> = ({ title }) => (
  <span>
    <h3 className={titleClassName}>{title}</h3>
  </span>
);
