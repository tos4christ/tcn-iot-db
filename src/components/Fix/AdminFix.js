/**
 * /admin and /admin_fix (administrators): service switches.
 *
 *   Weather API subscription: suspend it when the subscription has expired. While suspended the
 *   server sends no live weather to any page (the /api2/weather, /api/weather/getweather and
 *   /frequency/weather calls answer "suspended"), the weather engine stops calling the providers,
 *   and the home, sign-in, weather and weather report pages show a "Weather API subscription
 *   expired" notice. Turn it back on once the subscription is paid; open pages pick it up within a
 *   minute. Each change is written to the audit trail.
 *
 * Server: tcn_radar_BE controllers/serviceAdmin.js, utility/serviceSettings.js.
 */
import React, { useCallback, useEffect, useState } from 'react';
import FixPage from './FixPage';
import { api } from './fixApi';
import { setWeatherStatus, WeatherNotice } from './serviceStatus';

const lagos = (t) => {
  if (!t) return '—';
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

function WeatherSwitch() {
  const [info, setInfo] = useState(null); // { weather, defaultMessage, messageMax }
  const [loadError, setLoadError] = useState(null);
  const [message, setMessage] = useState('');
  const [state, setState] = useState({ busy: false, error: null, ok: null });

  const load = useCallback(async () => {
    try {
      const d = await api('/api2/admin/services');
      setInfo(d);
      setLoadError(null);
      setWeatherStatus(d.weather);
      if (d.weather.suspended) setMessage(d.weather.message || '');
    } catch (err) {
      setLoadError(err.message);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  if (loadError && !info) {
    return (
      <section className="gx-panel">
        <header><h2>Weather API subscription</h2></header>
        <p className="gx-error" role="alert">{loadError}</p>
        <div className="fx-actions"><button type="button" className="gx-btn" onClick={load}>Try again</button></div>
      </section>
    );
  }
  if (!info) return <section className="gx-panel"><span className="fx-spinner" aria-label="Loading" /></section>;

  const w = info.weather;
  const max = info.messageMax || 300;
  const tooLong = message.trim().length > max;

  const change = async (suspended) => {
    if (state.busy || (suspended && tooLong)) return;
    const question = suspended
      ? 'Suspend weather now?\n\nNo page will get live weather or forecasts, and everyone visiting the home, sign-in and weather pages will see "Weather API subscription expired".'
      : 'Turn weather back on now?\n\nDo this once the subscription has been renewed. The weather pages start working again within a minute.';
    if (!window.confirm(question)) return;
    setState({ busy: true, error: null, ok: null });
    try {
      const d = await api('/api2/admin/services/weather', { method: 'PUT', body: { suspended, message: suspended ? message.trim() : undefined } });
      setInfo((i) => ({ ...i, weather: d.weather }));
      setWeatherStatus(d.weather);
      if (!suspended) setMessage('');
      setState({ busy: false, error: null, ok: suspended ? 'Weather is suspended. Visitors now see the "subscription expired" notice.' : 'Weather is back on. The forecast is being refreshed now.' });
    } catch (err) {
      setState({ busy: false, error: err.message, ok: null });
    }
  };

  return (
    <section className="gx-panel fx-admin-switch">
      <header>
        <h2>Weather API subscription</h2>
        <span className={`fx-switch-state ${w.suspended ? 'off' : 'on'}`}>{w.suspended ? 'Suspended' : 'On'}</span>
      </header>
      {w.suspended ? (
        <p className="fx-hint">Suspended since {lagos(w.since)}{w.by ? ` by ${w.by}` : ''}. No live weather is sent to any page and the weather engine makes no provider calls.</p>
      ) : (
        <p className="fx-hint">Live weather is on. Suspend it when the subscription has expired: every page stops receiving live weather and visitors to the home, sign-in and weather pages see a &ldquo;Weather API subscription expired&rdquo; notice. Recorded weather reports still download.</p>
      )}
      <label className="gx-field">
        <span>Message shown to visitors {w.suspended ? '' : '(optional)'}</span>
        <textarea rows={3} value={message} maxLength={max + 50} placeholder={info.defaultMessage}
          onChange={(e) => setMessage(e.target.value)} disabled={state.busy} />
      </label>
      <p className={`fx-hint${tooLong ? ' fx-over' : ''}`}>{message.trim().length} / {max} characters. Leave it empty to use the standard message shown in grey.</p>
      {state.error && <p className="gx-error" role="alert">{state.error}</p>}
      {state.ok && <p className="fx-ok" role="status">{state.ok}</p>}
      <div className="fx-actions">
        {w.suspended ? (
          <>
            <button type="button" className="gx-btn gx-btn-primary" disabled={state.busy} onClick={() => change(false)}>{state.busy ? 'Saving…' : 'Turn weather back on (subscription renewed)'}</button>
            <button type="button" className="gx-btn" disabled={state.busy || tooLong} onClick={() => change(true)}>Update the message</button>
          </>
        ) : (
          <button type="button" className="gx-btn fx-btn-danger" disabled={state.busy || tooLong} onClick={() => change(true)}>{state.busy ? 'Saving…' : 'Suspend weather (subscription expired)'}</button>
        )}
      </div>
      {w.suspended && (
        <div className="fx-preview">
          <span className="fx-hint">What visitors see:</span>
          <WeatherNotice />
        </div>
      )}
    </section>
  );
}

export default function AdminFix() {
  return (
    <FixPage title="Admin" eyebrow="Administration">
      {(session) => (session.user.isAdmin
        ? <main className="gx-main" style={{ maxWidth: 760 }}><WeatherSwitch /></main>
        : <main className="gx-main"><p className="gx-error">Only administrators can open this page.</p></main>)}
    </FixPage>
  );
}
