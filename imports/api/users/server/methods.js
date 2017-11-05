import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import rateLimit from '../../../modules/server/rate-limit';

Meteor.methods({
  'users.sendVerificationEmail': function usersSendVerificationEmail() {
    return Accounts.sendVerificationEmail(this.userId);
  },
});

rateLimit({
  methods: ['users.sendVerificationEmail'],
  limit: 5,
  timeRange: 1000,
});
