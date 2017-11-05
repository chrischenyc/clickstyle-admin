import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
import Profiles from '../../../../api/profiles/profiles';
import Services from '../../../../api/services/services';
import SideMenuContainer from '../../../components/SideMenuContainer';
import StylistApplicationPage from './StylistApplicationPage';

class StylistApplication extends Component {
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
  }

  render() {
    return (
      <SideMenuContainer>
        <StylistApplicationPage
          application={this.props.application}
          onApprove={this.handleApprove}
          loading={this.state.loading}
          error={this.state.error}
        />
      </SideMenuContainer>
    );
  }
}

StylistApplication.defaultProps = {
  application: null,
};

StylistApplication.propTypes = {
  match: PropTypes.object.isRequired,
  application: PropTypes.object,
};

export default withTracker((props) => {
  Meteor.subscribe('stylist.application', props.match.params.id);

  const application = StylistApplications.findOne(
    {},
    {
      transform: (doc) => {
        const profile = Profiles.findOne({ owner: doc.userId });
        const services = Services.find({ _id: { $in: doc.services } }).fetch();
        const approvedByUser = Meteor.users.findOne({ _id: doc.approvedBy });

        return {
          ...doc,
          profile,
          services,
          approvedByUser,
        };
      },
    },
  );

  return {
    application,
  };
})(StylistApplication);
