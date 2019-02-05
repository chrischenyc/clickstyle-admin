import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import log from 'winston';
import moment from 'moment';
import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import os from 'os';

import Stylists from '../stylists';
import Profiles from '../../profiles/profiles';
import { timestampString } from '../../../modules/format-date';
import { sendAdminEmailStylistsDailyReport } from '../../../modules/server/send-email';
import { privateFilePath } from '../../../modules/server/private-file';

export default function stylistSignUps() {
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
    // find stylist applications in the last month
    let stylists = Stylists.find(
      {
        createdAt: {
          $gte: moment()
            .subtract(3, 'month')
            .toDate(),
        },
      },
      {
        fields: { occupiedTimeSlots: 0 },
        sort: { createdAt: -1 },
      },
    ).fetch();

    const userIds = stylists.map(stylist => stylist.owner);
    const profiles = Profiles.find({ owner: { $in: userIds } }).fetch();

    stylists = stylists.map((stylist) => {
      const profile = profiles.filter(p => p.owner === stylist.owner)[0];

      return {
        ...stylist,
        email: profile.email,
        mobile: profile.mobile,
        hasServices: stylist.services && stylist.services.length > 0,
        hasHours: stylist.openHours && stylist.openHours.length > 0,
        hasAreas: stylist.areas && stylist.areas.length > 0,
        hasPortfolio: stylist.portfolioPhotos && stylist.portfolioPhotos.length > 0,
        hasBank: !_.isNil(stylist.bankInfo),
      };
    });

    const output = [];

    // header
    const header = [];
    header.push('name');
    header.push('email');
    header.push('mobile');
    header.push('published');
    header.push('services');
    header.push('calendar');
    header.push('suburbs');
    header.push('portfolio');
    header.push('bank');
    header.push('qualification');
    header.push('police check');
    header.push('working with children');
    output.push(header.join()); // by default, join() uses a ','

    stylists.forEach((stylist) => {
      const row = [];
      row.push(`${stylist.name.first} ${stylist.name.last}`);
      row.push(stylist.email);
      row.push(stylist.mobile);
      row.push(stylist.published ? 'yes' : 'no');
      row.push(stylist.hasServices ? '✓' : '');
      row.push(stylist.hasHours ? '✓' : '');
      row.push(stylist.hasAreas ? '✓' : '');
      row.push(stylist.hasPortfolio ? '✓' : '');
      row.push(stylist.hasBank ? '✓' : '');
      row.push(stylist.qualificationUrl || '');
      row.push(stylist.policeCheckUrl || '');
      row.push(stylist.workingWithChildrenUrl || '');

      output.push(row.join());
    });

    const filePath = privateFilePath(
      `clickstyle_stylists_last_30days_${timestampString(new Date())}.csv`,
    );

    fs.writeFileSync(filePath, output.join(os.EOL));

    sendAdminEmailStylistsDailyReport(filePath);
  } catch (exception) {
    log.error(exception);
    throw exception;
  }
}
