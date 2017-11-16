// import server startup through a single index entry point
import { WebApp } from 'meteor/webapp';

import './log';
import './api';
import './fixtures';
import './email';
import '../slingshot-restrictions';
import './slingshot-directives';
import './cloudinary';

WebApp.addHtmlAttributeHook(() => ({ lang: 'en' }));
