import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
import Profiles from '../../../../api/profiles/profiles';
import Services from '../../../../api/services/services';
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
  applications: PropTypes.array,
};

export default withTracker(() => {
  Meteor.subscribe('stylists.applications');

  return {
    applications: StylistApplications.find(
      {},
      {
        transform: (application) => {
          const profile = Profiles.findOne({ owner: application.userId });
          const services = Services.find({ _id: { $in: application.services } });

          return {
            ...application,
            email: profile.email,
            name: `${profile.name.first} ${profile.name.last}`,
            services: services.map(service => service.name),
          };
        },
      },
    ).fetch(),
  };
})(StylistsApplications);
