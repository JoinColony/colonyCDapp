import { mergeAttributes } from '@tiptap/core';
import Blockquote from '@tiptap/extension-blockquote';
import CharacterCount from '@tiptap/extension-character-count';
import Document from '@tiptap/extension-document';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import { formatText } from '~utils/intl.ts';

export const useRichText = (
  name: string,
  isDecriptionFieldExpanded: boolean,
  isReadonly?: boolean,
  maxDescriptionLength?: number,
) => {
  const [notFormattedContent, setNotFormattedContent] = useState<string>('');
  const { field } = useController({
    name,
  });

  const editor = useEditor(
    {
      editable: !isReadonly,
      extensions: [
        Document,
        Text,
        CharacterCount,
        Underline,
        StarterKit.configure({
          heading: false,
        }),
        Placeholder.configure({
          placeholder: () => {
            setNotFormattedContent(
              formatText({ id: 'placeholder.enterDescription' }),
            );
            return formatText({ id: 'placeholder.enterDescription' });
          },
          showOnlyWhenEditable: false,
          emptyEditorClass: `text-gray-500 before:content-[attr(data-placeholder)] before:float-left before:h-0 before:pointer-events-none`,
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
        Blockquote.configure({
          HTMLAttributes: {
            class: 'border-l border-gray-300 pl-2 ml-8',
          },
        }),
        CharacterCount.configure({
          limit: maxDescriptionLength,
        }),
      ],
      editorProps: {
        attributes: {
          class: `max-w-none overflow-auto focus:outline-none text-gray-900 text-md`,
        },
      },
      content: field.value,
      onUpdate: (props) => {
        const html = props.editor.isEmpty ? '' : props.editor.getHTML();
        field.onChange(html);
      },
    },
    [],
  );

  const characterCount: number = editor?.storage.characterCount.characters();

  useEffect(() => {
    if (field.value && editor && !isDecriptionFieldExpanded) {
      editor?.setEditable(false);
      setNotFormattedContent(
        editor?.getText() || formatText({ id: 'placeholder.enterDescription' }),
      );
    }
  }, [editor, isDecriptionFieldExpanded, field.value]);

  useEffect(() => {
    const handleUpdate = ({ editor: textEditor }: { editor }) => {
      field.onChange(textEditor.getHTML());
    };

    editor?.on('selectionUpdate', handleUpdate);
    editor?.on('blur', handleUpdate);

    return () => {
      editor?.off('selectionUpdate', handleUpdate);
      editor?.off('blur', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, field.value, name]);

  return { editor, notFormattedContent, field, characterCount };
};
