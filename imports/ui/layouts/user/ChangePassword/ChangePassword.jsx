import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { Component } from 'react';
import _ from 'lodash';

import { validateChangePassword } from '../../../../modules/validate';
import ChangePasswordPage from './ChangePasswordPage';

// platform-independent stateful container component
// to handle Login logic
class ChangePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      oldPassword: '',
      password: '',
      confirm: '',
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

    const errors = validateChangePassword(
      this.state.oldPassword,
      this.state.password,
      this.state.confirm,
    );

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      Accounts.changePassword(this.state.oldPassword, this.state.password, (error) => {
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

          Meteor.call('users.sendPasswordChangedEmail');

          setTimeout(() => {
            this.setState({ redirect: true });
          }, 1500);
        }
      });
    }
  }

  render() {
    return (
      <ChangePasswordPage
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

export default ChangePassword;
