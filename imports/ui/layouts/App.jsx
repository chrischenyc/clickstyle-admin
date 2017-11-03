import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import Profiles from '../../api/profiles/profiles';
import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';
import { fetchProfile } from '../../modules/client/redux/profile';

import SecureRoute from '../components/SecureRoute';
import Header from '../components/Header';
import SideMenuContainer from '../components/SideMenuContainer';

import Login from '../layouts/Login/Login';
import DashboardPage from '../layouts/DashboardPage';
import StylistsApplications from '../layouts/Stylists/StylistsApplications/StylistsApplications';

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

      // get user profile
      const handle = Meteor.subscribe('profiles.owner');
      const fetching = !handle.ready();
      const profile = Profiles.findOne({});
      this.props.fetchProfile(fetching, profile);
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
                  <StylistsApplications />
                </SideMenuContainer>
              )}
            />

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
  fetchProfile: PropTypes.func.isRequired,
};

export default connect(null, {
  userSignedIn,
  userSignedOut,
  fetchProfile,
})(App);
