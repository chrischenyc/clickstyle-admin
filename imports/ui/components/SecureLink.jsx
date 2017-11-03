import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import Login from '../layouts/user/Login/Login';
import { openModal } from '../../modules/client/redux/modal';

const SecureLink = props => (
  <Link
    {..._.omit(props, ['onLoggedIn', 'authenticated', 'dispatch', 'openModal'])}
    onClick={(e) => {
      if (!props.authenticated) {
        e.preventDefault();
        props.openModal(
          props.to,
          <Login modal onLoggedIn={props.onLoggedIn} />,
          'Log in to continue',
        );
      }
    }}
  />
);

SecureLink.defaultProps = {
  onLoggedIn: null,
};

SecureLink.propTypes = {
  to: PropTypes.string.isRequired,
  onLoggedIn: PropTypes.func,
  authenticated: PropTypes.bool.isRequired,
  openModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated,
});
export default connect(mapStateToProps, { openModal })(SecureLink);
