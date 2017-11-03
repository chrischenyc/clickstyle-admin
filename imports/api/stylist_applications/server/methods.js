import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import StylistApplications from '../stylist_applications';
import { sendStylistJoinConfirmEmail } from '../../../modules/server/send-email';

Meteor.methods({
  'stylists.join': function stylistsJoin(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const {
      mobile, address, services, qualificationUrl, referenceUrl,
    } = data;

    try {
      check(mobile, String);
      check(address, String);
      check(services, Array);
      if (qualificationUrl) {
        check(qualificationUrl, String);
      }
      check(referenceUrl, String);

      StylistApplications.insert(
        {
          userId: this.userId,
          mobile,
          address,
          services,
          qualificationUrl,
          referenceUrl,
          approved: false,
        },
        (error) => {
          if (!error) {
            sendStylistJoinConfirmEmail(this.userId);
          }
        },
      );
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['stylists.join'],
  limit: 5,
  timeRange: 1000,
});
