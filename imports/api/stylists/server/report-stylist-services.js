import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import _ from 'lodash';

import Stylists from '../stylists';

export default function stylistServices() {
  if (
    Meteor.isClient
    && !Roles.userIsInRole(Meteor.userId(), [
      Meteor.settings.public.roles.admin,
      Meteor.settings.public.roles.superAdmin,
    ])
  ) {
    throw new Meteor.Error(403, 'unauthorized');
  }

  try {
    const stylists = Stylists.find(
      { published: true },
      { fields: { services: 1, name: 1 } },
    ).fetch();

    const services = [];

    let total = 0;

    stylists.forEach((stylist) => {
      if (!_.isNil(stylist.services)) {
        stylist.services.forEach((service) => {
          services.push({
            id: services.length,
            name: service.name,
            price: service.basePrice,
            stylist: `${stylist.name.first} ${stylist.name.last}`,
          });

          total += service.basePrice;

          if (!_.isNil(service.addons)) {
            service.addons.forEach((addon) => {
              services.push({
                id: services.length,
                name: `${service.name} (${addon.name})`,
                price: addon.price,
                stylist: `${stylist.name.first} ${stylist.name.last}`,
              });

              total += addon.price;
            });
          }
        });
      }
    });

    return { services, average: total / services.length };
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
