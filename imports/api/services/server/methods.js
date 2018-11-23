import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';

import rateLimit from '../../../modules/server/rate-limit';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';
import Services from '../services';

Meteor.methods({
  'services.update': function serviceUpdateDisplayOrder(services) {
    if (
      !Roles.userIsInRole(Meteor.userId(), [
        Meteor.settings.public.roles.admin,
        Meteor.settings.public.roles.superAdmin,
      ])
    ) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(services, Array);

    try {
      services.forEach((service) => {
        Services.update({ _id: service._id }, { $set: { ...service } });
      });

      log.info(
        'Meteor.methods: services.update',
        `userId: ${this.userId}`,
        `param: ${JSON.stringify(services)}`,
      );
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'services.photo.add': function profilesPhotoAdd(data) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(data, Object);
    const { _id, url } = data;
    check(_id, String);
    check(url, String);

    try {
      const service = Services.findOne({ _id });

      // remove current profile photo from cloud
      if (service.photo) {
        deleteCloudinaryFile(service.photo, (error) => {
          if (error) {
            log.error(`Unable to delete cloudinary file: ${service.photo}, error:${error}`);
          }
        });
      }

      // update Profile.photo data
      Services.update({ _id }, { $set: { photo: url } });

      log.info('Meteor.methods: services.photo.add', `userId: ${this.userId}`, `param: ${data}`);
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
  'services.photo.remove': function profilesPhotoRemove(_id) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(_id, String);

    try {
      const service = Services.findOne({ _id });

      // remove profile photo from cloud
      if (service.photo) {
        deleteCloudinaryFile(service.photo, (error) => {
          if (error) {
            log.error(`Unable to delete cloudinary file: ${service.photo}, error: ${error}`);
          }
        });
      }

      // update Profile.photo data
      Services.update({ owner: this.userId }, { $unset: { photo: '' } });

      log.info('Meteor.methods: services.photo.remove', `userId: ${this.userId}`, `param: ${_id}`);
    } catch (exception) {
      log.error(exception);
      throw exception;
    }
  },
});

rateLimit({
  methods: ['services.update', 'services.photo.add', 'services.photo.remove'],
  limit: 5,
  timeRange: 1000,
});
