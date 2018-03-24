import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';

import { dateTimeString, parseUrlQueryDate } from '../../../../modules/format-date';
import Bookings from '../../../../api/bookings/bookings';

class BookingsList extends Component {
  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.bookings, this.props.bookings)) {
      this.props.onDataLoaded(nextProps.bookings.length >= this.props.limit);
    }
  }

  render() {
    return (
      <Table celled selectable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Create Date</Table.HeaderCell>
            <Table.HeaderCell>Book Date</Table.HeaderCell>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Total</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.ready &&
            this.props.bookings.map(booking => (
              <Table.Row key={booking._id}>
                <Table.Cell>
                  <Link to={`/bookings/${booking._id}`}>{booking._id}</Link>
                </Table.Cell>
                <Table.Cell>{booking.status}</Table.Cell>
                <Table.Cell>{dateTimeString(booking.createdAt)}</Table.Cell>
                <Table.Cell>
                  {dateTimeString(moment(booking.date + booking.time, 'YYMMDDHHmm'))}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/users/${booking.customer}`}>
                    {`${booking.firstName} ${booking.lastName}`}
                  </Link>
                </Table.Cell>
                <Table.Cell>{booking.total}</Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    );
  }
}

BookingsList.defaultProps = {
  ready: false,
  bookings: [],
};

BookingsList.propTypes = {
  ready: PropTypes.bool,
  bookings: PropTypes.array,
  filter: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  onDataLoaded: PropTypes.func.isRequired,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('bookings', props.filter, props.page, props.limit);

  return {
    ready: handle.ready(),
    bookings: Bookings.find(
      {},
      {
        sort: { createdAt: -1 },
      },
    ).fetch(),
  };
})(BookingsList);
