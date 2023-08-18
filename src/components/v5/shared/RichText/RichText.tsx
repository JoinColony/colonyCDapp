import React, { FC } from 'react';
import { useIntl } from 'react-intl';
import { EditorContent } from '@tiptap/react';

import MenuBar from './partials/Menu';

import { MAX_ANNOTATION_NUM, MIN_ANNOTATION_NUM } from './consts';
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
  const { editorContent, characterCount } = useRichText(
    name,
    isDecriptionFieldExpanded,
  );
  const { formatMessage } = useIntl();

  return (
    <>
      <MenuBar editor={editorContent} />
      <EditorContent editor={editorContent} />

      {/* // wyswietlic jeśli jest sformatowany text lub ?? */}
      {editorContent?.storage?.characterCount?.characters() >=
        MIN_ANNOTATION_NUM &&
        !isDecriptionFieldExpanded && (
          <TextButton mode="underlined" onClick={toggleOnDecriptionSelect}>
            {formatMessage({ id: 'button.expand' })}
          </TextButton>
        )}

      <div className="flex items-center justify-between gap-4">
        {!!characterCount && isDecriptionFieldExpanded && (
          <TextButton mode="underlined" onClick={toggleOffDecriptionSelect}>
            {formatMessage({ id: 'button.show.less' })}
          </TextButton>
        )}
        {editorContent?.storage?.characterCount?.characters() >= 1000 && (
          <div className="text-xs text-gray-500 flex justify-end">
            {editorContent?.storage.characterCount.characters()} /{' '}
            {MAX_ANNOTATION_NUM}
          </div>
        )}
      </div>
    </>
  );
};

RichText.displayName = displayName;

export default RichText;
