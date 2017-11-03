// definition of the Bookings collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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

// TODO: complete Bookings schema
const BookingsSchema = new SimpleSchema({
  title: {
    type: String,
    label: 'Title',
    max: 200,
  },
  location: {
    type: String,
    label: 'Location',
  },
  summary: {
    type: String,
    label: 'Brief summary',
    optional: true,
    max: 1000,
  },
});

Bookings.attachSchema(BookingsSchema);

export default Bookings;
