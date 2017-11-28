import '../../api/users/server/methods';
import '../../api/users/server/publications';

import '../../api/stylist_applications/server/methods';
import '../../api/stylist_applications/server/publications';

import '../../api/stylists/server/publications';
import '../../api/stylists/server/methods';

import '../../api/profiles/server/publications';

import '../../api/services/server/publication';
import '../../api/services/server/methods';

import '../../api/addons/server/publications';
import '../../api/addons/server/methods';

import '../../api/suburbs/server/publications';
import '../../api/suburbs/server/methods';

// temp fix
import Addons from '../../api/addons/addons';
import Stylists from '../../api/stylists/stylists';

Addons.update({}, { $rename: { public: 'published' } }, { multi: true });
Stylists.update({}, { $rename: { public: 'published' } }, { multi: true });
