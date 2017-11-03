import { Meteor } from 'meteor/meteor';
import Profiles from '../profiles';

Meteor.publish('profiles.owner', function profilesOwner() {
  return Profiles.find(
    { owner: this.userId },
    {
      // hide fields in the return
      fields: { owner: 0, createdAt: 0, updatedAt: 0 },
    },
  );
});
