import Decimal from 'decimal.js';
import { Logger } from 'ethers/lib.esm/utils';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';

import store from '~redux/createReduxStore';
import '~utils/yup/customMethods'; // ensures custom yup methods are available when components load

import Entry from './Entry';

import './styles/main.global.css';

Decimal.set({ toExpPos: 78 });

Logger.setLogLevel(Logger.levels.ERROR);

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = createRoot(rootNode);
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));
}
