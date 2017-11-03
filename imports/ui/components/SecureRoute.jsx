import { Meteor } from 'meteor/meteor';
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
  authenticated, roles, component, ...rest
}) => {
  if (authenticated) {
    if (roles && roles.indexOf(Meteor.settings.public.roles.admin) >= 0) {
      return <Route component={component} {...rest} />;
    }

    return '';
  }

  return <Redirect to="/login" />;
};

SecureRoute.defaultProps = {
  roles: null,
};

SecureRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  roles: PropTypes.array,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
  roles: state.user.roles,
});
export default connect(mapStateToProps)(SecureRoute);
