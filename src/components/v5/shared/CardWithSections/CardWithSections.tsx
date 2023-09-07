import React from 'react';
import clsx from 'clsx';
import Card from '../Card';
import { CardWithSectionsProps } from './types';

const displayName = 'v5.CardWithSections';

const CardWithSections: React.FC<CardWithSectionsProps> = ({ sections }) =>
  sections.length ? (
    <Card withPadding={false}>
      {sections.map(({ key, content, className }) => (
        <div
          key={key}
          className={clsx(
            className,
            'border-b border-gray-200 last:border-b-0 px-[1.125rem] py-[1.125rem]',
          )}
        >
          {content}
        </div>
      ))}
    </Card>
  ) : null;

CardWithSections.displayName = displayName;

export default CardWithSections;
