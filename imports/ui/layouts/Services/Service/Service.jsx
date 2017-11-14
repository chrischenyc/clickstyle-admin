import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Profiles from '../../../../api/profiles/profiles';
import SideMenuContainer from '../../../components/SideMenuContainer';
import ServicePage from './ServicePage';

class Service extends Component {
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
          <ServicePage
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

Service.defaultProps = {
  ready: false,
  user: null,
};

Service.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  user: PropTypes.object,
};

export default withTracker((props) => {
  const userHandle = Meteor.subscribe('user', props.match.params.id);
  const profileHandle = Meteor.subscribe('profile', props.match.params.id);

  return {
    ready: userHandle.ready() && profileHandle.ready(),
    user: Meteor.users.findOne(
      { _id: props.match.params.id },
      {
        transform: (user) => {
          const profile = Profiles.findOne({ owner: props.match.params.id });

          return {
            ...user,
            profile,
          };
        },
      },
    ),
  };
})(Service);
