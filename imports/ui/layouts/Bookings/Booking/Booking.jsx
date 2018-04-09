import { Meteor } from 'meteor/meteor';
import React, { Component } from 'react';

import BookingPage from './BookingPage';

class Booking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      booking: null,
      loading: false,
      error: '',
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.loadBooking = this.loadBooking.bind(this);
  }

  componentDidMount() {
    this.loadBooking();
  }

  loadBooking() {
    this.setState({ loading: true, error: '' });

    Meteor.call('bookings.find', this.props.match.params._id, (error, booking) => {
      if (error) {
        this.setState({ error: error.message, loading: false });
      } else {
        this.setState({ booking, loading: false });
      }
    });
  }

  handleCancel() {
    this.setState({ loading: true });

    Meteor.call('cancel.booking', this.props.match.params._id, (error) => {
      this.setState({ loading: false });

      if (error) {
        this.setState({ error: error.message });
      } else {
        this.loadBooking();
      }
    });
  }

  render() {
    return this.state.booking ? (
      <BookingPage
        booking={this.state.booking}
        onCancel={this.handleCancel}
        loading={this.state.loading}
        error={this.state.error}
      />
    ) : (
      <p>loading...</p>
    );
  }
}

export default Booking;
