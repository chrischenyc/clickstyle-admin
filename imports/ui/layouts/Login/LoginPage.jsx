import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, Grid, Message, Segment } from 'semantic-ui-react';
import _ from 'lodash';

import { FormInputField } from '../../components/FormInputField';

// web version of the login form, stateless component
const LoginPage = ({
  onSubmit, onChange, loading, errors,
}) => (
  <Grid textAlign="center" verticalAlign="middle">
    <Grid.Row style={{ maxWidth: 450 }}>
      <Grid.Column>
        <Segment attached>
          <Form onSubmit={onSubmit} loading={loading} error={!_.isEmpty(errors)}>
            <FormInputField
              fluid
              icon="mail"
              iconPosition="left"
              placeholder="Email address"
              type="email"
              name="email"
              onChange={onChange}
              errors={errors}
            />

            <FormInputField
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Password"
              type="password"
              name="password"
              onChange={onChange}
              errors={errors}
            />

            <Button primary fluid type="submit">
              Login
            </Button>

            {!_.isEmpty(errors.message) && <Message error content={errors.message} />}
          </Form>
        </Segment>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

LoginPage.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
};

export default LoginPage;
