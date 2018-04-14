import moment from 'moment';

export const dateString = date => moment(date).format('DD MMM YYYY');
export const dateTimeString = date => moment(date).format('DD MMM YYYY (ddd) HH:mm');
export const timestampString = date => moment(date).format('YYYYMMDDHHmmss');

const urlQueryDateFormat = 'YYMMDD';
export const urlQueryDateString = date => moment(date).format(urlQueryDateFormat);
export const parseUrlQueryDate = string => moment(string, urlQueryDateFormat);
