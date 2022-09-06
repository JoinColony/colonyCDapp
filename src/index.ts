/*
 * @NOTE This is disabled because eslint gets confused by the module.hot declaration
 * and thinks it actually exports it
 */
/* eslint-disable import/no-import-module-exports */

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';

import Entry from '~root/Entry';

const rootNode = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootNode!);

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry));
}

// @ts-ignore
if (module.hot) module.hot.accept();
