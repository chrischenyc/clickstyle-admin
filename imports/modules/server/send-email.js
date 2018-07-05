import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import log from 'winston';

import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import { dateTimeString, dateString } from '../../modules/server/format-date';
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
  stylistFAQUrl,
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
  homeUrl: Meteor.settings.public.clientHost + homeUrl,
  stylistFAQUrl: Meteor.settings.public.clientHost + stylistFAQUrl,
  contactUrl: Meteor.settings.public.clientHost + contactUrl,
  searchUrl: Meteor.settings.public.clientHost + searchUrl,
  joinUrl: Meteor.settings.public.clientHost + joinUrl,
  privacyUrl: Meteor.settings.public.clientHost + privacyUrl,
  termsUrl: Meteor.settings.public.clientHost + termsUrl,
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
  timezone,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `We cancelled a booking on ${dateString(time, timezone)}`,
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
      time: dateTimeString(time, timezone),
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
    adminUsers
      .filter(adminUser => adminUser.emails && adminUser.emails.length > 0)
      .forEach((adminUser) => {
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

export const sendStylistPendingBookingReminder = ({
  stylistFirstName,
  stylistEmail,
  firstName,
  lastName,
  time,
  bookingId,
  bookingUrl,
  timezone,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `Please response ${firstName}'s request for a booking on ${dateString(
      time,
      timezone,
    )} asap`,
    template: 'stylist-pendingBookingReminder',
    templateConstants: {
      stylistFirstName,
      firstName,
      lastName,
      bookingId,
      bookingUrl: Meteor.settings.public.clientHost + bookingUrl,
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendStylistCompleteBookingReminder = ({
  stylistFirstName,
  stylistEmail,
  firstName,
  lastName,
  time,
  bookingId,
  bookingUrl,
  timezone,
}) => {
  sendEmail({
    to: stylistEmail,
    from: fromAddress,
    subject: `Don't forget to complete the booking on ${dateString(time, timezone)}`,
    template: 'stylist-completeBookingReminder',
    templateConstants: {
      stylistFirstName,
      firstName,
      lastName,
      bookingId,
      bookingUrl: Meteor.settings.public.clientHost + bookingUrl,
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendCustomerReviewBookingReminder = ({
  email,
  stylistFirstName,
  firstName,
  time,
  bookingId,
  bookingUrl,
  timezone,
}) => {
  sendEmail({
    to: email,
    from: fromAddress,
    subject: `How did the booking on ${dateString(
      time,
      timezone,
    )} go? Write ${stylistFirstName} a review!`,
    template: 'customer-reviewBooking',
    templateConstants: {
      stylistFirstName,
      firstName,
      bookingId,
      bookingUrl: Meteor.settings.public.clientHost + bookingUrl,
      ...templateConstants,
    },
  }).catch((error) => {
    log.error(error);
  });
};

export const sendAdminCouponGeneratedEmail = (userId, fileName, filePath) => {
  const { email } = Profiles.findOne({ owner: userId });

  sendEmail({
    to: email,
    from: fromAddress,
    subject: 'Coupon generated',
    template: 'admin-adminAccessGranted',
    templateConstants,
    attachments: [
      {
        fileName,
        filePath,
      },
    ],
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};
