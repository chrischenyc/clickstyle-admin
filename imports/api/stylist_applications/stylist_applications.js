// definition of the StylistApplications collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const StylistApplications = new Mongo.Collection('stylists_applications');

StylistApplications.allow({
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
StylistApplications.deny({
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

StylistApplications.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ServiceSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  name: {
    type: String,
  },
});

const StylistApplicationsSchema = new SimpleSchema({
  // required fields
  userId: {
    type: String,
  },
  name: {
    type: String,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  mobile: {
    type: String,
    regEx: SimpleSchema.RegEx.Phone,
    max: 20,
  },
  address: {
    type: String,
    max: 200,
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
  experienceYears: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  approved: {
    type: Boolean,
  },
  approvedBy: {
    type: String,
    optional: true,
  },
  approvedAt: {
    type: Date,
    optional: true,
  },
});

StylistApplications.attachSchema(StylistApplicationsSchema);

export default StylistApplications;
