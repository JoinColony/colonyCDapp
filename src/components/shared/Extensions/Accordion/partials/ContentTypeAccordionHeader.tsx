import React, { FC, PropsWithChildren } from 'react';

const displayName = 'Extensions.Accordion.partials.ContentTypeAccordionHeader';

const ContentTypeAccordionHeader: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">{children}</div>
);

ContentTypeAccordionHeader.displayName = displayName;

export default ContentTypeAccordionHeader;
