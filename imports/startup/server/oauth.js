import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import _ from 'lodash';

// read from settings.json
const OAuthSettings = Meteor.settings.OAuth;

if (OAuthSettings) {
  _.forEach(OAuthSettings, (key, service) => {
    ServiceConfiguration.configurations.upsert({ service }, { $set: OAuthSettings[service] });
  });
}
