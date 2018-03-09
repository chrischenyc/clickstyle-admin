import SimpleSchema from 'simpl-schema';

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

export default ServiceSchema;
