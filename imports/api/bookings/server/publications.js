import { Meteor } from 'meteor/meteor';

import Bookings from '../bookings';

Meteor.publish('bookings', () => Bookings.find({}, { sort: { createdAt: -1 } }));

Meteor.publish('bookings.view', _id => Bookings.find({ _id }));
