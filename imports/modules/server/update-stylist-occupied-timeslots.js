import moment from 'moment';
import _ from 'lodash';

import Stylists from '../../api/stylists/stylists';

export const calculateOccupiedTimeSlots = (occupiedTimeSlots, openHours, days) => {
  // clean up existing recurring occupied time slots
  let newOccupiedTimeSlots = _.isEmpty(occupiedTimeSlots)
    ? []
    : occupiedTimeSlots.filter(t => !(t.state === 'closed'));

  for (let index = 0; index < days; index += 1) {
    const timeSlotsOfDay = [];

    const day = moment().add(index, 'd');
    let weekDay = day.weekday();
    if (weekDay === 0) {
      weekDay = 7; // in our system Sunday is 7, in moment.js Sunday is 0
    }
    const openHour = openHours.filter(o => o.day === weekDay)[0];

    const dateString = day.format('YYMMDD');

    if (!openHour.open) {
      // if closed, fill the day with a single occupied timeslot
      timeSlotsOfDay.push({
        from: parseInt(`${dateString}0000`, 10),
        to: parseInt(`${dateString}2359`, 10),
        state: 'closed',
      });
    } else {
      // else, fill the day with occupied timeslots before/after open/close time

      const openAtHour = parseInt(openHour.openAt.split(':')[0], 10);
      const openAtMinute = parseInt(openHour.openAt.split(':')[1], 10);
      const closeAtHour = parseInt(openHour.closeAt.split(':')[0], 10);
      const closeAtMinute = parseInt(openHour.closeAt.split(':')[1], 10);

      if (!(openAtHour === 0 && openAtMinute === 0)) {
        timeSlotsOfDay.push({
          from: parseInt(`${dateString}0000`, 10),
          to: parseInt(dateString + openHour.openAt.replace(':', ''), 10),
          state: 'closed',
        });
      }

      if (!(closeAtHour === 23 && closeAtMinute === 59)) {
        timeSlotsOfDay.push({
          from: parseInt(dateString + openHour.closeAt.replace(':', ''), 10),
          to: parseInt(`${dateString}2359`, 10),
          state: 'closed',
        });
      }
    }

    // merge day's timeslots back to master array
    newOccupiedTimeSlots = [...newOccupiedTimeSlots, ...timeSlotsOfDay];
  }

  newOccupiedTimeSlots = _.uniq(newOccupiedTimeSlots);

  return newOccupiedTimeSlots;
};

export const updateStylistOccupiedTimeSlots = (stylist, days) => {
  const { _id, occupiedTimeSlots, openHours } = stylist;

  // update record
  Stylists.update(
    { _id },
    { $set: { occupiedTimeSlots: calculateOccupiedTimeSlots(occupiedTimeSlots, openHours, days) } },
  );
};
