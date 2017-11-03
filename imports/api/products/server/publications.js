import { Meteor } from 'meteor/meteor';
import Products from '../products';

Meteor.publish('products', () =>
  Products.find(
    {},
    {
      // hide fields in the return
      fields: { createdAt: 0, updatedAt: 0, system: 0 },
    },
  ));
