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
} from '@phosphor-icons/react';
import { BubbleMenu } from '@tiptap/react';
import clsx from 'clsx';
import React, { type FC } from 'react';

import { tw } from '~utils/css/index.ts';

import { type MenuBarProps } from '../types.ts';

const displayName = 'v5.RichText.partials.MenuBar';

const MenuBar: FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const iconClass = tw`hover:text-blue-400`;

  return (
    <BubbleMenu
      className="flex items-center gap-2 rounded-lg border border-gray-200 bg-base-white p-2"
      tippyOptions={{ duration: 100 }}
      editor={editor}
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <TextHOne
          size={16}
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
            'text-blue-400': editor.isActive('underline'),
            'text-gray-900': !editor.isActive('underline'),
          })}
        />
      </button>
      <div className="mx-2 h-4 w-px bg-gray-200" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListNumbers
          size={16}
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
          className={clsx(iconClass, {
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
