import React, { FC, PropsWithChildren } from 'react';

import Icon from '~shared/Icon';

import Card from '../Card';

import { CardWithCalloutProps } from './types';

const CardWithCallout: FC<PropsWithChildren<CardWithCalloutProps>> = ({
  button,
  className = 'border-base-black',
  iconName,
  title = null,
  subtitle,
  children,
}) => {
  const titleComponent =
    typeof title == 'string' ? (
      <h1 className="text-md font-medium inline">{title}</h1>
    ) : (
      title
    );

  return (
    <Card className={className}>
      <div className="flex items-center gap-x-2 mb-1.5">
        {iconName && (
          <Icon
            name={iconName}
            appearance={{
              size: 'mediumSmallMediumLargeSmallTinyBigMediumLargeSmall',
            }}
          />
        )}
        {titleComponent}
      </div>
      <div className="flex items-center justify-between gap-y-3 gap-x-4 flex-wrap md:flex-nowrap md:gap-y-0">
        <div>
          {subtitle && <h2 className="text-md font-medium mb-1">{subtitle}</h2>}
          {children && <p className="text-sm text-gray-600">{children}</p>}
        </div>
        {button}
      </div>
    </Card>
  );
};

export default CardWithCallout;
