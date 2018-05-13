rsync ../clickstyle-web/imports/api/addons/addons.js imports/api/addons/addons.js
rsync ../clickstyle-web/imports/api/bookings/bookings.js imports/api/bookings/bookings.js
rsync ../clickstyle-web/imports/api/booking_activities/booking_activities.js imports/api/booking_activities/booking_activities.js
rsync ../clickstyle-web/imports/api/reviews/reviews.js imports/api/reviews/reviews.js
rsync ../clickstyle-web/imports/api/featured/featured.js imports/api/featured/featured.js
rsync ../clickstyle-web/imports/api/products/products.js imports/api/products/products.js
rsync ../clickstyle-web/imports/api/profiles/profiles.js imports/api/profiles/profiles.js
rsync ../clickstyle-web/imports/api/services/services.js imports/api/services/services.js
rsync ../clickstyle-web/imports/api/stylist_applications/stylist_applications.js imports/api/stylist_applications/stylist_applications.js
rsync ../clickstyle-web/imports/api/stylists/stylists.js imports/api/stylists/stylists.js
rsync ../clickstyle-web/imports/api/stylists/stylists-services-schema.js imports/api/stylists/stylists-services-schema.js
rsync ../clickstyle-web/imports/api/suburbs/suburbs.js imports/api/suburbs/suburbs.js
rsync ../clickstyle-web/imports/api/user_contacts/user_contacts.js imports/api/user_contacts/user_contacts.js
rsync ../clickstyle-web/imports/api/payments/payments.js imports/api/payments/payments.js
rsync ../clickstyle-web/imports/api/notifications/notifications.js imports/api/notifications/notifications.js

git add -A && git commit -m "sync db schemas from client codebase"