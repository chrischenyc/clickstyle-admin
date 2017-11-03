import React from 'react';
import { Container, Card, Image, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { formatDate } from '../../../modules/format-date';

// TODO: remove placeholder images
const bookingImages = [
  'https://images.unsplash.com/photo-1503236823255-94609f598e71?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1496019392116-5342906878cc?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1469232136325-aa07d3461bc6?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
  'https://images.unsplash.com/photo-1500350124139-04a90e4ce9f6?dpr=1&auto=compress,format&fit=crop&w=400&h=300&q=50&cs=tinysrgb&crop=',
];

const BookingsList = ({ bookings }) => (
  <Container fluid>
    <Card.Group stackable>
      {bookings.map(booking => (
        <Card key={booking._id} link centered href={`/bookings/${booking._id}`}>
          <Image src={_.sample(bookingImages)} fluid />
          <Card.Content textAlign="left">
            <Card.Header>{booking.title}</Card.Header>
            <Card.Meta>{booking.location}</Card.Meta>
            <Card.Meta>{formatDate(booking.createdAt)}</Card.Meta>
            <Card.Description>{booking.summary}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name="user" />8 bidders
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  </Container>
);

BookingsList.propTypes = {
  bookings: PropTypes.array.isRequired,
};

export default BookingsList;
