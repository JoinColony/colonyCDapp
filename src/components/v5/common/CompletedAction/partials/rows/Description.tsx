import { CaretRight, Pencil } from '@phosphor-icons/react';
import clsx from 'clsx';
import DOMPurify from 'dompurify';
import React, { useState } from 'react';

import { formatText } from '~utils/intl.ts';
import { ICON_SIZE } from '~v5/common/CompletedAction/consts.ts';
import RichTextDisplay from '~v5/shared/RichTextDisplay/index.ts';

const displayName = 'v5.common.CompletedAction.partials.DescriptionRow';

interface DescriptionRowProps {
  description: string;
  isDefaultExpanded?: boolean;
}

const SHORT_DESCRIPTION_CHAR_LIMIT = 180;

// @NOTE this is pretty hacky with the arbitrary limit and DOMPurify sanitization
// it's also outside the grid, since it changes from a row to a column
const DescriptionRow = ({
  description,
  isDefaultExpanded = false,
}: DescriptionRowProps) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const descriptionTextContent = DOMPurify.sanitize(description, {
    ALLOWED_TAGS: [],
  });
  const isDescriptionClamped =
    descriptionTextContent.length > SHORT_DESCRIPTION_CHAR_LIMIT;

  const isExpandButtonVisible = !isExpanded && isDescriptionClamped;

  const onClickText = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <div
      className={clsx('mt-4 flex items-start text-md text-gray-900', {
        'flex-col': isExpanded,
      })}
    >
      <div className="w-40 flex-shrink-0 sm:w-[12.5rem]">
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
              'rotate-0 transition-transform duration-300 ease-in-out',
              {
                'rotate-90': isExpanded,
              },
            )}
          />
        </button>
      </div>
      <div
        className={clsx('flex items-start', {
          'h-10 flex-1 cursor-pointer': !isExpanded,
          'mt-4 w-full cursor-default flex-col': isExpanded,
        })}
        onClick={onClickText}
        onKeyDown={onClickText}
        role="button"
        tabIndex={0}
      >
        <RichTextDisplay
          content={description}
          shouldFormat={isExpanded}
          className={clsx('w-full break-word', {
            'line-clamp-2 flex-1 text-left': !isExpanded,
          })}
        />
        {isExpandButtonVisible && (
          <button
            type="button"
            className="ml-1 self-end text-xs font-medium text-gray-400 underline hover:text-blue-400"
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
            className="mt-4 text-xs font-medium text-gray-400 underline hover:text-blue-400"
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
