import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';

import SecureRoute from '../components/SecureRoute';
import Header from '../components/Header';

import Login from '../layouts/Login/Login';
import DashboardPage from '../layouts/DashboardPage';
import StylistApplications from '../layouts/Stylists/Applications/StylistApplications';
import StylistApplication from '../layouts/Stylists/Application/StylistApplication';
import Users from '../layouts/Users/Users';
import User from '../layouts/Users/User/User';
import Services from '../layouts/Services/Services';
import Service from '../layouts/Services/Service/Service';
import Suburbs from '../layouts/Suburbs/Suburbs';
import FeaturedStylists from '../layouts/Stylists/Featured/FeaturedStylists';

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
          <div style={{ marginTop: '51px', paddingTop: '64px' }}>
            <Switch>
              <SecureRoute exact path="/" component={DashboardPage} />
              <SecureRoute exact path="/dashboard" component={DashboardPage} />

              <SecureRoute exact path="/users" component={Users} />
              <SecureRoute exact path="/users/:id" component={User} />

              <SecureRoute exact path="/services" component={Services} />
              <SecureRoute exact path="/services/:id" component={Service} />

              <SecureRoute exact path="/stylists/applications" component={StylistApplications} />
              <SecureRoute exact path="/stylists/applications/:id" component={StylistApplication} />

              <SecureRoute exact path="/stylists/featured" component={FeaturedStylists} />

              <SecureRoute exact path="/suburbs" component={Suburbs} />

              <Route exact path="/login" component={Login} />

              <Route component={() => <p>404 not found</p>} />
            </Switch>
          </div>
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
