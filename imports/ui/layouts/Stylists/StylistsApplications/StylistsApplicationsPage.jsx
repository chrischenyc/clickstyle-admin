import React from 'react';
import { Container, Header, Button, Table, Menu, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import { formatDateTime } from '../../../../modules/format-date';

const StylistsApplicationsPage = props => (
  <Container>
    <Header as="h2">Stylists Applications</Header>

    <Button.Group>
      <Button
        active={props.filter === 'pending'}
        onClick={() => {
          props.onFilter('pending');
        }}
      >
        Pending
      </Button>
      <Button
        active={props.filter === 'approved'}
        onClick={() => {
          props.onFilter('approved');
        }}
      >
        Approved
      </Button>
      <Button
        active={props.filter === 'all'}
        onClick={() => {
          props.onFilter('all');
        }}
      >
        Review
      </Button>
    </Button.Group>

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
  </Container>
);

StylistsApplicationsPage.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
  applications: PropTypes.array.isRequired,
};

export default StylistsApplicationsPage;
