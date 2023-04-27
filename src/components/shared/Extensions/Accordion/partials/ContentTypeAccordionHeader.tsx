import React from 'react';

const displayName = 'Extensions.Accordion.partials.ContentTypeAccordionHeader';

type Props = {
  children: string | JSX.Element | JSX.Element;
};

const ContentTypeAccordionHeader = ({ children }: Props) => (
  <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">{children}</div>
);
ContentTypeAccordionHeader.displayName = displayName;

export default ContentTypeAccordionHeader;
