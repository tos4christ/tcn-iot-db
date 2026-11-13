/**
 * Page frame for the *_fix pages: checks the server session, records the page visit, and draws
 * the modern top bar (logo, title, live status, clock, user, sign out) and the tool navigation.
 *
 *   <FixPage title="History" realms={['ncc']}>{(session) => ...}</FixPage>
 *
 * kiosk: grid page one / two wall screens. Their sign-in never expires and they have no
 * sign-out button (an administrator can end the session from /audit_fix).
 * bare: no top bar or navigation (the wall screens keep their own full-screen layout).
 */
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import nisoLogo from '../../assets/img/niso_logo_main.jpg';
import '../GencoPortal/genco_portal.css';
import './fix.css';
import { useSession, track } from './session';
import { useSocketConnected } from './live';

export const NCC_NAV = [
  ['/home_fix', 'Home'],
  ['/charts_fix', 'Charts'],
  ['/history_fix', 'History'],
  ['/average_fix', 'Average'],
  ['/profile_fix', 'Profile'],
  ['/downtime_fix', 'Downtime'],
  ['/uptime_fix', 'Uptime'],
  ['/collapse_fix', 'Generation analysis'],
  ['/tem_fix', 'TEM & frequency'],
  ['/voltageprofile_fix', 'Voltage profile'],
  ['/weather_download_fix', 'Weather'],
];

export function Clock() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div className="gx-clock">
      <b>{t.toLocaleTimeString('en-GB', { timeZone: 'Africa/Lagos' })}</b>
      <span>{t.toLocaleDateString('en-GB', { timeZone: 'Africa/Lagos', weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
    </div>
  );
}

function LiveStatus() {
  const connected = useSocketConnected();
  return <span className={`gx-status ${connected ? 'live' : 'offline'}`} title="Live data connection"><i />{connected ? 'Live' : 'Reconnecting'}</span>;
}

function Screen({ children }) {
  return <div className="fx-screen"><div>{children}</div></div>;
}

export default function FixPage({ title, eyebrow = 'NISO IoT', realms = ['ncc'], kiosk = false, bare = false, legacy = false, live = false, nav = NCC_NAV, actions, children }) {
  const session = useSession({ realms, kiosk });
  const { status, user } = session;

  useEffect(() => {
    if (status === 'ready') track('page_view', { title });
  }, [status, title]);

  let body;
  if (status === 'loading') body = <Screen><span className="fx-spinner" aria-label="Checking your sign-in" /><p className="gx-muted">Checking your sign-in…</p></Screen>;
  else if (status === 'error') body = <Screen><p className="gx-error">{session.error}</p><button type="button" className="gx-btn" onClick={session.retry}>Try again</button></Screen>;
  else if (status === 'denied') body = <Screen><p className="gx-error">{session.error}</p><button type="button" className="gx-btn" onClick={session.signOut}>Sign in with another account</button></Screen>;
  else body = typeof children === 'function' ? children(session) : children;

  if (bare && status === 'ready') return body;

  const isKiosk = user && user.kind === 'kiosk';
  // Bilateral accounts only see their own page in the menu.
  const baseNav = user && user.realm === 'bilateral' && nav === NCC_NAV ? [['/sp_bilateral_fix', 'Bilateral download']] : nav;
  const items = baseNav.concat(user && user.isAdmin ? [['/audit_fix', 'Audit']] : []);
  const top = (
    <>
      <header className="gx-top">
        <img src={nisoLogo} alt="NISO" className="gx-top-logo" />
        <div className="gx-top-title">
          <span className="gx-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
        </div>
        {actions}
        {live && <LiveStatus />}
        <Clock />
        {user && status === 'ready' && (
          <div className="fx-user">
            <span className="fx-user-name">{user.name || user.email}<small>{isKiosk ? 'Wall screen' : user.realm === 'bilateral' ? 'Bilateral' : 'NCC'}</small></span>
            {!isKiosk && !kiosk && <NavLink className="gx-btn fx-signout" to="/updatepassword_fix" title="Change password">Password</NavLink>}
            {!isKiosk && !kiosk && <button type="button" className="gx-btn fx-signout" onClick={session.signOut}>Sign out</button>}
          </div>
        )}
      </header>
      {status === 'ready' && items.length > 0 && (
        <nav className="fx-nav" aria-label="Tools">
          {items.map(([to, label]) => <NavLink key={to} to={to} activeClassName="active">{label}</NavLink>)}
        </nav>
      )}
    </>
  );
  // legacy: an old page keeps its own layout and styles below the modern top bar.
  if (legacy && status === 'ready') {
    return (
      <>
        <div className="gx-root fx-root fx-bar-root">{top}</div>
        {body}
      </>
    );
  }
  return (
    <div className="gx-root fx-root">
      {top}
      {body}
    </div>
  );
}
