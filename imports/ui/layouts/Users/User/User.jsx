import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Profiles from '../../../../api/profiles/profiles';
import Stylists from '../../../../api/stylists/stylists';
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
    this.handlePublishStylist = this.handlePublishStylist.bind(this);
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

  handlePublishStylist(publish) {
    this.setState({ loading: true });

    Meteor.call('stylist.publish', { userId: this.props.user._id, publish }, (error) => {
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
            profile={this.props.profile}
            stylist={this.props.stylist}
            onGrantAdmin={this.handleGrantAdmin}
            onPublishStylist={this.handlePublishStylist}
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
  profile: null,
  stylist: null,
};

User.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  user: PropTypes.object,
  profile: PropTypes.object,
  stylist: PropTypes.object,
};

export default withTracker((props) => {
  const userHandle = Meteor.subscribe('user', props.match.params.id);
  const profileHandle = Meteor.subscribe('profile', props.match.params.id);
  const stylistHandle = Meteor.subscribe('stylist', props.match.params.id);

  return {
    ready: userHandle.ready() && profileHandle.ready() && stylistHandle.ready(),
    user: Meteor.users.findOne({ _id: props.match.params.id }),
    profile: Profiles.findOne({ owner: props.match.params.id }),
    stylist: Stylists.findOne({ owner: props.match.params.id }),
  };
})(User);
