/* eslint-disable react/no-this-in-sfc */
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import Underline from '@tiptap/extension-underline';
import Bold from '@tiptap/extension-bold';
import Heading from '@tiptap/extension-heading';
import React from 'react';

const displayName = 'v5.RichTextDisplay';

interface RichTextDisplayProps {
  content: string;
}

const RichTextDisplay = ({ content }: RichTextDisplayProps) => {
  const editor = useEditor(
    {
      editable: false,
      extensions: [
        Document,
        Text,
        Underline,
        StarterKit.configure({
          heading: false,
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
      ],
      editorProps: {
        attributes: {
          class: `prose max-w-none overflow-auto focus:outline-none text-gray-900 text-md`,
        },
      },
      content,
    },
    [],
  );

  return <EditorContent editor={editor} />;
};

RichTextDisplay.displayName = displayName;
export default RichTextDisplay;
