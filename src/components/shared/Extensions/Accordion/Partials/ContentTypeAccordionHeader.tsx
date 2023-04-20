import React from 'react';

const displayName = 'Extensions.Accordion.Partials.ContentTypeAccordionHeader';

type Props = {
  children: string | JSX.Element | JSX.Element;
};

const ContentTypeAccordionHeader = ({ children }: Props) => {
  return <div className="flex justify-between items-center marker:font-medium text-gray-900 text-md">{children}</div>;
};

ContentTypeAccordionHeader.displayName = displayName;

export default ContentTypeAccordionHeader;
