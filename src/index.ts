import { createElement } from 'react';
import { render } from 'react-dom';
import ReactModal from 'react-modal';
import userflow from 'userflow.js';

const rootNode = document.getElementById('root');

if (rootNode) {
  ReactModal.setAppElement(rootNode);
  render(createElement('div'), rootNode);
}

// @ts-ignore
if (module.hot) module.hot.accept();

// Initiate Userflow
if (process.env.USERFLOW_TOKEN) {
  userflow.init(process.env.USERFLOW_TOKEN);
}
