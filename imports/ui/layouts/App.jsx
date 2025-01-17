import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { userSignedIn, userSignedOut } from '../../modules/client/redux/user';

import SecureRoute from '../components/SecureRoute';
import Header from '../components/Header';
import { withSideMenu } from '../components/HOC';

import Login from './Login/Login';
import DashboardPage from './DashboardPage';
import StylistApplications from './Stylists/Applications/StylistApplications';
import StylistApplication from './Stylists/Application/StylistApplication';
import Users from './Users/Users';
import User from './Users/User/User';
import Services from './Services/Services';
import Service from './Services/Service/Service';
import Suburbs from './Suburbs/Suburbs';
import FeaturedStylists from './Stylists/Featured/FeaturedStylists';
import PublishedStylists from './Stylists/Published/PublishedStylists';
import Cron from './System/Cron';

import Bookings from './Bookings/Bookings/Bookings';
import Booking from './Bookings/Booking/Booking';
import Coupons from './Bookings/Coupons/Coupons';
import NewCoupons from './Bookings/Coupons/NewCoupons';

import ServicesAndPrices from './Reports/ServicesAndPrices';
import Geo from './Reports/Geo';

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
              <SecureRoute exact path="/" component={withSideMenu(DashboardPage)} />
              <SecureRoute exact path="/dashboard" component={withSideMenu(DashboardPage)} />

              <SecureRoute exact path="/users" component={withSideMenu(Users)} />
              <SecureRoute exact path="/users/:id" component={withSideMenu(User)} />

              <SecureRoute exact path="/services" component={withSideMenu(Services)} />
              <SecureRoute exact path="/services/:id" component={withSideMenu(Service)} />

              <SecureRoute
                exact
                path="/stylists/applications"
                component={withSideMenu(StylistApplications)}
              />
              <SecureRoute
                exact
                path="/stylists/applications/:id"
                component={withSideMenu(StylistApplication)}
              />

              <SecureRoute
                exact
                path="/stylists/featured"
                component={withSideMenu(FeaturedStylists)}
              />

              <SecureRoute
                exact
                path="/stylists/published"
                component={withSideMenu(PublishedStylists)}
              />

              <SecureRoute exact path="/suburbs" component={withSideMenu(Suburbs)} />

              <SecureRoute exact path="/bookings" component={withSideMenu(Bookings)} />
              <SecureRoute exact path="/bookings/:_id" component={withSideMenu(Booking)} />

              <SecureRoute exact path="/coupons" component={withSideMenu(Coupons)} />
              <SecureRoute exact path="/coupons/new" component={withSideMenu(NewCoupons)} />

              <SecureRoute
                exact
                path="/reports/services-and-prices"
                component={withSideMenu(ServicesAndPrices)}
              />

              <SecureRoute exact path="/reports/geo" component={withSideMenu(Geo)} />

              <SecureRoute exact path="/cron" component={withSideMenu(Cron)} />

              <Route exact path="/login" component={Login} />

              <Route
                component={withSideMenu(() => (
                  <p>404 not found</p>
                ))}
              />
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

export default connect(
  null,
  {
    userSignedIn,
    userSignedOut,
  },
)(App);
