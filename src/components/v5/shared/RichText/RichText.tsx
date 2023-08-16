import React, { FC, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './partials/Menu';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
// import parser from 'html-react-parser';
import Bold from '@tiptap/extension-bold';
import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Paragraph from '@tiptap/extension-paragraph';
import CharacterCount from '@tiptap/extension-character-count';
import { MAX_CHARACTERS_NUM, MIN_CHARACTERS_NUM } from './consts';
import { TextButton } from '../Button';
import { RichTextProps } from './types';

const displayName = 'v5.RichText';

const RichText: FC<RichTextProps> = ({
  isDecriptionFieldExpanded,
  toggleOnDecriptionSelect,
  toggleOffDecriptionSelect,
}) => {
  const [content, setContent] = useState<string>('');
  const { formatMessage } = useIntl();

  const editorContent = useEditor(
    {
      extensions: [
        Document,
        Text,
        CharacterCount,
        StarterKit.configure({
          heading: false,
        }),
        Placeholder.configure({
          placeholder: 'Enter a description',
          showOnlyWhenEditable: false,
          emptyNodeClass: `first:before:text-gray-500 first:before:hover:text-blue-400 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none`,
        }),
        Paragraph.configure({
          HTMLAttributes: {
            class: !isDecriptionFieldExpanded ? 'line-clamp-2 text-left' : '',
          },
        }),
        Heading.configure({ levels: [1, 2, 3] }).extend({
          levels: [1, 2],
          renderHTML({ node, HTMLAttributes }) {
            // @ts-ignore
            const level = this.options.levels.includes(node.attrs.level)
              ? node.attrs.level
              : // @ts-ignore
                this.options.levels[0];
            const classes = {
              1: 'heading-3',
              2: 'heading-4',
              3: 'heading-5',
            };
            return [
              `h${level}`,
              // @ts-ignore
              mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                class: `${classes[level]}`,
              }),
              0,
            ];
          },
        }),
        Bold.configure({
          HTMLAttributes: {
            class: 'text-md',
          },
        }),
        Blockquote.configure({
          HTMLAttributes: {
            class: 'border-l border-gray-300 pl-2 ml-4',
          },
        }),
        CharacterCount.configure({
          limit: MAX_CHARACTERS_NUM,
        }),
      ],
      editorProps: {
        attributes: {
          class: 'prose max-w-prose focus:outline-none text-gray-900 text-md',
        },
      },
      content: content,
      onUpdate: ({ editor }) => {
        const json = editor.getHTML();
        setContent(json);
        localStorage.setItem('decisionId', json);
        // const jsonContent = JSON.stringify(editor.getJSON()); // @TODO end to API
        // const data = {
        //   title: 'My title',
        //   content: editor.getJSON(),
        // };
        // window.localStorage.setItem('decisionId', JSON.stringify(data));
      },
    },
    [],
  );

  useEffect(() => {
    const savedContent = localStorage.getItem('decisionId');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  useEffect(() => {
    if (!isDecriptionFieldExpanded) {
      editorContent?.setEditable(false);
      editorContent?.chain().selectAll().unsetAllMarks().run();
    }
  }, [editorContent, isDecriptionFieldExpanded]);

  const characterCount: number = useMemo(
    () => editorContent?.storage?.characterCount?.characters(),
    [editorContent],
  );

  const shoudExpandButtonBeDisplayed = characterCount > MIN_CHARACTERS_NUM; // i jeśli jest sformatowany text ??

  return (
    <>
      <MenuBar editor={editorContent} />
      <EditorContent editor={editorContent} />

      {!!characterCount && isDecriptionFieldExpanded && (
        <TextButton mode="underlined" onClick={toggleOffDecriptionSelect}>
          {formatMessage({ id: 'button.show.less' })}
        </TextButton>
      )}

      {!!shoudExpandButtonBeDisplayed && !isDecriptionFieldExpanded && (
        <TextButton mode="underlined" onClick={toggleOnDecriptionSelect}>
          {formatMessage({ id: 'button.expand' })}
        </TextButton>
      )}
    </>
  );
};

RichText.displayName = displayName;

export default RichText;
