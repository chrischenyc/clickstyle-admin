import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Icon } from 'semantic-ui-react';

import { userSignedIn } from '../../modules/client/redux/user';

const SocialLoginButtons = props => (
  <div>
    <Button
      fluid
      color="facebook"
      size="huge"
      disabled={props.disabled}
      style={{ marginBottom: '1rem' }}
      onClick={() => {
        Meteor.loginWithFacebook(
          {
            requestPermissions: ['email'],
            loginStyle: 'popup',
          },
          (error) => {
            if (!error) {
              props.userSignedIn(Meteor.user());
              if (props.onLoggedIn) {
                props.onLoggedIn();
              }
            } else {
              /* eslint-disable no-console */
              console.error(`Facebook sign in error: ${error}`);
              /* eslint-enable no-console */
            }
          },
        );
      }}
    >
      <Icon name="facebook f" />
      {props.isSignUp ? 'Sign up with Facebook' : 'Log in with Facebook'}
    </Button>

    <Button
      fluid
      color="grey"
      basic
      size="huge"
      disabled={props.disabled}
      style={{ marginBottom: '0.5rem' }}
      onClick={() => {
        Meteor.loginWithGoogle(
          {
            requestPermissions: ['email', 'profile'],
            requestOfflineToken: true,
            loginStyle: 'popup',
          },
          (error) => {
            if (!error) {
              props.userSignedIn(Meteor.user());
              if (props.onLoggedIn) {
                props.onLoggedIn();
              }
            } else {
              /* eslint-disable no-console */
              console.error(`Google sign in error: ${error}`);
              /* eslint-enable no-console */
            }
          },
        );
      }}
    >
      <Icon name="google" color="red" />
      {props.isSignUp ? 'Sign up with Google' : 'Log in with Google'}
    </Button>
  </div>
);

SocialLoginButtons.defaultProps = {
  isSignUp: false,
  disabled: false,
  onLoggedIn: null,
};

SocialLoginButtons.propTypes = {
  isSignUp: PropTypes.bool,
  disabled: PropTypes.bool,
  onLoggedIn: PropTypes.func,
  userSignedIn: PropTypes.func.isRequired,
};

export default connect(null, { userSignedIn })(SocialLoginButtons);
