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
  _id: {
    type: String,
  },
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

const OpenHour = new SimpleSchema({
  day: {
    type: Number,
    min: 1,
    max: 7,
  },
  open: {
    type: Boolean,
  },
  openAtHour: {
    type: Number,
    min: 0,
    max: 23,
  },
  openAtMinute: {
    type: Number,
    min: 0,
    max: 59,
  },
  closeAtHour: {
    type: Number,
    min: 0,
    max: 23,
  },
  closeAtMinute: {
    type: Number,
    min: 0,
    max: 59,
  },
});

const SuburbSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  name: {
    type: String,
  },
  postcode: {
    type: String,
  },
});

const AreasSchema = new SimpleSchema({
  suburb: {
    type: SuburbSchema,
  },
  radius: {
    type: Number,
    decimal: true,
  },
  canTravel: {
    type: Boolean,
  },
  availableSuburbs: {
    type: [SuburbSchema],
    optional: true,
  },
});

const StylistsSchema = new SimpleSchema({
  owner: {
    type: String,
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
  openHours: {
    type: [OpenHour],
  },
  areas: {
    type: AreasSchema,
    optional: true,
  },
  public: {
    type: Boolean, // non-public stylist cannot be discovered by customers
  },
});

Stylists.attachSchema(StylistsSchema);

export default Stylists;
