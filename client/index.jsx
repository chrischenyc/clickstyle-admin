import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from '../imports/modules/client/redux/store';
import App from '../imports/ui/layouts/App';

Meteor.startup(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('react-root'),
  );
});
