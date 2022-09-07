/*
 * @NOTE This is disabled because eslint gets confused by the module.hot declaration
 * and thinks it actually exports it
 */
/* eslint-disable import/no-import-module-exports */

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import { Logger } from 'ethers/lib.esm/utils';

import './styles/main.css';

import Entry from './Entry';
import store from '~redux/createReduxStore';

Logger.setLogLevel(Logger.levels.ERROR);

const rootNode = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootNode!);

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));
}

// @ts-ignore
if (module.hot) module.hot.accept();
