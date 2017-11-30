import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

import Profiles from '../../api/profiles/profiles';
// seed admin user

const seedAdminEmail = 'admin@stylesquad.com.au';
const adminUser = Accounts.findUserByEmail(seedAdminEmail);
if (!adminUser) {
  const userId = Accounts.createUser({
    email: seedAdminEmail,
    password: 'NSuyU4QQ',
    profile: {
      email: seedAdminEmail,
      name: {
        first: 'Admin',
        last: 'Stylesquad',
      },
    },
  });

  Roles.addUsersToRoles(userId, [Meteor.settings.public.roles.superAdmin]);

  Profiles.insert({
    owner: userId,
    name: {
      first: 'Admin',
      last: 'Stylesquad',
    },
    email: seedAdminEmail,
  });
}
