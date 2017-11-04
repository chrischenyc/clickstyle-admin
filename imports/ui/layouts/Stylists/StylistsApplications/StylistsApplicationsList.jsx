import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Menu, Icon } from 'semantic-ui-react';

import { formatDateTime } from '../../../../modules/format-date';
import StylistApplications from '../../../../api/stylist_applications/stylist_applications';
import Profiles from '../../../../api/profiles/profiles';
import Services from '../../../../api/services/services';

const StylistsApplicationsList = props => (
  <Table celled selectable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Mobile</Table.HeaderCell>
        <Table.HeaderCell>Email</Table.HeaderCell>
        <Table.HeaderCell>Services</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {props.applications.map(application => (
        <Table.Row
          key={application._id}
          onClick={() => {
            console.log(application);
          }}
        >
          <Table.Cell>{formatDateTime(application.createdAt)}</Table.Cell>
          <Table.Cell>{application.name}</Table.Cell>
          <Table.Cell>{application.mobile}</Table.Cell>
          <Table.Cell>{application.email}</Table.Cell>
          <Table.Cell>{application.services.join(', ')}</Table.Cell>
          <Table.Cell>{application.approved ? 'approved' : 'pending'}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>

    <Table.Footer>
      <Table.Row>
        <Table.HeaderCell colSpan="6">
          <Menu floated="right" pagination>
            <Menu.Item as="a" icon>
              <Icon name="left chevron" />
            </Menu.Item>
            <Menu.Item as="a">1</Menu.Item>
            <Menu.Item as="a" icon>
              <Icon name="right chevron" />
            </Menu.Item>
          </Menu>
        </Table.HeaderCell>
      </Table.Row>
    </Table.Footer>
  </Table>
);

StylistsApplicationsList.defaultProps = {
  applications: [],
};

StylistsApplicationsList.propTypes = {
  applications: PropTypes.array,
  filter: PropTypes.string.isRequired,
};

export default withTracker((props) => {
  Meteor.subscribe('stylists.applications', props.filter);

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
})(StylistsApplicationsList);
