import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';

import SecureRoute from '../components/SecureRoute';
import Header from '../components/Header';
import SideMenuContainer from '../components/SideMenuContainer';

import Login from '../layouts/Login/Login';
import DashboardPage from '../layouts/DashboardPage';
import StylistApplications from '../layouts/Stylists/Applications/StylistApplications';
import StylistApplication from '../layouts/Stylists/Application/StylistApplication';

class App extends Component {
  // after web App is refreshed, try to fetch Meteor user data then update redux states
  componentDidMount() {
    Tracker.autorun(() => {
      // get user login
      const user = Meteor.user();
      if (user !== undefined) {
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

          <Switch>
            <SecureRoute
              exact
              path="/"
              component={() => (
                <SideMenuContainer>
                  <DashboardPage />
                </SideMenuContainer>
              )}
            />

            <SecureRoute
              exact
              path="/stylists/applications"
              component={() => (
                <SideMenuContainer>
                  <StylistApplications />
                </SideMenuContainer>
              )}
            />

            <SecureRoute exact path="/stylists/applications/:id" component={StylistApplication} />

            <Route exact path="/login" component={Login} />

            <Route component={() => <p className="below-fixed-menu">404 not found</p>} />
          </Switch>
        </div>
      </Router>
    );
  }
}

App.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
  userSignedOut: PropTypes.func.isRequired,
};

export default connect(null, {
  userSignedIn,
  userSignedOut,
})(App);
