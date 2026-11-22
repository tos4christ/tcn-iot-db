/**
 * The new pages are served at two addresses: the original ones (/home, /history, /signin, ...),
 * which they took over from the old pages, and the *_fix ones used while testing (/home_fix, ...).
 * Links between pages stay on the side the visitor is on: on a *_fix address they keep the *_fix
 * links; anywhere else they use the original addresses.
 *
 * To give the original addresses back to the old pages, set PROMOTED to false (index.js then stops
 * adding the original-address routes, and every link goes back to *_fix).
 */
export const PROMOTED = true;

// *_fix address -> original address. Only these are rewritten (e.g. /gridpageone_fix keeps its _fix).
export const PROMOTED_PATHS = {
  '/home_fix': '/home',
  '/signin_fix': '/signin',
  '/bilateral_signin_fix': '/bilateral_signin',
  '/updatepassword_fix': '/updatepassword',
  '/history_fix': '/history',
  '/average_fix': '/average',
  '/profile_fix': '/profile',
  '/downtime_fix': '/downtime',
  '/uptime_fix': '/uptime',
  '/collapse_fix': '/collapse',
  '/tem_fix': '/tem',
  '/voltageprofile_fix': '/voltageprofile',
  '/weather_download_fix': '/weather_download',
  '/sp_bilateral_fix': '/sp_bilateral',
  '/charts_fix': '/charts',
  '/nccweather_fix': '/nccweather',
  '/audit_fix': '/audit',
  '/admin_fix': '/admin',
};

/** True on a *_fix address (/home_fix, /nccweather_fix/Ikeja, ...). */
export function onFixAddress(pathname = window.location.pathname) {
  return /_fix(\/|$)/.test(pathname || '');
}

/**
 * The address to link to. to: a *_fix path, optionally with /sub/path, ?query or #hash.
 * from: the current pathname (defaults to the browser's).
 */
export function page(to, from = window.location.pathname) {
  if (!PROMOTED || onFixAddress(from)) return to;
  const m = /^(\/[A-Za-z0-9_]+)(.*)$/.exec(to);
  if (!m || !Object.prototype.hasOwnProperty.call(PROMOTED_PATHS, m[1])) return to;
  return PROMOTED_PATHS[m[1]] + m[2];
}
