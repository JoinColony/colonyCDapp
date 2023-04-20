import React from 'react';

const displayName = 'Extensions.Accordion.Partials.ContentTypeAccordionContent';

type Props = {
  children: string | JSX.Element | JSX.Element;
};

const ContentTypeAccordionContent = ({ children }: Props) => {
  return <div className="text-sm font-normal text-gray-600 pt-2">{children}</div>;
};

ContentTypeAccordionContent.displayName = displayName;

export default ContentTypeAccordionContent;
