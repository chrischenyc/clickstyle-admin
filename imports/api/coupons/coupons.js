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

const CouponsSchema = new SimpleSchema({
  code: String, // coupon code
  discount: Number, // discount value
  minBookingValue: Number, // min purchase value
  createdBy: String, // Users._id,
  printedAt: {
    type: Date,
    optional: true,
  },
  printedBy: {
    type: String,
    optional: true,
  },
  redeemedAt: {
    type: Date,
    optional: true,
  },
  booking: {
    type: String,
    optional: true,
  },
});

Coupons.attachSchema(CouponsSchema);

export default Coupons;
