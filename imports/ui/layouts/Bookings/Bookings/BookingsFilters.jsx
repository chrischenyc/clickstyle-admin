import React from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

// pending, confirmed, declined, cancelled, completed

const BookingsFilters = props => (
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
      active={props.filter === 'confirmed'}
      onClick={() => {
        props.onFilter('confirmed');
      }}
    >
      Confirmed
    </Button>
    <Button
      active={props.filter === 'cancelled'}
      onClick={() => {
        props.onFilter('cancelled');
      }}
    >
      Cancelled
    </Button>
    <Button
      active={props.filter === 'declined'}
      onClick={() => {
        props.onFilter('declined');
      }}
    >
      Declined
    </Button>
    <Button
      active={props.filter === 'completed'}
      onClick={() => {
        props.onFilter('completed');
      }}
    >
      Completed
    </Button>

    <Button
      active={props.filter === 'all'}
      onClick={() => {
        props.onFilter('all');
      }}
    >
      All
    </Button>
  </Button.Group>
);

BookingsFilters.propTypes = {
  filter: PropTypes.string.isRequired,
  onFilter: PropTypes.func.isRequired,
};

export default BookingsFilters;
