import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Form, Grid, Message, Segment, Divider, Checkbox } from 'semantic-ui-react';
import _ from 'lodash';

import ModalLink from '../../../components/ModalLink';
import FormInputField from '../../../components/FormInputField';
import SocialLoginButtons from '../../../components/SocialLoginButtons';
import Login from '../Login/Login';

// web version of the sign up form, stateless component
const SignUpPage = ({
  onSubmit,
  onChange,
  onAgreement,
  disabled,
  loading,
  errors,
  modal,
  onLoggedIn,
}) => (
  <Grid textAlign="center" className="below-fixed-menu" verticalAlign="middle">
    <Grid.Row style={{ maxWidth: 450 }}>
      <Grid.Column>
        <Segment attached>
          <SocialLoginButtons isSignUp disabled={disabled} onLoggedIn={onLoggedIn} />

          <Divider horizontal>or</Divider>

          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
            <FormInputField
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email address"
              type="email"
              name="email"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="user"
              iconPosition="left"
              placeholder="First name"
              name="firstName"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Last name"
              name="lastName"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Create a Password"
              type="password"
              name="password"
              size="huge"
              onChange={onChange}
              errors={errors}
            />

            <Button
              color={Meteor.settings.public.semantic.color}
              fluid
              size="huge"
              type="submit"
              disabled={disabled}
            >
              Sign up
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>
        </Segment>

        <Message attached="bottom" size="large">
          {`Already have a ${Meteor.settings.public.applicationName} account? `}

          {modal ? (
            <ModalLink
              to="/login"
              component={<Login modal onLoggedIn={onLoggedIn} />}
              title="Log in to continue"
            >
              Log in
            </ModalLink>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </Message>
        <Checkbox
          defaultChecked
          onChange={onAgreement}
          label={
            <label htmlFor="agreement">
              Check here to confirm that you are 18 or older, and agree to our&nbsp;
              <Link to="/terms">Terms of Use</Link>,&nbsp;
              <Link to="/privacy">Privacy</Link> and to receiving marketing and policy
              communications (you may opt out of receiving these at any time).
            </label>
          }
        />
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

SignUpPage.defaultProps = {
  onLoggedIn: null,
};

SignUpPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onAgreement: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  modal: PropTypes.bool.isRequired,
  onLoggedIn: PropTypes.func,
};

export default SignUpPage;
