import React from 'react';
import { Editor } from '@tiptap/core';

import { getToolbarItems, ColorPicker, ToolbarItem } from '../Toolbar';

import styles from './Toolbar.css';

const displayName = 'RichText.Toolbar';

interface ToolbarProps {
  editor: Editor;
}

const Toolbar = ({ editor }: ToolbarProps) => (
  <div className={styles.main}>
    {getToolbarItems(editor).map(
      ({ onClick, icon, keyboardShortcut, annotation }) => (
        <ToolbarItem
          onClick={onClick}
          icon={icon}
          keyboardShortcut={keyboardShortcut}
          annotation={annotation}
          editor={editor}
          key={icon}
        />
      ),
    )}
    <ColorPicker editor={editor} />
  </div>
);

Toolbar.displayName = displayName;

export default Toolbar;
