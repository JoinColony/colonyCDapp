import React, { FC } from 'react';
import { BubbleMenu } from '@tiptap/react';

import { MenuBarProps } from '../types';
import styles from './Menu.module.css';
import Icon from '~shared/Icon';

const displayName = 'v5.RichText.partials.MenuBar';

const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      className={styles.bubbleMenu}
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="h-one" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="h-two" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="h-three" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="bold" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="italic" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="underline" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <div className="w-px h-4 bg-gray-200 mx-2" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="numbers" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="bullets" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <span className={styles.icon}>
          <Icon name="quotes" appearance={{ size: 'extraSmall' }} />
        </span>
      </button>
    </BubbleMenu>
  );
};

MenuBar.displayName = displayName;

export default MenuBar;
