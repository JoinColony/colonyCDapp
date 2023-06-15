import React, { FC } from 'react';

import { ContentTypeProps } from '../types';

const displayName = 'Extensions.Accordion.partials.AccordionDetails';

const ContentTypeText: FC<ContentTypeProps> = ({ title, subTitle }) => (
  <div>
    <p className="font-medium text-md pb-1">{title}</p>
    <p className="text-sm text-gray-600">{subTitle}</p>
  </div>
);

ContentTypeText.displayName = displayName;

export default ContentTypeText;
