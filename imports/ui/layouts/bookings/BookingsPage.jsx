import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import BookingsList from './BookingsList';
import Loading from '../../components/Loading';

import Bookings from '../../../api/bookings/bookings';

const BookingsPage = ({ loading, bookings }) => (
  <div className="below-fixed-menu">
    {loading ? (
      <Loading />
    ) : (
      <Segment vertical>
        <BookingsList bookings={bookings} />
      </Segment>
    )}
  </div>
);

BookingsPage.propTypes = {
  loading: PropTypes.bool.isRequired,
  bookings: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('bookings');

  return {
    loading: !handle.ready(),
    bookings: Bookings.find({}).fetch(),
  };
})(BookingsPage);
