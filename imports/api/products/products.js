// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const Products = new Mongo.Collection('products');

Products.allow({
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
Products.deny({
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

Products.attachBehaviour('timestampable', {
  createdBy: false,
  updatedBy: false,
});

const ProductsSchema = new SimpleSchema({
  // required fields
  name: {
    type: String,
    unique: true,
  },
  system: {
    type: Boolean,
  },
});

Products.attachSchema(ProductsSchema);

export default Products;
