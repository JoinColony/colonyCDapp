import React, { FC } from 'react';
import { ContentTypeProps } from '../types';

const displayName = 'Extensions.Accordion.partials.AccordionDetails';

const ContentTypeText: FC<ContentTypeProps> = ({ title, subTitle }) => (
  <div>
    <div className="font-medium text-gray-900 text-md pb-1">{title}</div>
    <div className="text-sm font-normal text-gray-600">{subTitle}</div>
  </div>
);

ContentTypeText.displayName = displayName;

export default ContentTypeText;
