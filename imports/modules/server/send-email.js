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
const commonTemplateVars = {
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
export const templateVars = {
  ...commonTemplateVars,
  txtFooter: templateToText(getPrivateFile('email-templates/footer.txt'), commonTemplateVars),
  htmlFooter: templateToHTML(getPrivateFile('email-templates/footer.html'), commonTemplateVars),
};

export const sendStylistJoinApprovedEmail = (userId) => {
  const profile = Profiles.findOne({ owner: userId });

  sendEmail({
    to: profile.email,
    from: fromAddress,
    subject: `Congrats! You are now a stylist on ${appName}`,
    template: 'stylist-join-approved',
    templateVars: {
      firstName: profile.name.first,
      ...templateVars,
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
    template: 'admin-access-grant',
    templateVars: {
      grant: grant ? 'granted' : 'revoked',
      accountEmail: profile.email,
      byEmail: byProfile.email,
      changedOn: formatDateTime(Date.now(0)),
      ...templateVars,
    },
  }).catch((error) => {
    throw new Meteor.Error('500', `${error}`);
  });
};
