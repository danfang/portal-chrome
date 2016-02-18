import TestUtils from 'react-addons-test-utils';
import React from 'react';

import { Root } from '../../app/components/Root';
import Login from '../../app/components/Login';
import App from '../../app/components/App';

function getOutput(loggedIn) {
  const renderer = TestUtils.createRenderer();
  const props = { loggedIn };
  renderer.render(<Root {...props} />);
  return renderer.getRenderOutput();
}

describe('root component', () => {
  it('should render the Login screen if not logged in', () => {
    const output = getOutput(false);
    output.type.should.equal(Login);
  });

  it('should render the App screen if logged in', () => {
    const output = getOutput(true);
    output.type.should.equal(App);
  });
});
