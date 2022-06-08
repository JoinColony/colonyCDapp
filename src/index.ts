import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import ReactModal from 'react-modal';
import userflow from 'userflow.js';

const rootNode = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(rootNode!);

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  root.render(createElement('div'));
}

// @ts-ignore
if (module.hot) module.hot.accept();

// Initiate Userflow
if (process.env.USERFLOW_TOKEN) {
  userflow.init(process.env.USERFLOW_TOKEN);
}
