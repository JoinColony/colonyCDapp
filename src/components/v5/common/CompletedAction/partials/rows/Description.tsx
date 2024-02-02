import clsx from 'clsx';
import DOMPurify from 'dompurify';
import { CaretRight, Pencil } from 'phosphor-react';
import React, { useState } from 'react';

import { formatText } from '~utils/intl.ts';
import RichTextDisplay from '~v5/shared/RichTextDisplay/index.ts';

import { ICON_SIZE } from '../../consts.ts';

const displayName = 'v5.common.CompletedAction.partials.DescriptionRow';

interface DescriptionRowProps {
  description: string;
}

const SHORT_DESCRIPTION_CHAR_LIMIT = 180;

// @NOTE this is pretty hacky with the arbitrary limit and DOMPurify sanitization
// it's also outside the grid, since it changes from a row to a column
const DescriptionRow = ({ description }: DescriptionRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const descriptionTextContent = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [],
  });
  const isDescriptionClamped =
    descriptionTextContent.length > SHORT_DESCRIPTION_CHAR_LIMIT;

  const isExpandButtonVisible = !isExpanded && isDescriptionClamped;

  return (
    <div
      className={clsx('flex items-start text-md text-gray-900 mt-4', {
        'flex-col': isExpanded,
      })}
    >
      <div className="w-40 sm:w-[12.5rem]">
        <button
          className="flex items-center hover:text-blue-400"
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
      </div>
      <div
        className={clsx('flex flex-1 items-start', {
          'h-10': !isExpanded,
          'flex-col mt-4': isExpanded,
        })}
      >
        <RichTextDisplay
          content={description}
          shouldFormat={isExpanded}
          className={
            !isExpanded ? 'flex-1 line-clamp-2 text-left break-word' : undefined
          }
        />
        {isExpandButtonVisible && (
          <button
            type="button"
            className="font-medium text-xs underline text-gray-400 ml-1 hover:text-blue-400 self-end"
            onClick={() => {
              setIsExpanded(true);
            }}
          >
            {formatText({ id: 'button.expand' })}
          </button>
        )}
        {isExpanded && (
          <button
            type="button"
            className="font-medium text-xs underline text-gray-400 mt-4 hover:text-blue-400"
            onClick={() => {
              setIsExpanded(false);
            }}
          >
            {formatText({ id: 'button.show.less' })}
          </button>
        )}
      </div>
    </div>
  );
};

DescriptionRow.displayName = displayName;
export default DescriptionRow;
