// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Profiles = new Mongo.Collection('profiles');

Profiles.allow({
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
Profiles.deny({
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

Profiles.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
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

const ProductSchema = new SimpleSchema({
  productId: {
    type: String,
  },
  name: {
    type: String,
  },
});

const ProfilesSchema = new SimpleSchema({
  // required fields
  owner: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  name: { type: NameSchema },

  // optional fields
  gender: {
    type: String,
    optional: true,
    regEx: /^male$|^female$|^other$/,
  },
  mobile: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone, // TODO: enhance regex to aussie mobile regex
    max: 20,
    optional: true,
  },
  address: {
    type: AddressSchema,
    optional: true,
  },
  about: {
    type: String,
    optional: true,
    max: 1000,
  },
  photo: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },

  products: {
    type: Array,
    optional: true,
  },
  'products.$': ProductSchema,

  favouredStylists: {
    type: Array,
    optional: true,
  },
  'favouredStylists.$': String,

  stripeCustomerId: {
    type: String,
    optional: true,
  },
  stripeCardId: {
    type: String,
    optional: true,
  },
  stripeCardLast4: {
    type: String,
    optional: true,
  },
  stripeCardName: {
    type: String,
    optional: true,
  },
});

Profiles.attachSchema(ProfilesSchema);

export default Profiles;
