import React from 'react';

import { type Message } from '~types';
import { formatText } from '~utils/intl.ts';

interface Props {
  title: Message;
  description: Message;
  ctaComponent: React.ReactNode;
}

export const ServiceItem: React.FC<Props> = ({
  title,
  description,
  ctaComponent,
}) => (
  <div className="flex flex-row items-center justify-between">
    <div className="flex flex-col gap-1">
      <p className="text-gray-900 heading-5">{formatText(title)}</p>
      <p className="text-sm font-normal text-gray-600">
        {formatText(description)}
      </p>
    </div>
    {ctaComponent}
  </div>
);
