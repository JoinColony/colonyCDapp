import { BubbleMenu } from '@tiptap/react';
import clsx from 'clsx';
import {
  TextHOne,
  TextBolder,
  TextHTwo,
  TextHThree,
  TextItalic,
  TextUnderline,
  ListNumbers,
  ListBullets,
  Quotes,
} from 'phosphor-react';
import React, { FC } from 'react';

import { MenuBarProps } from '../types.ts';

import styles from './Menu.module.css';

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
      >
        <TextHOne
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('heading', { level: 1 }),
            'text-gray-900': !editor.isActive('heading', { level: 1 }),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <TextHTwo
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('heading', { level: 2 }),
            'text-gray-900': !editor.isActive('heading', { level: 2 }),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <TextHThree
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('heading', { level: 3 }),
            'text-gray-900': !editor.isActive('heading', { level: 3 }),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <TextBolder
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('bold'),
            'text-gray-900': !editor.isActive('bold'),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalic
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('italic'),
            'text-gray-900': !editor.isActive('italic'),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <TextUnderline
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('underline'),
            'text-gray-900': !editor.isActive('underline'),
          })}
        />
      </button>
      <div className="w-px h-4 bg-gray-200 mx-2" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListNumbers
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('orderedList'),
            'text-gray-900': !editor.isActive('orderedList'),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBullets
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('bulletList'),
            'text-gray-900': !editor.isActive('bulletList'),
          })}
        />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quotes
          size={16}
          className={clsx(styles.icon, {
            'text-blue-400': editor.isActive('blockquote'),
            'text-gray-900': !editor.isActive('blockquote'),
          })}
        />
      </button>
    </BubbleMenu>
  );
};

MenuBar.displayName = displayName;

export default MenuBar;
