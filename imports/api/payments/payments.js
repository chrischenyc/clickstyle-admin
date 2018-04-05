import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Payments = new Mongo.Collection('payments');

Payments.allow({
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
Payments.deny({
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

Payments.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const PaymentsSchema = new SimpleSchema({
  booking: String, // Bookings _id
  amount: Number,
  currency: String,
  stripeChargeId: String,
  status: String,
  description: String,
});

Payments.attachSchema(PaymentsSchema);

export default Payments;
