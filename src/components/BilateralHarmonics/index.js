/**
 * Bilateral harmonics routes.
 *   /harmonics            all stations, ranked by grid impact
 *   /{slug}_harmonics     one station, e.g. /oau_harmonics
 *
 * In App.js, inside <Switch>:
 *   {harmonicsRoutes()}
 * To add a station, add a line to STATIONS in harmonicsConfig.js. Its page appears on its own.
 */
import React from 'react';
import { Route } from 'react-router-dom';
import HarmonicsPage, { HarmonicsSection } from './HarmonicsDashboard';
import { STATIONS } from './harmonicsConfig';

export const harmonicsRoutes = () => [
  <Route key="harmonics" exact path="/harmonics">
    <HarmonicsPage isLoggedIn={localStorage.getItem('isLoggedIn')} />
  </Route>,
  ...STATIONS.map((s) => (
    <Route key={s.slug} exact path={`/${s.slug}_harmonics`}>
      <HarmonicsPage slug={s.slug} isLoggedIn={localStorage.getItem('isLoggedIn')} />
    </Route>
  )),
];

export { HarmonicsSection };
export { HarmonicCells, HarmonicHeaders } from './HarmonicCells';
