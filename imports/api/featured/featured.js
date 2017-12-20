// definition of the Profiles collection
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

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
    type: SimpleSchema.Integer,
  },
});

const FeaturedSchema = new SimpleSchema({
  homeFeaturedStylists: Array,
  'homeFeaturedStylists.$': FeaturedStylistSchema,
});

Featured.attachSchema(FeaturedSchema);

export default Featured;
