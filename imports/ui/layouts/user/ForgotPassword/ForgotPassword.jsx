import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import _ from 'lodash';

import { validateEmail } from '../../../../modules/validate';
import ForgotPasswordPage from './ForgotPasswordPage';

// platform-independent stateful container component
// to handle Login logic
class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      errors: {},
      loading: false,
      success: false,
      redirect: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({
      errors: {},
      loading: false,
      success: false,
      redirect: false,
    });
    event.preventDefault();

    const errors = validateEmail(this.state.email);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      Accounts.forgotPassword({ email: this.state.email }, (error) => {
        if (error) {
          this.setState({
            loading: false,
            errors: {
              message: error.reason,
            },
          });
        } else {
          this.setState({
            loading: false,
            errors: {},
            success: true,
          });

          setTimeout(() => {
            this.setState({ redirect: true });
          }, 1500);
        }
      });
    }
  }

  render() {
    return (
      <ForgotPasswordPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
        success={this.state.success}
        redirect={this.state.redirect}
      />
    );
  }
}

export default ForgotPassword;
