import { Editor } from '@tiptap/core';
import classNames from 'classnames';
import React from 'react';

import Button from '~shared/Button';
import Icon from '~shared/Icon';

import styles from './Toolbar.css';

const displayName = 'RichTextEditor.Toolbar.ToolbarItem';

interface ToolbarItemProps {
  onClick: () => void;
  icon: string;
  keyboardShortcut: string;
  annotation: string;
  editor: Editor;
  style?: React.CSSProperties;
}

const ToolbarItem = ({
  onClick,
  icon,
  keyboardShortcut,
  annotation,
  editor,
  style,
}: ToolbarItemProps) => (
  <Button
    appearance={{ theme: 'ghost' }}
    onClick={onClick}
    className={classNames({
      [styles.selected]: editor.isActive(icon),
    })}
    key={icon}
    name={icon}
  >
    <Icon
      name={icon}
      title={`${annotation}, <${keyboardShortcut}>`}
      style={style}
    />
  </Button>
);

ToolbarItem.displayName = displayName;

export default ToolbarItem;
