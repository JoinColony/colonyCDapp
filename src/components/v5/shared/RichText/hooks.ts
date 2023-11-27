import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import Underline from '@tiptap/extension-underline';
import Bold from '@tiptap/extension-bold';
import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';
import { MAX_ANNOTATION_NUM } from './consts';
import { formatText } from '~utils/intl';

export const useRichText = (
  name: string,
  isDecriptionFieldExpanded: boolean,
  isReadonly?: boolean,
) => {
  const [notFormattedContent, setNotFormattedContent] = useState<string>('');
  const { field } = useController({
    name,
  });

  const editorContent = useEditor(
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
              formatText({ id: 'placeholder.enterDescription' }) || '',
            );
            return formatText({ id: 'placeholder.enterDescription' }) || '';
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
          limit: MAX_ANNOTATION_NUM,
        }),
      ],
      editorProps: {
        attributes: {
          class: `prose max-w-none overflow-auto focus:outline-none text-gray-900 text-md`,
        },
      },
      content: field.value,
      onUpdate: ({ editor }) => {
        const json = editor.getHTML();
        field.onChange(json);
      },
    },
    [],
  );

  const characterCount: number =
    editorContent?.storage.characterCount.characters();

  useEffect(() => {
    if (field.value && editorContent && !isDecriptionFieldExpanded) {
      editorContent?.setEditable(false);
      setNotFormattedContent(
        (editorContent?.getText() && editorContent?.getText()) ||
          (!editorContent?.getText() &&
            formatText({ id: 'placeholder.enterDescription' })) ||
          '',
      );
    }
  }, [editorContent, isDecriptionFieldExpanded, field.value]);

  useEffect(() => {
    const handleUpdate = ({ editor: textEditor }: { editor }) => {
      field.onChange(textEditor.getHTML());
    };

    editorContent?.on('selectionUpdate', handleUpdate);
    editorContent?.on('blur', handleUpdate);

    return () => {
      editorContent?.off('selectionUpdate', handleUpdate);
      editorContent?.off('blur', handleUpdate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorContent, field.value, name]);

  return { editorContent, notFormattedContent, field, characterCount };
};
