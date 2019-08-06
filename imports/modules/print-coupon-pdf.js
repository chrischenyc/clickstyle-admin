import { Meteor } from 'meteor/meteor';
import PDF from 'jspdf';

import { dateString } from './format-date';

export default (
  reusable,
  maxRedeems,
  discount,
  minBookingValue,
  expiry,
  quantity,
  generatedCouponCodes,
) => {
  let output = `${Meteor.settings.public.appName} Admin - Coupons Generated on ${dateString(
    Date.now(),
  )}\n\n`;

  output += `Reusable: ${
    reusable ? 'can be used by more than one users\n' : 'can only be used once\n'
  }`;

  if (reusable) {
    output += `Max number of redeems: ${maxRedeems || 'unlimited'}\n`;
  }

  output += `Discount: ${discount}\n`;

  output += `Min Order: ${minBookingValue}\n`;

  if (expiry) {
    output += `Expiry: ${dateString(expiry)}\n`;
  }

  if (!reusable) {
    output += `Number of coupons: ${quantity}\n`;
  }

  output += '-----------------------------------\n';

  generatedCouponCodes.forEach((code) => {
    output += `${code}\n`;
  });

  const doc = new PDF();
  doc.text(output, 10, 10);
  return doc;
};
