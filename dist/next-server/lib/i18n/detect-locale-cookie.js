"use strict";exports.__esModule=true;exports.detectLocaleCookie=detectLocaleCookie;function detectLocaleCookie(req,locales){if(req.headers.cookie&&req.headers.cookie.includes('NEXT_LOCALE')){const{NEXT_LOCALE}=req.cookies;return locales.find(locale=>NEXT_LOCALE.toLowerCase()===locale.toLowerCase());}}
//# sourceMappingURL=detect-locale-cookie.js.map