import moment from 'moment';

export const formatDate = date => moment(date).format('D MMMM YYYY');
export const formatDateTime = date => moment(date).format('D MMMM YYYY, HH:mm');
export const formatFileTimestamp = date => moment(date).format('YYYYMMDDHHmmss');
