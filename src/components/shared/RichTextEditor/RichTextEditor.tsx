import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { EditorContent, Editor } from '@tiptap/react';
import { Editor as CoreEditor } from '@tiptap/core';
import classnames from 'classnames';

import { DEFAULT_CHARACTER_LIMIT } from '~hooks/useRichTextEditor';

import Toolbar from './Toolbar';

import styles from './RichTextEditor.css';

const displayName = 'RichTextEditor';

export interface RichTextEditorProps {
  /** Pass in a custom class name to the element wrapping the editor component */
  className?: string;
  /** Pass in content to be displayed in the editor, e.g. a previously saved decision */
  content?: string;
  /** Disable the editor */
  disabled?: boolean;
  /** The editor object, instantiated via useRichTextEditor */
  editor: Editor;
  /** Should the editor have a character limit? Pass false to disable. */
  limit?: number | boolean;
  /** The name of the form field the input belongs to */
  name: string;
}

const RichTextEditor = ({
  className,
  content = '',
  editor,
  disabled = false,
  limit = DEFAULT_CHARACTER_LIMIT,
  name,
}: RichTextEditorProps) => {
  const {
    getFieldState,
    setValue,
    formState: { isSubmitting },
  } = useFormContext();
  const { error: contentError, isTouched: contentTouched } =
    getFieldState(name);

  useEffect(() => {
    const handleUpdate = ({ editor: textEditor }: { editor: CoreEditor }) => {
      setValue(name, textEditor.getHTML(), {
        shouldValidate: true,
        shouldTouch: true,
      });
    };

    editor.commands.setContent(content);
    editor.on('selectionUpdate', handleUpdate);
    editor.on('blur', handleUpdate);
    editor.setEditable(!disabled);

    return () => {
      editor.off('selectionUpdate', handleUpdate);
      editor.off('blur', handleUpdate);
    };
  }, [editor, content, disabled]);

  return (
    editor && (
      <div
        className={classnames(styles.main, className, {
          [styles.disabled]: isSubmitting || disabled,
        })}
      >
        <Toolbar editor={editor} />
        <EditorContent
          editor={editor}
          className={classnames(styles.editorContainer, {
            [styles.error]: contentError && contentTouched,
          })}
        />
        {limit && (
          <span className={styles.characterCount}>
            {editor.storage.characterCount.characters()} / {limit}
          </span>
        )}
      </div>
    )
  );
};

RichTextEditor.displayName = displayName;

export default RichTextEditor;
