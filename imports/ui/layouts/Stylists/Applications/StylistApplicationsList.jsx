import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../../../modules/format-date';
import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
import Profiles from '../../../../api/profiles/profiles';
import Services from '../../../../api/services/services';

class StylistApplicationsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.applications.length !== this.props.applications.length) {
      this.props.onDataLoaded(nextProps.applications.length === this.props.limit);
    }
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell>User</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Mobile</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.ready &&
            this.props.applications.map(application => (
              <Table.Row key={application._id}>
                <Table.Cell>
                  <Link to={`/stylists/applications/${application._id}`}>
                    {application.approved ? 'approved' : 'pending'}
                  </Link>
                </Table.Cell>
                <Table.Cell>{formatDateTime(application.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Link to={`/users/${application.userId}`}>{application.userId}</Link>
                </Table.Cell>
                <Table.Cell>{application.name}</Table.Cell>
                <Table.Cell>{application.mobile}</Table.Cell>
                <Table.Cell>{application.email}</Table.Cell>
              </Table.Row>
              ))}
        </Table.Body>
      </Table>
    );
  }
}

StylistApplicationsList.defaultProps = {
  ready: false,
  applications: [],
};

StylistApplicationsList.propTypes = {
  ready: PropTypes.bool,
  applications: PropTypes.array,
  filter: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('stylist.applications', props.filter, props.page, props.limit);

  return {
    ready: handle.ready(),
    applications: StylistApplications.find(
      {},
      {
        sort: { createdAt: -1 },
      },
    ).fetch(),
  };
})(StylistApplicationsList);
