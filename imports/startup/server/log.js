import { Meteor } from 'meteor/meteor';
import { Winston_Papertrail } from 'meteor/wylio:winston-papertrail';
import log from 'winston';

if (Meteor.isServer) {
  // creating a global server logger

  if (Meteor.settings.PapertrailHost && Meteor.settings.PapertrailPort) {
    log.add(Winston_Papertrail, {
      levels: {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        auth: 4,
      },
      colors: {
        debug: 'blue',
        info: 'green',
        warn: 'red',
        error: 'red',
        auth: 'red',
      },

      host: Meteor.settings.PapertrailHost,
      port: Meteor.settings.PapertrailPort,
      handleExceptions: true,
      json: true,
      colorize: true,
      logFormat(level, message) {
        return `${level}: ${message}`;
      },
    });
  }
}
