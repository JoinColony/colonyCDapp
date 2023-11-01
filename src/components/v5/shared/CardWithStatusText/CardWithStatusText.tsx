import React from 'react';
import CardWithSections from '../CardWithSections/CardWithSections';
import StatusText from '../StatusText/StatusText';
import { CardWithStatusTextProps } from './types';

const displayName = 'v5.CardWithStatusText';

const CardWithStatusText: React.FC<CardWithStatusTextProps> = ({
  statusTextSectionProps,
  sections,
  footer,
  footerClassName,
}) => {
  const { content, ...restStatusTextSectionProps } = statusTextSectionProps;

  const sectionsWithStatusText = [
    {
      key: 'statusTextSection',
      className: 'bg-gray-50 !py-3',
      content: (
        <>
          <StatusText {...restStatusTextSectionProps} />
          {content || null}
        </>
      ),
    },
    ...sections,
  ];

  return (
    <CardWithSections
      sections={sectionsWithStatusText}
      footer={footer}
      footerClassName={footerClassName}
    />
  );
};

CardWithStatusText.displayName = displayName;

export default CardWithStatusText;
