import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/server/rate-limit';
import Profiles from '../profiles';
import Products from '../../products/products';
import deleteCloudinaryFile from '../../../modules/server/delete-cloudinary-file';

Meteor.methods({
  'profiles.update': function profilesUpdate(profile) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(profile, Object);

    try {
      // screen invalid products input
      // create new Products object if profile.products contains object(s) without .productId
      const profileToUpdate = profile;

      if (profileToUpdate.products) {
        profileToUpdate.products = profileToUpdate.products
          .filter(product => product.name && product.name.length > 0)
          .map((product) => {
            if (product.productId) {
              // existing product
              return product;
            }

            // insert new Product if it doesn't exist
            // case insensitive search: https://stackoverflow.com/questions/7101703/how-do-i-make-case-insensitive-queries-on-mongodb
            const existingProduct = Products.findOne({
              name: { $regex: new RegExp(product.name, 'i') },
            });
            if (existingProduct) {
              return { productId: existingProduct._id, name: product.name };
            }

            const productId = Products.insert({
              name: product.name,
              system: false,
            });
            return { productId, name: product.name };
          });
      }

      Profiles.update({ owner: this.userId }, { $set: profileToUpdate });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.add': function profilesPhotoAdd(URL) {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    check(URL, String);

    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove current profile photo from cloud
      if (profile.photo && profile.photo.origin) {
        deleteCloudinaryFile(profile.photo.origin, (error) => {
          if (error) {
            /* eslint-disable no-console */
            console.error(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.error(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $set: { photo: { origin: URL } } });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },

  'profiles.photo.remove': function profilesPhotoRemove() {
    if (!this.userId) {
      throw new Meteor.Error(403, 'unauthorized');
    }

    try {
      const profile = Profiles.findOne({ owner: this.userId });

      // remove profile photo from cloud
      if (profile.photo && profile.photo.origin) {
        deleteCloudinaryFile(profile.photo.origin, (error) => {
          if (error) {
            /* eslint-disable no-console */
            console.error(`Unable to delete cloudinary file: ${profile.photo.origin}`);
            console.error(error);
            /* eslint-enable no-console */
          }
        });
      }

      // update Profile.photo data
      Profiles.update({ owner: this.userId }, { $unset: { photo: '' } });
    } catch (exception) {
      /* eslint-disable no-console */
      console.error(exception);
      /* eslint-enable no-console */
      throw new Meteor.Error('500');
    }
  },
});

rateLimit({
  methods: ['profiles.update', 'profiles.photo.add', 'profiles.photo.remove'],
  limit: 5,
  timeRange: 1000,
});
