import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import { usersFindSelector } from '../../../modules/publish-selectors';
import { dateTimeString } from '../../../modules/format-date';

class UsersList extends Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.users, this.props.users)) {
      this.props.onDataLoaded(nextProps.users.length >= this.props.limit);
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
                  {user.registered_emails &&
                    user.registered_emails.map(email => (
                      <div key={email.address}>
                        {email.address} ({email.verified ? 'verified' : 'unverified'})
                      </div>
                    ))}

                  {!user.registered_emails &&
                    user.emails &&
                    user.emails.map(email => (
                      <div key={email.address}>
                        {email.address} ({email.verified ? 'verified' : 'unverified'})
                      </div>
                    ))}
                </Table.Cell>

                <Table.Cell>{dateTimeString(user.createdAt)}</Table.Cell>
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
  search: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('users', props.filter, props.search, props.page, props.limit);

  const selector = usersFindSelector(props.filter, props.search);

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
