// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

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
});

Addons.attachSchema(AddonsSchema);

export default Addons;