import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import Stylists from '../stylists';

export default function verifyStylistDocument(data) {
  if (
    !Roles.userIsInRole(this.userId, [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  check(data, Object);
  const { userId, document, verified } = data;
  check(userId, String);
  check(document, String);
  check(verified, Boolean);

  if (document === 'qualification') {
    Stylists.update({ owner: userId }, { $set: { qualificationVerified: verified } });
  } else if (document === 'policeCheck') {
    Stylists.update({ owner: userId }, { $set: { policeCheckVerified: verified } });
  } else if (document === 'workingWithChildren') {
    Stylists.update({ owner: userId }, { $set: { workingWithChildrenVerified: verified } });
  }
}
