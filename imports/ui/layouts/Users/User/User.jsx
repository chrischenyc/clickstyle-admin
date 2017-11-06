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

    this.handleApprove = this.handleApprove.bind(this);
  }

  handleApprove() {
    this.setState({ loading: true });

    /*
    Meteor.call(
      'stylist.application.approve',
      { applicationId: this.props.application._id, userId: this.props.application.userId },
      (error) => {
        this.setState({ loading: false });

        if (error) {
          this.setState({ error: error.message });
        }
      },
    );
    */
  }

  render() {
    return (
      <SideMenuContainer>
        <UserPage
          user={this.props.user}
          onApprove={this.handleApprove}
          loading={this.state.loading}
          error={this.state.error}
        />
      </SideMenuContainer>
    );
  }
}

User.defaultProps = {
  user: null,
};

User.propTypes = {
  match: PropTypes.object.isRequired,
  user: PropTypes.object,
};

export default withTracker((props) => {
  Meteor.subscribe('user', props.match.params.id);

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
    user: user && user.profile && user,
  };
})(User);
