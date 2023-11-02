import React, { FC } from 'react';
import Icon from '~shared/Icon';

import Card from '../Card';

import { CardWithCalloutProps } from './types';

const CardWithCallout: FC<CardWithCalloutProps> = ({
  button,
  className = 'border-base-black',
  iconName,
  title = null,
  subtitle,
  text,
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
        {iconName && <Icon name={iconName} />}
        {titleComponent}
      </div>
      <div className="flex items-center justify-between gap-y-3 gap-x-2 flex-wrap md:flex-nowrap md:gap-y-0">
        <div>
          {subtitle && <h2 className="text-md font-medium mb-1">{subtitle}</h2>}
          {text && <p className="text-sm text-gray-600">{text}</p>}
        </div>
        {button}
      </div>
    </Card>
  );
};

export default CardWithCallout;
