import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// HOC
// The <PublicRoute /> component is designed as a wrapper component around pages
// that are intended for the public only. By wrapping a component in the <Public >
// component, the intent is to redirect an authenticated user away from this page
// (e.g., a logged in user has no purpose accessing the /login page).
// It follows the exact same pattern as the <AuthRoute /> component, however, running
// its authentication check in reverse.

const PublicRoute = ({ authenticated, component, ...rest }) => {
  if (authenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <Route component={component} {...rest} />;
};

PublicRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps)(PublicRoute);
