// definition of the Bookings collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const BookingActivities = new Mongo.Collection('booking_activities');

BookingActivities.allow({
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
BookingActivities.deny({
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

BookingActivities.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const BookingActivitiesSchema = new SimpleSchema({
  booking: String, // Bookings._id
  stylist: String, // Stylist user id
  customer: String, // Customer user id
  user: String, // userId of who performed the action, or 'system'
  action: String, // requested, cancelled, declined, confirmed, completed, paid, reviewed
});

BookingActivities.attachSchema(BookingActivitiesSchema);

export default BookingActivities;
