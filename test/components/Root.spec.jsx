import TestUtils from 'react-addons-test-utils';
import { Provider } from 'react-redux';
import React from 'react';

import { Root } from '../../app/components/Root';
import Login from '../../app/components/Login';
import App from '../../app/components/App';

function getOutput(component) {
  const renderer = TestUtils.createRenderer();
  renderer.render(component);
  return renderer.getRenderOutput();
}

describe('root component', () => {
  it('should render Login if not logged in', () => {
    const props = { loggedIn: false };
    const output = getOutput(<Root {...props} />);
    output.type.should.equal(Login);
  });

  it('should render App if logged in', () => {
    const props = { loggedIn: true };
    const output = getOutput(<Root {...props} />);
    output.type.should.equal(App);
  });
});
