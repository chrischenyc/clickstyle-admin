import { Meteor } from 'meteor/meteor';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: Meteor.settings.CloudinaryCloudName,
  api_key: Meteor.settings.CloudinaryKey,
  api_secret: Meteor.settings.CloudinarySecret,
});
