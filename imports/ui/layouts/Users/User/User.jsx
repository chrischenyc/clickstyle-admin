import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Profiles from '../../../../api/profiles/profiles';
import SideMenuContainer from '../../../components/SideMenuContainer';
import UserPage from './UserPage';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: '',
    };

    this.handleGrantAdmin = this.handleGrantAdmin.bind(this);
  }

  handleGrantAdmin(grant) {
    this.setState({ loading: true });

    Meteor.call('users.grant.admin', { userId: this.props.user._id, grant }, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      }
    });
  }

  render() {
    return (
      <SideMenuContainer>
        {this.props.ready ? (
          <UserPage
            user={this.props.user}
            onGrantAdmin={this.handleGrantAdmin}
            loading={this.state.loading}
            error={this.state.error}
          />
        ) : (
          <p>loading...</p>
        )}
      </SideMenuContainer>
    );
  }
}

User.defaultProps = {
  ready: false,
  user: null,
};

User.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  user: PropTypes.object,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('user', props.match.params.id);

  const user = Meteor.users.findOne(
    { _id: props.match.params.id },
    {
      transform: (doc) => {
        const profile = Profiles.findOne({ owner: doc._id });

        return {
          ...doc,
          profile,
        };
      },
    },
  );

  return {
    ready: handle.ready(),
    user,
  };
})(User);
