// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Featured = new Mongo.Collection('featured');

Featured.allow({
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
Featured.deny({
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

const FeaturedStylistSchema = new SimpleSchema({
  owner: {
    type: String,
  },
  displayOrder: {
    type: Number,
  },
});

const FeaturedSchema = new SimpleSchema({
  homeFeaturedStylists: {
    type: [FeaturedStylistSchema],
  },
});

Featured.attachSchema(FeaturedSchema);

export default Featured;
