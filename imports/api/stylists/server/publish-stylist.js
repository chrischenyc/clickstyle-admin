import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Stylists from '../stylists';

export default function publishStylist(data) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  check(data, Object);
  const { userId, publish } = data;
  check(userId, String);
  check(publish, Boolean);

  Stylists.update({ owner: userId }, { $set: { published: publish } });

  log.info(
    'Meteor.methods: stylist.publish',
    `userId: ${this.userId}`,
    `param: ${JSON.stringify(data)}`,
  );
}
