import { Editor } from '@tiptap/core';

import { intl } from '~utils/intl';

export enum Icons {
  bold = 'bold',
  bulletList = 'bulletList',
  codeBlock = 'codeBlock',
  droplet = 'droplet',
  heading = 'heading',
  strike = 'strike',
  underline = 'underline',
}

const { formatMessage } = intl({
  'annotation.bold': 'Add bold text',
  'annotation.bulletList': 'Add a bulleted list',
  'annotation.codeBlock': 'Add a code block',
  'annotation.heading': 'Add heading text',
  'annotation.strike': 'Add a strikethrough',
  'annotation.underline': 'Add an underline',
});

const OS = window.navigator.userAgentData?.platform;
const ctrl = OS === 'macOS' ? 'Cmd' : 'Ctrl';

const getToolbarItems = (editor: Editor) => [
  {
    icon: Icons.bold,
    onClick: () => editor.chain().focus().toggleBold().run(),
    keyboardShortcut: `${ctrl}+B`,
    annotation: formatMessage({ id: `annotation.${Icons.bold}` }),
  },
  {
    icon: Icons.bulletList,
    onClick: () => editor.chain().focus().toggleBulletList().run(),
    keyboardShortcut: `${ctrl}+Shift+8`,
    annotation: formatMessage({ id: `annotation.${Icons.bulletList}` }),
  },
  {
    icon: Icons.codeBlock,
    onClick: () => editor.chain().focus().toggleCodeBlock().run(),
    keyboardShortcut: `${ctrl}+Alt+C`,
    annotation: formatMessage({ id: `annotation.${Icons.codeBlock}` }),
  },
  {
    icon: Icons.heading,
    onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    keyboardShortcut: `${ctrl}+Alt+3`,
    annotation: formatMessage({ id: `annotation.${Icons.heading}` }),
  },
  {
    icon: Icons.strike,
    onClick: () => editor.chain().focus().toggleStrike().run(),
    keyboardShortcut: `${ctrl}+Shift+X`,
    annotation: formatMessage({ id: `annotation.${Icons.strike}` }),
  },
  {
    icon: Icons.underline,
    onClick: () => editor.chain().focus().toggleUnderline().run(),
    keyboardShortcut: `${ctrl}+U`,
    annotation: formatMessage({ id: `annotation.${Icons.underline}` }),
  },
];

export default getToolbarItems;
