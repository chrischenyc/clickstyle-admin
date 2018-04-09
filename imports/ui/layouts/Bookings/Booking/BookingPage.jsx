import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Message, Button, Divider } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import moment from 'moment';

import { dateTimeString } from '../../../../modules/format-date';
import servicesSummary from '../../../../modules/format-services';

const BookingPage = props => (
  <Container>
    <Header as="h2">Booking {props.booking._id}</Header>

    <div>
      Booking date: {dateTimeString(moment(props.booking.date + props.booking.time, 'YYMMDDHHmm'))}
    </div>

    <div>Services:&nbsp;{servicesSummary(props.booking.services)}</div>

    <div>Total:&nbsp;{props.booking.total}</div>

    <div>Customer:&nbsp; {`${props.booking.firstName} ${props.booking.lastName}`}</div>

    <div>
      Email:&nbsp;<a href={`mailto:${props.booking.email}`}>{props.booking.email}</a>
    </div>

    <div>Mobile:&nbsp;{props.booking.mobile}</div>

    <div>
      Address:&nbsp;
      <a href={`https://maps.google.com/?q=${props.booking.address}`} target="_blank">
        {props.booking.address}
      </a>
    </div>

    <Divider />
    <div>
      Customer:&nbsp;
      <Link to={`/users/${props.booking.customer.owner}`}>
        {`${props.booking.customer.name.first} ${props.booking.customer.name.last}`}
      </Link>
    </div>

    <div>
      Email:&nbsp;<a href={`mailto:${props.booking.customer.email}`}>{props.booking.customer.email}</a>
    </div>

    <div>Mobile:&nbsp;{props.booking.customer.mobile}</div>

    <Divider />
    <div>
      Stylist:&nbsp;
      <Link to={`/users/${props.booking.stylist.owner}`}>
        {`${props.booking.stylist.name.first} ${props.booking.stylist.name.last}`}
      </Link>
    </div>

    <div>
      Email:&nbsp;
      <a href={`mailto:${props.booking.stylist.email}`}>{props.booking.stylist.email}</a>
    </div>

    <div>Mobile:&nbsp;{props.booking.stylist.mobile}</div>

    <Divider />

    <div>Created: {dateTimeString(props.booking.createdAt)}</div>

    {props.booking.stylistConfirmedAt && (<div>Stylist confirmed: {dateTimeString(props.booking.stylistConfirmedAt)}</div>)}
    {props.booking.stylistDeclinedAt && (<div>Stylist declined: {dateTimeString(props.booking.stylistDeclinedAt)}</div>)}
    {props.booking.stylistCancelledAt && (<div>Stylist cancelled: {dateTimeString(props.booking.stylistCancelledAt)}</div>)}
    {props.booking.customerCancelledAt && (<div>Customer cancelled: {dateTimeString(props.booking.customerCancelledAt)}</div>)}
    {props.booking.systemCancelledAt && (<div>System cancelled: {dateTimeString(props.booking.systemCancelledAt)}</div>)}
    {props.booking.remindedPendingAt && (<div>Informed admin of long pending: {dateTimeString(props.booking.remindedPendingAt)}</div>)}
    {props.booking.stylistCompletedAt && (<div>Stylist completed: {dateTimeString(props.booking.stylistCompletedAt)}</div>)}

    <Divider />

    {/* {(props.booking.status === 'pending' || props.booking.status === 'confirmed') && (
      <Button
        size="large"
        primary
        onClick={props.onCancel}
        loading={props.loading}
        disabled={props.loading}
      >
        Cancel booking
      </Button>
    )} */}

    {!_.isEmpty(props.error) && <Message error>{props.error}</Message>}
  </Container>
);

BookingPage.propTypes = {
  booking: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
};

export default BookingPage;
