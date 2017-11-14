import { Meteor } from 'meteor/meteor';
import Addons from '../addons';

Meteor.publish('addons', () =>
  Addons.find(
    {},
    {
      // hide fields in the return
      fields: { createdAt: 0, updatedAt: 0 },
    },
  ));
