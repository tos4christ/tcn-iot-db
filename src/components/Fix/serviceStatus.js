/**
 * Service switches set by an administrator on the Admin page (GET /api2/service-status, public).
 * Today: weather { suspended, message, since } - "Weather API subscription expired".
 *
 * One shared copy for the whole page, checked every minute while something shows it, so turning
 * the switch on or off reaches open pages within about a minute without a reload.
 */
import React, { useEffect, useState } from 'react';
import { api } from './fixApi';

const POLL_MS = 60000;
let current = { weather: { suspended: false, message: null, since: null }, loaded: false };
const listeners = new Set();
let timer = null;
let inflight = null;

function publish(next) {
  current = next;
  listeners.forEach((fn) => fn(current));
}

export function refreshServiceStatus() {
  if (!inflight) {
    inflight = api('/api2/service-status')
      .then((d) => {
        const w = d && d.weather ? d.weather : {};
        publish({ weather: { suspended: w.suspended === true, message: w.message || null, since: w.since || null }, loaded: true });
      })
      // Server unreachable: keep what we had (the page shows its own connection errors).
      .catch(() => {})
      .finally(() => { inflight = null; });
  }
  return inflight;
}

/** Lets the Admin page show its change everywhere on this page at once. */
export function setWeatherStatus(weather) {
  publish({ weather: { suspended: weather.suspended === true, message: weather.message || null, since: weather.since || null }, loaded: true });
}

function onVisible() {
  if (document.visibilityState === 'visible') refreshServiceStatus();
}

export function useServiceStatus() {
  const [state, setState] = useState(current);
  useEffect(() => {
    listeners.add(setState);
    setState(current);
    if (listeners.size === 1) {
      refreshServiceStatus();
      timer = setInterval(refreshServiceStatus, POLL_MS);
      document.addEventListener('visibilitychange', onVisible);
    }
    return () => {
      listeners.delete(setState);
      if (!listeners.size) {
        clearInterval(timer);
        timer = null;
        document.removeEventListener('visibilitychange', onVisible);
      }
    };
  }, []);
  return state;
}

const lagos = (t) => {
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleString('en-GB', { timeZone: 'Africa/Lagos', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

/** True when the error from an /api2/weather call means weather is suspended. */
export function isWeatherSuspendedError(err) {
  return !!err && err.status === 503 && err.code === 'weather_suspended';
}

/**
 * The red "Weather API subscription expired" banner. Shows nothing while weather is on.
 * compact: a shorter version for the sign-in card.
 */
export function WeatherNotice({ compact = false }) {
  const { weather } = useServiceStatus();
  if (!weather.suspended) return null;
  const since = lagos(weather.since);
  return (
    <div className={`fx-wx-expired${compact ? ' compact' : ''}`} role="alert">
      <span className="fx-wx-expired-icon" aria-hidden="true">⚠</span>
      <div>
        <b>Weather API subscription expired</b>
        <p>{weather.message}</p>
        {!compact && since && <small>Weather paused since {since}. Live weather and forecasts will return when the subscription is renewed.</small>}
      </div>
    </div>
  );
}
