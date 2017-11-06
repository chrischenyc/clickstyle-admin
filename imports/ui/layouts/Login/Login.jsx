import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { userSignedIn } from '../../../modules/client/redux/user';
import { validateUserLogin } from '../../../modules/validate';
import LoginPage from './LoginPage';

// platform-independent stateful container component
// to handle Login logic
class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      errors: {},
      loading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.setState({ errors: {} });
    event.preventDefault();

    const errors = validateUserLogin(this.state.email, this.state.password);

    if (!_.isEmpty(errors)) {
      this.setState({ errors });
    } else {
      this.setState({ loading: true });

      // http://docs.meteor.com/api/accounts.html#Meteor-loginWithPassword
      Meteor.loginWithPassword(this.state.email, this.state.password, (error) => {
        if (error) {
          this.setState({
            loading: false,
            errors: {
              message: error.error === 403 ? 'email and password do not match' : error.reason,
            },
          });
        } else {
          this.setState({
            loading: false,
            errors: {},
          });

          if (
            Roles.userIsInRole(Meteor.userId(), [
              Meteor.settings.public.roles.admin,
              Meteor.settings.public.roles.superAdmin,
            ])
          ) {
            this.props.userSignedIn(Meteor.user());
            this.props.history.push('/dashboard');
          } else {
            Meteor.logout();
          }
        }
      });
    }
  }

  render() {
    return (
      <LoginPage
        onSubmit={this.handleSubmit}
        onChange={this.handleChange}
        loading={this.state.loading}
        errors={this.state.errors}
      />
    );
  }
}

Login.propTypes = {
  userSignedIn: PropTypes.func.isRequired,
};

export default connect(null, { userSignedIn })(Login);
