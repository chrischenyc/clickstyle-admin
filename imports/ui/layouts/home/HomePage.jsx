import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import BannerSegment from './BannerSegment';
import HowItWorksSegment from './HowItWorksSegment';
import ArticlesSegment from './ArticlesSegment';
import BookingsList from '../bookings/BookingsList';

import Bookings from '../../../api/bookings/bookings';

const HomePage = props => (
  <div className="below-fixed-menu">
    <BannerSegment />

    <HowItWorksSegment />

    <ArticlesSegment />

    <Segment
      textAlign="center"
      style={{
        padding: '2rem 0',
      }}
      vertical
    >
      <BookingsList bookings={props.bookings} />
    </Segment>
  </div>
);

HomePage.propTypes = {
  bookingsLoading: PropTypes.bool.isRequired,
  bookings: PropTypes.array.isRequired,
};

export default withTracker(() => {
  const handle = Meteor.subscribe('bookings');

  return {
    bookingsLoading: !handle.ready(),
    bookings: Bookings.find({}).fetch(),
  };
})(HomePage);
