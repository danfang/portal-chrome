import 'material-design-lite/material.min.js';
import './sass/main.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import Root from './components/Root.jsx';
import configureStore from './configureStore';

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
