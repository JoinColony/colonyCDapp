import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { EditorContent } from '@tiptap/react';

import clsx from 'clsx';
import MenuBar from './partials/Menu';
import {
  MAX_ANNOTATION_NUM,
  MIN_ANNOTATION_NUM,
  NUMBER_OF_CHARS_IN_TWO_LINES,
} from './consts';
import { TextButton } from '../Button';
import { RichTextProps } from './types';
import { useRichText } from './hooks';

const displayName = 'v5.RichText';

const RichText: FC<RichTextProps> = ({
  name,
  isDecriptionFieldExpanded,
  toggleOnDecriptionSelect,
  toggleOffDecriptionSelect,
}) => {
  const { editorContent, notFormattedContent, field, characterCount } =
    useRichText(name, isDecriptionFieldExpanded);
  const { formatMessage } = useIntl();

  return (
    <>
      {editorContent && isDecriptionFieldExpanded ? (
        <>
          <MenuBar editor={editorContent} />
          <EditorContent editor={editorContent} {...field} />

          {(characterCount || isDecriptionFieldExpanded) && (
            <div className="flex items-center justify-between mt-4">
              {isDecriptionFieldExpanded && (
                <TextButton
                  mode="underlined"
                  className="text-gray-400"
                  onClick={toggleOffDecriptionSelect}
                >
                  {formatMessage({ id: 'button.show.less' })}
                </TextButton>
              )}
              {characterCount >= 1000 && isDecriptionFieldExpanded && (
                <div className="text-xs text-gray-500 flex justify-end">
                  {characterCount} / {MAX_ANNOTATION_NUM}
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
              'text-gray-500': !characterCount,
            })}
          >
            <span
              className={clsx({
                'line-clamp-2 text-left': characterCount >= MIN_ANNOTATION_NUM,
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
                {formatMessage({ id: 'button.expand' })}
              </TextButton>
            )}
        </>
      )}
    </>
  );
};

RichText.displayName = displayName;

export default RichText;
