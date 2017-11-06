import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HOC
// As the name implies, routes created using the <AuthRoute /> component are only
// intended to be accessed by logged-in users. To handle the authentication of a user,
// the component takes in two special props 'loggingIn' and 'authenticated' which are
// passed to the component via <App /> component.

const SecureRoute = ({
  authenticated, userId, component, ...rest
}) => {
  if (authenticated) {
    if (
      userId &&
      Roles.userIsInRole(userId, [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      return <Route component={component} {...rest} />;
    }

    return '';
  }

  return <Redirect to="/login" />;
};

SecureRoute.defaultProps = {
  userId: null,
};

SecureRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  userId: state.user.id,
});
export default connect(mapStateToProps)(SecureRoute);
