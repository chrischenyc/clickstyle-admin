import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StylistApplications from '../../../../api/stylist_applications/stylist_applications.js';
import StylistsApplicationsPage from './StylistsApplicationsPage';

class StylistsApplications extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filter: 'pending',
    };

    this.handleFilter = this.handleFilter.bind(this);
  }

  handleFilter(filter) {
    this.setState({ filter });
  }

  render() {
    return (
      <StylistsApplicationsPage
        filter={this.state.filter}
        onFilter={this.handleFilter}
        applications={this.props.applications}
      />
    );
  }
}

StylistsApplications.defaultProps = {
  applications: [],
};

StylistApplications.propTypes = {
  loading: PropTypes.bool.isRequired,
  applications: PropTypes.array,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('stylists.applications');

  return {
    loading: !handle.ready(),
    applications: StylistApplications.find({}).fetch(),
  };
})(StylistsApplications);
