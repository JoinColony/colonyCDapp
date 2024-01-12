import clsx from 'clsx';
import { CaretRight, Pencil } from 'phosphor-react';
import React, { useState } from 'react';

import { formatText } from '~utils/intl';
import RichTextDisplay from '~v5/shared/RichTextDisplay';

import { ICON_SIZE } from '../../consts';

const displayName = 'v5.common.CompletedAction.partials.DescriptionRow';

interface DescriptionRowProps {
  description: string;
}

const DescriptionRow = ({ description }: DescriptionRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <button
        className="flex items-center self-start"
        type="button"
        onClick={() => {
          setIsExpanded((previousExpanded) => !previousExpanded);
        }}
      >
        <Pencil size={ICON_SIZE} />
        <span className="ml-2 mr-1">
          {formatText({ id: 'actionSidebar.description' })}
        </span>
        <CaretRight
          size={12}
          className={clsx(
            'transition-transform duration-300 ease-in-out rotate-0',
            {
              'rotate-90': isExpanded,
            },
          )}
        />
      </button>
      <div
        className={clsx('self-start', {
          'col-span-2': isExpanded,
        })}
      >
        <RichTextDisplay
          content={description}
          shouldFormat={isExpanded}
          className={
            !isExpanded ? 'line-clamp-2 text-left break-words' : undefined
          }
        />
      </div>
    </>
  );
};

DescriptionRow.displayName = displayName;
export default DescriptionRow;
