rsync ../stylesquad-web/imports/api/addons/addons.js imports/api/addons/addons.js
rsync ../stylesquad-web/imports/api/featured/featured.js imports/api/featured/featured.js
rsync ../stylesquad-web/imports/api/products/products.js imports/api/products/products.js
rsync ../stylesquad-web/imports/api/services/services.js imports/api/services/services.js
rsync ../stylesquad-web/imports/api/stylist_applications/stylist_applications.js imports/api/stylist_applications/stylist_applications.js
rsync ../stylesquad-web/imports/api/stylists/stylists.js imports/api/stylists/stylists.js
rsync ../stylesquad-web/imports/api/suburbs/suburbs.js imports/api/suburbs/suburbs.js
rsync ../stylesquad-web/imports/api/user_contacts/user_contacts.js imports/api/user_contacts/user_contacts.js

git add -A && git commit -m "sync db schemas from client codebase"