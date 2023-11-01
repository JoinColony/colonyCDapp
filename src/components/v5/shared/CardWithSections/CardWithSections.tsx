import React from 'react';
import clsx from 'clsx';
import Card from '../Card';
import { CardWithSectionsProps } from './types';

const displayName = 'v5.CardWithSections';

const CardWithSections: React.FC<CardWithSectionsProps> = ({
  sections,
  footer,
  footerClassName,
}) =>
  sections.length ? (
    <Card className="w-full overflow-hidden" withPadding={false}>
      {sections.map(({ key, content, className }) => (
        <div
          key={key}
          className={clsx(
            className,
            'border-b border-gray-200 last:border-b-0 p-[1.125rem]',
          )}
        >
          {content}
        </div>
      ))}
      {footer && (
        <div className={clsx(footerClassName, 'p-[1.125rem]')}>{footer}</div>
      )}
    </Card>
  ) : null;

CardWithSections.displayName = displayName;

export default CardWithSections;
