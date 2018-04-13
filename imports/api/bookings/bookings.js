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
  time: Date,
  duration: SimpleSchema.Integer,
  stripeCustomerId: String,
  stripeCardId: String,
  status: String, // pending, confirmed, declined, cancelled, completed
  stylistConfirmedAt: {
    type: Date,
    optional: true,
  },
  stylistDeclinedAt: {
    type: Date,
    optional: true,
  },
  stylistCancelledAt: {
    type: Date,
    optional: true,
  },
  customerCancelledAt: {
    type: Date,
    optional: true,
  },
  systemCancelledAt: {
    type: Date,
    optional: true,
  },
  stylistCompletedAt: {
    type: Date,
    optional: true,
  },
  customerReviewedAt: {
    type: Date,
    optional: true,
  },
  remindedPendingAt: {
    type: Date,
    optional: true,
  },
  remindedCompleteAt: {
    type: Date,
    optional: true,
  },
  remindedReviewAt: {
    type: Date,
    optional: true,
  },
});

Bookings.attachSchema(BookingsSchema);

export default Bookings;
