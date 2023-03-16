import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import { Logger } from 'ethers/lib.esm/utils';
import Decimal from 'decimal.js';

import './styles/main.css';

import Entry from './Entry';
import store from '~redux/createReduxStore';

Decimal.set({ toExpPos: 78 }); // copied from dapp, originally in staking widget.

Logger.setLogLevel(Logger.levels.ERROR);

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = createRoot(rootNode);
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));
}
