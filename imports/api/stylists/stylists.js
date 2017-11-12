// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Stylists = new Mongo.Collection('stylists');

Stylists.allow({
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
Stylists.deny({
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

Stylists.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const AddonSchema = new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  price: {
    type: Number,
  },
});

const ServiceSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  name: {
    type: String,
  },
  basePrice: {
    type: Number,
    optional: true,
  },
  addons: {
    type: [AddonSchema],
    optional: true,
  },
});

const StylistsSchema = new SimpleSchema({
  owner: {
    type: String, // Meteor.users._id
  },
  services: {
    type: [ServiceSchema],
  },
  qualificationUrl: {
    type: String,
    optional: true,
  },
  referenceUrl: {
    type: String,
    optional: true,
  },
});

Stylists.attachSchema(StylistsSchema);

export default Stylists;
