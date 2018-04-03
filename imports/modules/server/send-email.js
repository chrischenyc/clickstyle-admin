import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import log from 'winston';

import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import { dateTimeString } from '../../modules/format-date';
import Profiles from '../../api/profiles/profiles';

// core function to send email
const sendEmail = ({
  text, html, template, templateConstants, ...rest
}) => {
  if (text || html || template) {
    return new Promise((resolve, reject) => {
      try {
        Meteor.defer(() => {
          Email.send({
            ...rest,
            text: template
              ? templateToText(
                getPrivateFile(`email-templates/${template}.txt`),
                templateConstants || {},
              )
              : text,
            html: template
              ? templateToHTML(
                getPrivateFile(`email-templates/${template}.html`),
                templateConstants || {},
              )
              : html,
          });
          resolve();
        });
      } catch (exception) {
        reject(exception);
      }
    });
  }
  throw new Error("Please pass an HTML string, text, or template name to compile for your message's body.");
};

// retrieve constants from Meteor settings files
const {
  appName,
  homeUrl,
  helpUrl,
  contactUrl,
  searchUrl,
  joinUrl,
  privacyUrl,
  termsUrl,
  supportEmail,
  facebookUrl,
  twitterUrl,
  instagramUrl,
} = Meteor.settings.public;

export const fromAddress = `${appName} <${supportEmail}>`;

// standard vars most email templates use
const constantsFromSettings = {
  appName,
  homeUrl: Meteor.absoluteUrl(homeUrl),
  helpUrl: Meteor.absoluteUrl(helpUrl),
  contactUrl: Meteor.absoluteUrl(contactUrl),
  searchUrl: Meteor.absoluteUrl(searchUrl),
  joinUrl: Meteor.absoluteUrl(joinUrl),
  privacyUrl: Meteor.absoluteUrl(privacyUrl),
  termsUrl: Meteor.absoluteUrl(termsUrl),
  supportEmail,
  facebookUrl,
  twitterUrl,
  instagramUrl,
};

// add shared footers
export const templateConstants = {
  ...constantsFromSettings,
  txtFooter: templateToText(getPrivateFile('email-templates/footer.txt'), constantsFromSettings),
  htmlFooter: templateToHTML(getPrivateFile('email-templates/footer.html'), constantsFromSettings),
};

export const sendStylistJoinApprovedEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Congrats! You are now a stylist on ${appName}`,
    template: 'stylist-applicationApproved',
    templateConstants: {
      firstName: profile.name.first,
      ...templateConstants,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};

export const sendAdminAccessGrantEmail = (userId, grant, byUserId) => {
  const profile = Profiles.findOne({ owner: userId }, { fields: { email: 1 } });
  const byProfile = Profiles.findOne({ owner: byUserId }, { fields: { email: 1 } });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Admin access ${grant ? 'granted' : 'revoked'}`,
    template: 'admin-adminAccessGranted',
    templateConstants: {
      grant: grant ? 'granted' : 'revoked',
      accountEmail: profile.email,
      byEmail: byProfile.email,
      changedOn: dateTimeString(Date.now(0)),
      ...templateConstants,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};

export const sendCustomerBookingCancelledBySystemEmail = ({
  stylist,
  services,
  total,
  firstName,
  lastName,
  email,
  mobile,
  address,
  time,
  bookingsId,
  bookingUrl,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: 'Booking has been cancelled',
    template: 'customer-bookingCancelledBySystem',
    templateConstants: {
      stylist,
      services,
      total,
      firstName,
      lastName,
      email,
      mobile,
      address,
      time,
      bookingsId,
      bookingUrl: Meteor.settings.public.clientHost + bookingUrl,
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendAdminEmailLongPendingBooking = (bookingId) => {
  const adminUrl = Meteor.absoluteUrl(`bookings/${bookingId}`);

  const adminUsers = Meteor.users
    .find({ roles: Meteor.settings.public.roles.admin }, { fields: { emails: 1 } })
    .fetch();

  try {
    adminUsers.forEach((adminUser) => {
      sendEmail({
        to: adminUser.emails[0],
        from: fromAddress,
        subject: `Booking ${bookingId} has been pending for over 24 hours`,
        template: 'admin-pendingBookingsReminder',
        templateConstants: {
          adminUrl,
          bookingId,
          ...templateConstants,
        },
      });
    });
  } catch (error) {
    log.error(error);
  }
};
