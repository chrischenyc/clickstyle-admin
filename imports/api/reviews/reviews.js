// definition of the Bookings collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Reviews = new Mongo.Collection('reviews');

Reviews.allow({
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
Reviews.deny({
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

Reviews.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ReviewsSchema = new SimpleSchema({
  booking: String, // Bookings._id
  stylist: String, // Stylist user id
  customer: String, // Customer user id
  rating: SimpleSchema.Integer,
  review: String,
});

Reviews.attachSchema(ReviewsSchema);

export default Reviews;
