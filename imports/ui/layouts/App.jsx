import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';

import SecureRoute from '../components/SecureRoute';
import Header from '../components/Header';

import Login from '../layouts/Login/Login';
import DashboardPage from '../layouts/DashboardPage';
import StylistApplications from '../layouts/Stylists/Applications/StylistApplications';
import StylistApplication from '../layouts/Stylists/Application/StylistApplication';
import Users from '../layouts/Users/Users';
import User from '../layouts/Users/User/User';

class App extends Component {
  // after web App is refreshed, try to fetch Meteor user data then update redux states
  componentDidMount() {
    Tracker.autorun(() => {
      // get Meteor user login info when page refreshes
      if (!Meteor.loggingIn()) {
        const user = Meteor.user();
        if (user) {
          this.props.userSignedIn(user);
        } else {
          this.props.userSignedOut();
        }
      }
    });
  }

  render() {
    return (
      <Router>
        <div>
          <Header />

          {this.props.loggingIn ? (
            ''
          ) : (
            <Switch>
              <SecureRoute exact path="/" component={DashboardPage} />
              <SecureRoute exact path="/dashboard" component={DashboardPage} />

              <SecureRoute exact path="/users" component={Users} />
              <SecureRoute exact path="/users/:id" component={User} />

              <SecureRoute exact path="/stylists/applications" component={StylistApplications} />
              <SecureRoute exact path="/stylists/applications/:id" component={StylistApplication} />

              <Route exact path="/login" component={Login} />

              <Route component={() => <p className="below-fixed-menu">404 not found</p>} />
            </Switch>
          )}
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
  userSignedOut: PropTypes.func.isRequired,
  loggingIn: PropTypes.bool.isRequired,
};

export default compose(
  connect(null, {
    userSignedIn,
    userSignedOut,
  }),
  withTracker(() => ({
    loggingIn: Meteor.loggingIn(),
  })),
)(App);
