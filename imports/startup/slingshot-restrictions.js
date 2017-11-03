import { Meteor } from 'meteor/meteor';
import { Slingshot } from 'meteor/edgee:slingshot';

// file types: https://www.sitepoint.com/mime-types-complete-list/

// used on both front-end and back-end
Slingshot.fileRestrictions(Meteor.settings.public.SlingshotCloudinaryImage, {
  allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg'],
  maxSize: Meteor.settings.public.image.maxFileSize * 1024 * 1024,
});

Slingshot.fileRestrictions(Meteor.settings.public.SlingshotS3File, {
  allowedFileTypes: [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'application/msword',
  ],
  maxSize: Meteor.settings.public.document.maxFileSize * 1024 * 1024,
});
