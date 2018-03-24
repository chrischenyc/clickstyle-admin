import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
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
    return this.props.ready ? (
      <StylistApplicationPage
        application={this.props.application}
        onApprove={this.handleApprove}
        loading={this.state.loading}
        error={this.state.error}
      />
    ) : (
      <p>loading...</p>
    );
  }
}

StylistApplication.defaultProps = {
  ready: false,
  application: null,
};

StylistApplication.propTypes = {
  match: PropTypes.object.isRequired,
  ready: PropTypes.bool,
  application: PropTypes.object,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('stylist.application', props.match.params.id);

  return {
    ready: handle.ready(),
    application: StylistApplications.findOne({ _id: props.match.params.id }),
  };
})(StylistApplication);
