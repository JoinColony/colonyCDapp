import { mergeAttributes } from '@tiptap/core';
import CharacterCount from '@tiptap/extension-character-count';
import Heading from '@tiptap/extension-heading';
import Placeholder from '@tiptap/extension-placeholder';
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
        StarterKit.configure({
          heading: false,
          blockquote: {
            HTMLAttributes: {
              class: 'border-l border-gray-300 pl-2 ml-8',
            },
          },
          paragraph: {
            HTMLAttributes: {
              class: 'text-md empty:h-[1lh]',
            },
          },
          bulletList: {
            HTMLAttributes: {
              class: 'list-disc pl-6',
            },
          },
          orderedList: {
            HTMLAttributes: {
              class: 'list-decimal pl-6',
            },
          },
          listItem: {
            HTMLAttributes: {
              class: 'marker:normal-nums',
            },
          },
        }),
        Underline,
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
        const trimmedText = props.editor.getText().trim();
        const isCreatingHeading = !!props.editor.getAttributes('heading');
        const isCreatingList = !!props.editor.getAttributes('list');
        const html =
          (props.editor.isEmpty || trimmedText.length === 0) &&
          !isCreatingHeading &&
          !isCreatingList
            ? ''
            : props.editor.getHTML();

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
    const handleBlur = ({ editor: textEditor }: { editor }) => {
      const trimmedText = textEditor.getText().trim();

      const html =
        textEditor.isEmpty || trimmedText.length === 0
          ? ''
          : textEditor.getHTML();

      field.onChange(html);
    };

    editor?.on('blur', handleBlur);

    return () => {
      editor?.off('blur', handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, field.value, name]);

  useEffect(() => {
    if (editor?.getHTML() === field.value) {
      return;
    }

    editor?.commands.setContent(field.value);
    setNotFormattedContent(
      editor?.getText() || formatText({ id: 'placeholder.enterDescription' }),
    );
  }, [editor, field.value]);

  return { editor, notFormattedContent, field, characterCount };
};
