import { Meteor } from 'meteor/meteor';
import Services from '../services';

Meteor.publish('services', () =>
  Services.find(
    {},
    {
      // hide fields in the return
      fields: { createdAt: 0, updatedAt: 0 },
    },
  ));
