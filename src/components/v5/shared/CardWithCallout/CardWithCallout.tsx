import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import Icon from '~shared/Icon';

import Card from '../Card';

import { CardWithCalloutProps } from './types';

const CardWithCallout: FC<CardWithCalloutProps> = ({
  button,
  iconName,
  title,
  subtitle,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Card className="border-base-black">
      {iconName && (
        <span className="mb-1.5">
          <Icon name={iconName} />
        </span>
      )}
      <div className="flex items-center justify-between flex-wrap gap-y-3 md:gap-y-0">
        <div>
          <h1 className="text-md font-medium mb-1">{formatMessage(title)}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{formatMessage(subtitle)}</p>
          )}
        </div>
        {button}
      </div>
    </Card>
  );
};

export default CardWithCallout;
