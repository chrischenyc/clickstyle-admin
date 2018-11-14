// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Coupons = new Mongo.Collection('coupons');

Coupons.allow({
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
Coupons.deny({
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

Coupons.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const RedeemedBookingSchema = new SimpleSchema({
  date: Date,
  bookingId: String,
  userId: String,
  mobile: {
    type: String,
    optional: true,
  },
  address: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
});

const CouponsSchema = new SimpleSchema({
  reusable: Boolean, // can be used by multiple users
  code: String, // coupon code
  discount: Number, // discount value
  minBookingValue: Number, // min purchase value,
  createdBy: String, // Users._id,
  expiry: {
    type: Date,
    optional: true,
  },
  status: String, // new, printed, redeemed, expired
  printedAt: {
    type: Date,
    optional: true,
  },
  printedBy: {
    type: String,
    optional: true,
  },
  expiredAt: {
    type: Date,
    optional: true,
  },
  expiredBy: {
    type: String,
    optional: true,
  },
  redeemedBookings: {
    type: Array,
    optional: true,
  },
  'redeemedBookings.$': RedeemedBookingSchema,
});

Coupons.attachSchema(CouponsSchema);

export default Coupons;
