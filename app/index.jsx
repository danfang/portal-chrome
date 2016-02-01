import './sass/main.scss';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Root from './components/Root.jsx';
import configureStore from './configureStore'

chrome.storage.local.get(['store'], (result) => {
  let retrievedStore = result.store
  let store = retrievedStore ? configureStore(retrievedStore) : configureStore()
  console.log(store.getState())
  render(
    <Provider store={store}>
      <Root />
    </Provider>,
    document.getElementById('root')
  );
  setInterval(() => {
    chrome.storage.local.set({ store: store.getState() })
  }, 10000)
})
