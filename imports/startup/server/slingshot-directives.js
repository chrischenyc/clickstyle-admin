import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

import { formatFileTimestamp } from '../../modules/format-date';

// https://github.com/jimmiebtlr/meteor-slingshot-cloudinary
Slingshot.createDirective(Meteor.settings.public.SlingshotCloudinaryImage, Slingshot.Cloudinary, {
  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(403);
    }

    return true;
  },
  key() {
    return Meteor.uuid();
  },
  tags: [Meteor.settings.public.CloudinaryTag],
});

Slingshot.createDirective(Meteor.settings.public.SlingshotS3File, Slingshot.S3Storage, {
  acl: 'public-read',
  cdn: Meteor.settings.CDN,
  authorize() {
    // Deny uploads if user is not logged in.
    if (!this.userId) {
      throw new Meteor.Error(403);
    }

    return true;
  },
  key(file) {
    // Store file with user id and timestamp
    return `${this.userId}_${formatFileTimestamp(Date.now())}_${file.name}`;
  },
});
