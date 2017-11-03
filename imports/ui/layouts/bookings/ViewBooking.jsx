import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Segment, Container, Header } from 'semantic-ui-react';

import Bookings from '../../../api/bookings/bookings';
import Loading from '../../components/Loading';

const ViewBooking = ({ loading, booking }) => {
  let content;
  if (loading) {
    content = <Loading />;
  } else if (booking) {
    content = (
      <Segment vertical>
        <Container>
          <Header>{booking.title}</Header>
        </Container>
      </Segment>
    );
  } else {
    content = <Redirect to="/" />;
  }

  return <div className="below-fixed-menu">{content}</div>;
};

ViewBooking.propTypes = {
  loading: PropTypes.bool.isRequired,
  booking: PropTypes.object,
};

export default withTracker((props) => {
  const handle = Meteor.subscribe('bookings.view', props.match.params._id);

  return {
    loading: !handle.ready(),
    booking: Bookings.findOne(),
  };
})(ViewBooking);
