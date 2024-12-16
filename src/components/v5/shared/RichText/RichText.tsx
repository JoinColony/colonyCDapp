import clsx from 'clsx';
import React, { type FC, useLayoutEffect, useState } from 'react';

import { formatText } from '~utils/intl.ts';
import { omit } from '~utils/lodash.ts';

import { TextButton } from '../Button/index.ts';

import { MAX_ANNOTATION_NUM } from './consts.ts';
import { useRichText } from './hooks.ts';
import MenuBar from './partials/Menu.tsx';
import RichTextContent from './partials/RichTextContent/index.ts';
import { type RichTextProps } from './types.ts';

const displayName = 'v5.RichText';

const RichText: FC<RichTextProps> = ({
  name,
  isReadonly,
  isDecriptionFieldExpanded,
  maxDescriptionLength = MAX_ANNOTATION_NUM,
  toggleOnDecriptionSelect,
  toggleOffDecriptionSelect,
  shouldFocus,
  isDisabled,
}) => {
  const { editor, notFormattedContent, field, characterCount } = useRichText({
    name,
    isDecriptionFieldExpanded,
    isReadonly,
    maxDescriptionLength,
  });

  useLayoutEffect(() => {
    if (shouldFocus) {
      editor?.commands.focus();
    }
    // @NOTE: Calling focus() with editor included in the dependencies causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFocus]);

  const [isTextTruncated, setIsTextTruncated] = useState(false);

  return (
    <>
      {isReadonly ? (
        <>
          {editor && isDecriptionFieldExpanded ? (
            <RichTextContent editor={editor} {...omit(field, 'ref')} />
          ) : (
            <>
              <button
                type="button"
                onClick={toggleOnDecriptionSelect}
                className={clsx(
                  'w-full text-left transition sm:hover:text-blue-400',
                  {
                    'text-gray-900': characterCount,
                    'text-gray-400': !characterCount,
                  },
                )}
              >
                <span
                  ref={(ref) => {
                    if (!ref) {
                      return;
                    }

                    setIsTextTruncated(ref.scrollHeight > ref.offsetHeight);
                  }}
                  className="line-clamp-2 break-words text-left"
                >
                  {notFormattedContent}
                </span>
              </button>
              {isTextTruncated && !isDecriptionFieldExpanded && (
                <TextButton
                  mode="underlined"
                  className="ml-1 text-gray-400"
                  onClick={toggleOnDecriptionSelect}
                >
                  {formatText({ id: 'button.expand' })}
                </TextButton>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {editor && isDecriptionFieldExpanded ? (
            <>
              <MenuBar editor={editor} />
              <RichTextContent editor={editor} {...omit(field, 'ref')} />

              {characterCount && isDecriptionFieldExpanded ? (
                <div className="mt-4 flex items-center justify-between">
                  {characterCount >= 1000 && isDecriptionFieldExpanded && (
                    <TextButton
                      mode="underlined"
                      className="text-gray-400"
                      onClick={toggleOffDecriptionSelect}
                    >
                      {formatText({ id: 'button.show.less' })}
                    </TextButton>
                  )}
                  {characterCount >= maxDescriptionLength / 4 &&
                    isDecriptionFieldExpanded && (
                      <div className="flex justify-end text-xs text-gray-500">
                        {characterCount} / {maxDescriptionLength}
                      </div>
                    )}
                </div>
              ) : null}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleOnDecriptionSelect}
                className={clsx('text-left transition', {
                  'text-gray-900': characterCount,
                  'text-gray-400': !characterCount && !isDisabled,
                  'text-gray-300': isDisabled,
                  'sm:hover:text-blue-400': !isDisabled,
                })}
                disabled={isDisabled}
              >
                <span
                  ref={(ref) => {
                    if (!ref) {
                      return;
                    }

                    setIsTextTruncated(ref.scrollHeight > ref.offsetHeight);
                  }}
                  className="line-clamp-2 text-left break-word"
                >
                  {notFormattedContent}
                </span>
              </button>
              {isTextTruncated && !isDecriptionFieldExpanded && (
                <TextButton
                  mode="underlined"
                  className="ml-1 text-gray-400"
                  onClick={toggleOnDecriptionSelect}
                >
                  {formatText({ id: 'button.expand' })}
                </TextButton>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

RichText.displayName = displayName;

export default RichText;
