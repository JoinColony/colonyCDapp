import { Extension, useEditor, Node } from '@tiptap/react';
// @TODO: Investigate fix...
// import Placeholder from '@tiptap/extension-placeholder';

import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

export const DEFAULT_CHARACTER_LIMIT = 4000;
// const DEFAULT_PLACEHOLDER = 'Enter the description...';

const getDefaultExtensions = (limit: number /* placeholder: string */) => [
  StarterKit,
  Underline,
  TextStyle,
  Color,
  CharacterCount.configure({ limit }),
  // Placeholder.configure({
  //   placeholder,
  // }),,
];

const defaultExtensions = getDefaultExtensions(
  DEFAULT_CHARACTER_LIMIT,
  // DEFAULT_PLACEHOLDER,
);
const useRichTextEditor = (
  content = '',
  extensions: (Extension | Node)[] = defaultExtensions,
) => {
  const editor = useEditor({
    extensions,
    content,
  });

  return { editor };
};

export default useRichTextEditor;
