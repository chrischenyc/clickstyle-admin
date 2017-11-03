import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HOC
// As the name implies, routes created using the <AuthRoute /> component are only
// intended to be accessed by logged-in users. To handle the authentication of a user,
// the component takes in two special props 'loggingIn' and 'authenticated' which are
// passed to the component via <App /> component.

const SecureRoute = ({ authenticated, component, ...rest }) => {
  if (authenticated) {
    return <Route component={component} {...rest} />;
  }

  return <Redirect to="/" />;
};

SecureRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps)(SecureRoute);
