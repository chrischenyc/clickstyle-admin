import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { formatDateTime } from '../../../modules/format-date';
import Profiles from '../../../api/profiles/profiles';

class UsersList extends Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.users.length !== this.props.users.length) {
      this.props.onDataLoaded(nextProps.users.length === this.props.limit);
    }
    console.log(nextProps.users);
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Mobile</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Create Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.users.map(user => (
            <Table.Row key={user._id}>
              <Table.Cell>
                <Link to={`/users/${user._id}`}>{user.name}</Link>
              </Table.Cell>
              <Table.Cell>{user.mobile}</Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{formatDateTime(user.createdAt)}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );
  }
}

UsersList.defaultProps = {
  users: [],
};

UsersList.propTypes = {
  users: PropTypes.array,
  filter: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  Meteor.subscribe('users', props.filter, props.page, props.limit);

  const users = Meteor.users
    .find(
      {},
      {
        transform: (user) => {
          const profile = Profiles.findOne({ owner: user._id });
          const name = profile && `${profile.name.first} ${profile.name.last}`;
          const mobile = profile && profile.mobile;
          const email = profile && profile.email;

          return {
            ...user,
            name,
            mobile,
            email,
          };
        },
      },
    )
    .fetch();

  return {
    users,
  };
})(UsersList);
