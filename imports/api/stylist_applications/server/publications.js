import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { publishComposite } from 'meteor/reywood:publish-composite';

import StylistApplications from '../stylist_applications';
import Profiles from '../../profiles/profiles';
import Services from '../../services/services';

publishComposite('stylists.applications', {
  find() {
    if (!Roles.userIsInRole(this.userId, Meteor.settings.public.roles.admin)) {
      return null;
    }

    return StylistApplications.find(
      {},
      { sort: { createdAt: -1 }, fields: { address: 0, qualificationUrl: 0, referenceUrl: 0 } },
    );
  },
  children: [
    {
      find(application) {
        return Profiles.find(
          { owner: application.userId },
          { fields: { owner: 1, email: 1, name: 1 } },
        );
      },
    },
    {
      find(application) {
        return Services.find({ _id: { $in: application.services } }, { fields: { name: 1 } });
      },
    },
  ],
});
