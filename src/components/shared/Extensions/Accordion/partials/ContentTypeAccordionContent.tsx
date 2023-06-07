import React from 'react';

const displayName = 'Extensions.Accordion.partials.ContentTypeAccordionContent';

type Props = {
  children: string | JSX.Element | JSX.Element;
};

const ContentTypeAccordionContent = ({ children }: Props) => (
  <div className="text-sm font-normal text-gray-600 pt-2">{children}</div>
);
ContentTypeAccordionContent.displayName = displayName;

export default ContentTypeAccordionContent;
