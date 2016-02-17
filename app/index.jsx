import 'material-design-lite/material.min.js';
import './sass/main.scss';

import { Provider } from 'react-redux';
import { render } from 'react-dom';
import React from 'react';

import configureStore from './reducers';

import Root from './components/Root.jsx';

chrome.storage.local.get(['store'], (result) => {
  const retrievedStore = result.store;
  const store = retrievedStore ? configureStore(retrievedStore) : configureStore();
  render(
    <Provider store={store}><Root /></Provider>,
    document.getElementById('root')
  );
  setInterval(() => {
    chrome.storage.local.set({ store: store.getState() });
  }, 10000);
});
