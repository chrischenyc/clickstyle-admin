import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import getPrivateFile from './get-private-file';
import templateToText from './handlebars-email-to-text';
import templateToHTML from './handlebars-email-to-html';
import { formatDateTime } from '../../modules/format-date';

import Profiles from '../../api/profiles/profiles';

// core function to send email
const sendEmail = ({
  text, html, template, templateVars, ...rest
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
                templateVars || {},
              )
              : text,
            html: template
              ? templateToHTML(
                getPrivateFile(`email-templates/${template}.html`),
                templateVars || {},
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

// helpers
const { applicationName, supportEmail } = Meteor.settings.public;
const fromAddress = `${applicationName} <${supportEmail}>`;

export const sendStylistJoinApprovedEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Congrats! You are now a stylist on ${applicationName}`,
    template: 'stylist-join-approved',
    templateVars: {
      applicationName,
      firstName: profile.name.first,
      supportEmail,
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
    subject: `Admin access ${grant}` ? 'granted' : 'revoked',
    template: 'admin-access-grant',
    templateVars: {
      applicationName,
      supportEmail,
      grant: grant ? 'granted' : 'revoked',
      accountEmail: profile.email,
      byEmail: byProfile.email,
      changedOn: formatDateTime(Date.now(0)),
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};
