import Bookings from '../bookings';
import Profiles from '../../profiles/profiles';

Bookings.after.insert((userId, booking) => {
  Profiles.update({ owner: booking.customer }, { $inc: { pendingBookings: 1 } });
  Profiles.update({ owner: booking.stylist }, { $inc: { pendingCustomerBookings: 1 } });
});

Bookings.after.update((userId, booking, fieldNames, modifier) => {
  if (modifier.$set && modifier.$set.status) {
    if (modifier.$set.status === 'confirmed') {
      Profiles.update(
        { owner: booking.customer },
        { $inc: { pendingBookings: -1, confirmedBookings: 1 } },
      );
      Profiles.update(
        { owner: booking.stylist },
        { $inc: { pendingCustomerBookings: -1, confirmedCustomerBookings: 1 } },
      );
    } else if (modifier.$set.status === 'declined') {
      Profiles.update(
        { owner: booking.customer },
        { $inc: { pendingBookings: -1, declinedBookings: 1 } },
      );
      Profiles.update(
        { owner: booking.stylist },
        { $inc: { pendingCustomerBookings: -1, declinedCustomerBookings: 1 } },
      );
    } else if (modifier.$set.status === 'cancelled') {
      if (booking.stylistConfirmedAt) {
        Profiles.update(
          { owner: booking.customer },
          { $inc: { confirmedBookings: -1, cancelledBookings: 1 } },
        );
        Profiles.update(
          { owner: booking.stylist },
          { $inc: { confirmedCustomerBookings: -1, cancelledCustomerBookings: 1 } },
        );
      } else {
        Profiles.update(
          { owner: booking.customer },
          { $inc: { pendingBookings: -1, cancelledBookings: 1 } },
        );
        Profiles.update(
          { owner: booking.stylist },
          { $inc: { pendingCustomerBookings: -1, cancelledCustomerBookings: 1 } },
        );
      }
    } else if (modifier.$set.status === 'completed') {
      Profiles.update(
        { owner: booking.customer },
        { $inc: { confirmedBookings: -1, completedBookings: 1 } },
      );
      Profiles.update(
        { owner: booking.stylist },
        { $inc: { confirmedCustomerBookings: -1, completedCustomerBookings: 1 } },
      );
    }
  }
});
