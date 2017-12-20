// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Addons = new Mongo.Collection('addons');

Addons.allow({
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
Addons.deny({
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

Addons.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const AddonsSchema = new SimpleSchema({
  serviceId: {
    type: String, // Services._id
  },
  name: {
    type: String,
    unique: false,
  },
  createdBy: {
    type: String, // either 'system' or Users._id
  },
  published: {
    type: Boolean, // system add-ons default to published,  while user add-ons need approval
  },
});

Addons.attachSchema(AddonsSchema);

export default Addons;
