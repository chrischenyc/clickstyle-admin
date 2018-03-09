// definition of the Bookings collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import ServiceSchema from '../stylists/stylists-services-schema';

const Bookings = new Mongo.Collection('bookings');

Bookings.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});
Bookings.deny({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

Bookings.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const BookingsSchema = new SimpleSchema({
  stylist: String, // Stylist user id
  services: Array,
  'services.$': ServiceSchema,
  total: Number,
  customer: String, // Customer user id
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  address: String,
  date: String,
  time: String,
  stripeCustomerId: String,
  status: String, // pending, approved/declined, cancelled, completed
});

Bookings.attachSchema(BookingsSchema);

export default Bookings;
