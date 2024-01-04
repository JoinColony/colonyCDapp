import Decimal from 'decimal.js';
import { Logger } from 'ethers/lib.esm/utils';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';

import '~utils/yup/customMethods'; // @NOTE: This is placed here to ensure custom yup methods are available when components load

import './styles/main.global.css'; // @NOTE: This is placed here to ensure it is loaded before any other styles specific to the components (like CSS modules)

/* eslint-disable import/order */
import store from '~redux/createReduxStore';

import Entry from './Entry';
/* eslint-enable import/order */

Decimal.set({ toExpPos: 78 });

Logger.setLogLevel(Logger.levels.ERROR);

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = createRoot(rootNode);
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));
}
