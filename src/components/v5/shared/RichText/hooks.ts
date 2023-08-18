import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Document from '@tiptap/extension-document';
import Text from '@tiptap/extension-text';
import Blockquote from '@tiptap/extension-blockquote';
import Bold from '@tiptap/extension-bold';
import Heading from '@tiptap/extension-heading';
import { mergeAttributes } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Paragraph from '@tiptap/extension-paragraph';
import CharacterCount from '@tiptap/extension-character-count';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { MAX_ANNOTATION_NUM } from './consts';

export const useRichText = (
  name: string,
  isDecriptionFieldExpanded: boolean,
) => {
  const [content, setContent] = useState<string>('');

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
          limit: MAX_ANNOTATION_NUM,
        }),
      ],
      editorProps: {
        attributes: {
          class: `prose max-w-none ${
            isDecriptionFieldExpanded ? 'h-64' : 'h-auto'
          } overflow-scroll focus:outline-none text-gray-900 text-md`,
        },
      },
      content,
      onUpdate: ({ editor }) => {
        const json = editor.getHTML();
        setContent(json);
        localStorage.setItem('annotation', json);
      },
    },
    [],
  );

  useEffect(() => {
    const savedContent = localStorage.getItem('annotation');
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);

  useEffect(() => {
    if (content && editorContent) {
      editorContent.commands.setContent(content);
    }
  }, [editorContent, content]);

  useEffect(() => {
    if (content && editorContent && !isDecriptionFieldExpanded) {
      editorContent?.setEditable(false);
      setContent(editorContent?.getText());
    }
  }, [editorContent, content, isDecriptionFieldExpanded, setContent]);

  const { setValue } = useFormContext();

  useEffect(() => {
    const handleUpdate = ({ editor: textEditor }: { editor }) => {
      setValue(name, textEditor.getHTML());
    };

    editorContent?.commands.setContent(content);
    editorContent?.on('selectionUpdate', handleUpdate);
    editorContent?.on('blur', handleUpdate);

    return () => {
      editorContent?.off('selectionUpdate', handleUpdate);
      editorContent?.off('blur', handleUpdate);
    };
  }, [editorContent, content, name, setValue]);

  // @TODO: Text Big, Text Small in menu

  return { editorContent };
};
