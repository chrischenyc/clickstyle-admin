import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import Profiles from '../../api/profiles/profiles';
// seed admin user

const seedAdminEmail = 'admin@stylesquad.com';
const adminUser = Accounts.findUserByEmail('admin@stylesquad.com');
if (!adminUser) {
  const userId = Accounts.createUser({
    email: seedAdminEmail,
    password: 'NSuyU4QQ',
    profile: {
      name: {
        first: 'Admin',
        last: 'Stylesquad',
      },
    },
  });

  Roles.addUsersToRoles(userId, [
    Meteor.settings.public.roles.customer,
    Meteor.settings.public.roles.admin,
  ]);

  Profiles.insert({
    owner: userId,
    name: {
      first: 'Admin',
      last: 'Stylesquad',
    },
    email: seedAdminEmail,
  });
}
