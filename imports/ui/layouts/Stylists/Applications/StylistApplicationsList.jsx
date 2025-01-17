import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { dateTimeString } from '../../../../modules/format-date';
import StylistApplications from '../../../../api/stylist_applications/stylist_applications';

class StylistApplicationsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.applications, this.props.applications)) {
      this.props.onDataLoaded(nextProps.applications.length >= this.props.limit);
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
            <Table.HeaderCell>Mobile</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Manage</Table.HeaderCell>
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
                <Table.Cell>{dateTimeString(application.createdAt)}</Table.Cell>
                <Table.Cell>
                  <Link to={`/users/${application.userId}`}>{application.name}</Link>
                </Table.Cell>
                <Table.Cell>{application.mobile}</Table.Cell>
                <Table.Cell>{application.email}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() => {
                      this.props.onResendApprovalEmail(application.userId);
                    }}
                  >
                    resend approved email
                  </Button>
                </Table.Cell>
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
  onResendApprovalEmail: PropTypes.func.isRequired,
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
