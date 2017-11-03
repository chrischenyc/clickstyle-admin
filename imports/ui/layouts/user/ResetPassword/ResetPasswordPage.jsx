import { Meteor } from 'meteor/meteor';
import React from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Form, Grid, Message, Header, Icon } from 'semantic-ui-react';
import { Redirect, Link } from 'react-router-dom';
import _ from 'lodash';

import FormInputField from '../../../components/FormInputField';

const ResetPasswordPage = ({
  onSubmit, onChange, loading, errors, success, redirect,
}) => {
  if (redirect) {
    return <Redirect to="/dashboard" />;
  } else if (success) {
    return (
      <Container text className="below-fixed-menu" style={{ padding: '4rem 0' }}>
        <Grid textAlign="left" verticalAlign="middle">
          <Message icon success>
            <Icon name="checkmark" />

            <Message.Content>All set, thanks!</Message.Content>
          </Message>
        </Grid>
      </Container>
    );
  }

  return (
    <Container text className="below-fixed-menu" style={{ padding: '4rem 0' }}>
      <Grid textAlign="left" verticalAlign="middle">
        <Grid.Row style={{ maxWidth: 450 }}>
          <Grid.Column>
            <Header as="h1">Reset Password</Header>

            <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
              <FormInputField
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="New password"
                type="password"
                name="password"
                size="huge"
                onChange={onChange}
                errors={errors}
              />

              <FormInputField
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Confirm password"
                type="password"
                name="confirm"
                size="huge"
                onChange={onChange}
                errors={errors}
              />

              {!_.isEmpty(errors.message) && <Message error content={errors.message} />}

              <Button color={Meteor.settings.public.semantic.color} size="huge" type="submit">
                Save and continue
              </Button>

              <p>
                By clicking "Save and continue", you confirm that you are 18 or older, and agree to
                our&nbsp;
                <Link to="/terms">Terms of Use</Link>,&nbsp;
                <Link to="/privacy">Privacy</Link> and to receiving marketing and policy
                communications (you may opt out of receiving these at any time).
              </p>
            </Form>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

ResetPasswordPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  success: PropTypes.bool.isRequired,
  redirect: PropTypes.bool.isRequired,
};

export default ResetPasswordPage;
