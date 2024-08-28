import Decimal from 'decimal.js';
import { utils } from 'ethers';
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';

/* eslint-disable import/order */
import '~utils/yup/customMethods.ts'; // @NOTE: This is placed here to ensure custom yup methods are available when components load
import store from '~redux/createReduxStore.ts';
import { initialiseChart } from '~utils/charts/initialiseChart.ts';
/* eslint-enable import/order */

import Entry from './Entry.tsx';

const { Logger } = utils;

Decimal.set({ toExpPos: 78 });

Logger.setLogLevel(Logger.levels.ERROR);

initialiseChart();

const rootNode = document.getElementById('root');

if (rootNode) {
  const root = createRoot(rootNode);
  ReactModal.setAppElement(rootNode);
  root.render(createElement(Entry, { store }));
}
