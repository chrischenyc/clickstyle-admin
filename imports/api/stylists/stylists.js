// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
  basePriceDescription: {
    type: String,
    optional: true,
  },
  addons: {
    type: Array,
    optional: true,
  },
  'addons.$': AddonSchema,
});

const OpenHour = new SimpleSchema({
  day: {
    type: SimpleSchema.Integer,
    min: 1,
    max: 7,
  },
  open: {
    type: Boolean,
  },
  openAtHour: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 23,
  },
  openAtMinute: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 59,
  },
  closeAtHour: {
    type: SimpleSchema.Integer,
    min: 0,
    max: 23,
  },
  closeAtMinute: {
    type: SimpleSchema.Integer,
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
    type: SimpleSchema.Integer,
  },
  canTravel: {
    type: Boolean,
  },
  availableSuburbs: {
    type: Array,
    optional: true,
  },
  'availableSuburbs.$': String,
});

const StylistsSchema = new SimpleSchema({
  owner: {
    type: String,
  },
  services: Array,
  'services.$': ServiceSchema,
  qualificationUrl: {
    type: String,
    optional: true,
  },
  referenceUrl: {
    type: String,
    optional: true,
  },
  openHours: Array,
  'openHours.$': OpenHour,
  areas: {
    type: AreasSchema,
    optional: true,
  },
  published: {
    type: Boolean, // only published stylist can be discovered by customers
  },
  favourites: SimpleSchema.Integer,
});

Stylists.attachSchema(StylistsSchema);

export default Stylists;
