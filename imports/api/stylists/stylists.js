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
  duration: SimpleSchema.Integer,
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
  baseDescription: {
    type: String,
    optional: true,
  },
  baseDuration: SimpleSchema.Integer,
  addons: {
    type: Array,
    optional: true,
  },
  'addons.$': AddonSchema,
});

// recurring weekday-based open-close hour data model
const OpenHour = new SimpleSchema({
  day: {
    type: SimpleSchema.Integer,
    min: 1,
    max: 7,
  },
  open: {
    type: Boolean,
  },
  openAt: String,
  closeAt: String,
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

const NameSchema = new SimpleSchema({
  first: {
    type: String,
    optional: true,
    max: 50,
  },
  last: {
    type: String,
    optional: true,
    max: 50,
  },
});

const AddressSchema = new SimpleSchema({
  raw: {
    type: String,
    optional: true,
    max: 200,
  },
  state: {
    type: String,
    optional: true,
    max: 3, // TODO: enhance regex
  },
  postcode: {
    type: String,
    optional: true,
    regEx: /^[0-9]{4}$/, // TODO: enhance regex
  },
  suburb: {
    type: String,
    optional: true,
    max: 50,
  },
  address1: {
    type: String,
    optional: true,
    max: 100,
  },
  address2: {
    type: String,
    optional: true,
    max: 100,
  },
});

const ReviewSchema = new SimpleSchema({
  reviewer: String, // customer _id
  booking: String, // booking _id
  createdAt: Date,
  rating: {
    type: SimpleSchema.Integer,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    optional: true,
  },
});

const PortfolioPhotoSchema = new SimpleSchema({
  url: String,
  displayOrder: SimpleSchema.Integer,
});

const TimeSlotSchema = new SimpleSchema({
  from: SimpleSchema.Integer,
  to: SimpleSchema.Integer,
  state: String, // booked | recurring | scheduled
  bookingId: {
    type: String,
    optional: true,
  },
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

  // each stands for a 15-min time slot that has been booked or is unavailable
  // there's a system cron job to auto-update this info for each stylist
  occupiedTimeSlots: Array,
  'occupiedTimeSlots.$': TimeSlotSchema,

  areas: {
    type: AreasSchema,
    optional: true,
  },
  published: {
    type: Boolean, // only published stylist can be discovered by customers
  },

  favourites: Array,
  'favourites.$': String,

  reviews: Array,
  'reviews.$': ReviewSchema,

  averageRating: {
    type: Number,
    optional: true,
  },

  portfolioPhotos: Array,
  'portfolioPhotos.$': PortfolioPhotoSchema,

  // ------------------------------
  // normalised data from Profiles
  name: NameSchema,
  photo: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },
  address: {
    type: AddressSchema,
    optional: true,
  },
});

Stylists.attachSchema(StylistsSchema);

export default Stylists;
