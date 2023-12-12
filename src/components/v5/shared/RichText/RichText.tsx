import { EditorContent } from '@tiptap/react';
import clsx from 'clsx';
import React, { FC, useLayoutEffect } from 'react';

import { formatText } from '~utils/intl';
import { omit } from '~utils/lodash';

import { TextButton } from '../Button';

import {
  MAX_ANNOTATION_NUM,
  MIN_ANNOTATION_NUM,
  NUMBER_OF_CHARS_IN_TWO_LINES,
} from './consts';
import { useRichText } from './hooks';
import MenuBar from './partials/Menu';
import { RichTextProps } from './types';

const displayName = 'v5.RichText';

const RichText: FC<RichTextProps> = ({
  name,
  isReadonly,
  isDecriptionFieldExpanded,
  maxDescriptionLength = MAX_ANNOTATION_NUM,
  toggleOnDecriptionSelect,
  toggleOffDecriptionSelect,
  shouldFocus,
}) => {
  const { editor, notFormattedContent, field, characterCount } = useRichText(
    name,
    isDecriptionFieldExpanded,
    isReadonly,
    maxDescriptionLength,
  );

  useLayoutEffect(() => {
    if (shouldFocus) {
      editor?.commands.focus();
    }
    // @NOTE: Calling focus() with editor included in the dependencies causes an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFocus]);

  return (
    <>
      {isReadonly ? (
        <>
          {editor && isDecriptionFieldExpanded ? (
            <EditorContent editor={editor} />
          ) : (
            <>
              <button
                type="button"
                onClick={toggleOnDecriptionSelect}
                className={clsx('sm:hover:text-blue-400 w-full', {
                  'text-gray-900': characterCount,
                  'text-gray-400': !characterCount,
                })}
              >
                <span
                  className={clsx({
                    'line-clamp-2 text-left break-words':
                      characterCount >= MIN_ANNOTATION_NUM,
                  })}
                >
                  {notFormattedContent}
                </span>
              </button>
              {characterCount > NUMBER_OF_CHARS_IN_TWO_LINES &&
                !isDecriptionFieldExpanded && (
                  <TextButton
                    mode="underlined"
                    className="text-gray-400 ml-1"
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
              <EditorContent editor={editor} {...omit(field, 'ref')} />

              {(characterCount || isDecriptionFieldExpanded) && (
                <div className="flex items-center justify-between mt-4">
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
                      <div className="text-xs text-gray-500 flex justify-end">
                        {characterCount} / {maxDescriptionLength}
                      </div>
                    )}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleOnDecriptionSelect}
                className={clsx('sm:hover:text-blue-400', {
                  'text-gray-900': characterCount,
                  'text-gray-400': !characterCount,
                })}
              >
                <span
                  className={clsx({
                    'line-clamp-2 text-left':
                      characterCount >= MIN_ANNOTATION_NUM,
                  })}
                >
                  {notFormattedContent}
                </span>
              </button>
              {characterCount > NUMBER_OF_CHARS_IN_TWO_LINES &&
                !isDecriptionFieldExpanded && (
                  <TextButton
                    mode="underlined"
                    className="text-gray-400 ml-1"
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
