import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../../modules/format-date';

class UsersList extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length !== this.props.users.length) {
      this.props.onDataLoaded(nextProps.users.length === this.props.limit);
    }
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Create Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.ready &&
            this.props.users.map(user => (
              <Table.Row key={user._id}>
                <Table.Cell>
                  <Link to={`/users/${user._id}`}>{user._id}</Link>
                </Table.Cell>

                <Table.Cell>{`${user.profile.name.first} ${user.profile.name.last}`}</Table.Cell>

                <Table.Cell>
                  {user.emails.map(email => (
                    <div key={email.address}>
                      {email.address} ({email.verified ? 'verified' : 'unverified'})
                    </div>
                  ))}
                </Table.Cell>

                <Table.Cell>{formatDateTime(user.createdAt)}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

UsersList.defaultProps = {
  ready: false,
  users: [],
};

UsersList.propTypes = {
  ready: PropTypes.bool,
  users: PropTypes.array,
  filter: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('users', props.filter, props.page, props.limit);

  const selector = {
    roles: {
      $in: [
        Meteor.settings.public.roles.customer,
        Meteor.settings.public.roles.stylist,
        Meteor.settings.public.roles.admin,
      ],
    },
  };
  if (props.filter === 'customer') {
    selector.roles = Meteor.settings.public.roles.customer;
  } else if (props.filter === 'stylist') {
    selector.roles = Meteor.settings.public.roles.stylist;
  } else if (props.filter === 'admin') {
    selector.roles = Meteor.settings.public.roles.admin;
  }

  const users = Meteor.users
    .find(selector, {
      sort: { createdAt: 1 },
    })
    .fetch();

  return {
    ready: handle.ready(),
    users,
  };
})(UsersList);
