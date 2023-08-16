import React from 'react';
import classNames from 'classnames';
import { Editor } from '@tiptap/core';

import Button from '~shared/Button';
import Icon from '~shared/Icon';

import { Icons } from './toolbarConfig';

import styles from './Toolbar.css';

const displayName = 'RichTextEditor.Toolbar.ColorPicker';

interface ColorPickerProps {
  editor: Editor;
}

const handleFocus = (editor: Editor) =>
  editor.chain().focus().unsetColor().run();

const handleChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  editor: Editor,
) => {
  editor.chain().focus().setColor(event.target.value).run();
};

const ColorPicker = ({ editor }: ColorPickerProps) => (
  <div className={styles.inputWrapper} title="Change text color">
    <Button
      appearance={{ theme: 'ghost' }}
      className={classNames({
        [styles.selected]: editor.isActive('textStyle'),
      })}
    >
      <Icon name={Icons.droplet} />
    </Button>
    <input
      type="color"
      onFocus={() => handleFocus(editor)}
      onChange={(e) => handleChange(e, editor)}
    />
  </div>
);

ColorPicker.displayName = displayName;

export default ColorPicker;
