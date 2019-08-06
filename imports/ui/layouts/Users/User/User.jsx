import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import UserPage from './UserPage';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
      user: null,
    };

    this.handleGrantAdmin = this.handleGrantAdmin.bind(this);
    this.handlePublishStylist = this.handlePublishStylist.bind(this);
    this.handleVerifyDocument = this.handleVerifyDocument.bind(this);
  }

  componentDidMount() {
    this.loadUser();
  }

  loadUser() {
    Meteor.call('user.find', this.props.match.params.id, (error, user) => {
      if (error) {
        console.log('error', error);
      }

      if (user) {
        this.setState({ user });
      }
    });
  }

  handleGrantAdmin(grant) {
    this.setState({ loading: true });

    Meteor.call('users.grant.admin', { userId: this.state.user._id, grant }, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      }

      this.loadUser();
    });
  }

  handlePublishStylist(publish) {
    this.setState({ loading: true });

    Meteor.call('stylist.publish', { userId: this.state.user._id, publish }, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      }

      this.loadUser();
    });
  }

  handleVerifyDocument(document, verified) {
    this.setState({ loading: true });

    Meteor.call(
      'stylist.verify.document',
      { userId: this.state.user._id, document, verified },
      (error) => {
        this.setState({ loading: false });

        if (error) {
          this.setState({ error: error.message });
        }

        this.loadUser();
      },
    );
  }

  render() {
    const { user, loading, error } = this.state;

    return user ? (
      <UserPage
        user={user}
        profile={user.profile}
        stylist={user.stylist}
        onGrantAdmin={this.handleGrantAdmin}
        onPublishStylist={this.handlePublishStylist}
        onVerifyDocument={this.handleVerifyDocument}
        loading={loading}
        error={error}
      />
    ) : (
      <p>loading...</p>
    );
  }
}

export default User;
