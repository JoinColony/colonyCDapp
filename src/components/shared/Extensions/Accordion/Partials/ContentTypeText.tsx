import React, { FC } from 'react';
import { ContentTypeTextProps } from '../Accordion.types';

const displayName = 'Extensions.Accordion.Partials.AccordionDetails';

const ContentTypeText: FC<ContentTypeTextProps> = ({ title, subTitle }) => {
  /*
   * @TODO: add translactions
   */
  return (
    <div>
      <div className="font-medium text-gray-900 text-md pb-1">{title}</div>
      <div className="text-sm font-normal text-gray-600 max-w-[28.5625rem]">{subTitle}</div>
    </div>
  );
};

ContentTypeText.displayName = displayName;

export default ContentTypeText;
