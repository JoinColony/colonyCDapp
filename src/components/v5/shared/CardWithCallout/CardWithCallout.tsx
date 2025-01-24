import React, { type FC, type PropsWithChildren } from 'react';

import Card from '../Card/index.ts';

import { type CardWithCalloutProps } from './types.ts';

const CardWithCallout: FC<PropsWithChildren<CardWithCalloutProps>> = ({
  button,
  className = 'border-base-black',
  icon: Icon,
  title = null,
  subtitle,
  children,
}) => {
  const titleComponent =
    typeof title == 'string' ? (
      <h1 className="inline text-md font-medium">{title}</h1>
    ) : (
      title
    );

  return (
    <Card className={className}>
      <div className="mb-1.5 flex items-center gap-x-2">
        {Icon && <Icon size={24} />}
        {titleComponent}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 md:flex-nowrap md:gap-y-0">
        <div>
          {subtitle && <h2 className="mb-1 text-md font-medium">{subtitle}</h2>}
          {children && <div className="text-sm text-gray-600">{children}</div>}
        </div>
        {button}
      </div>
    </Card>
  );
};

export default CardWithCallout;
