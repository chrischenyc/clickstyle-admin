import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import EmailVerificationAlertPage from './EmailVerificationAlertPage';

class EmailVerificationAlert extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      success: false,
      loading: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.setState({ loading: true });

    Meteor.call('users.sendVerificationEmail', (error) => {
      if (error) {
        this.setState({ error, loading: false });
      } else {
        this.setState({ success: true, loading: false });
      }
    });
  }

  render() {
    if (this.props.verified === undefined || this.props.verified === true) {
      return '';
    }
    return (
      <EmailVerificationAlertPage
        onSubmit={this.handleSubmit}
        error={this.state.error}
        success={this.state.success}
        loading={this.state.loading}
      />
    );
  }
}

EmailVerificationAlert.defaultProps = {
  verified: undefined,
};

EmailVerificationAlert.propTypes = {
  verified: PropTypes.bool,
};

const mapStateToProps = state => ({
  verified: state.user.verified,
});

export default connect(mapStateToProps)(EmailVerificationAlert);
