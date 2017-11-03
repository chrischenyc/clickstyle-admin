// definition of the Services stylist can provide
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Services = new Mongo.Collection('services');

Services.allow({
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
Services.deny({
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

Services.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ServicesSchema = new SimpleSchema({
  // required fields
  name: {
    type: String,
    unique: true,
  },
});

Services.attachSchema(ServicesSchema);

export default Services;
