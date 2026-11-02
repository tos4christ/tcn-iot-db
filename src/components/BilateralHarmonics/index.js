/**
 * Bilateral harmonics routes.
 *   /harmonics            all stations, ranked by grid impact
 *   /{slug}_harmonics     one station, e.g. /oau_harmonics
 *   /oau_steel_bilaterals OAU page behind a keypad
 *
 * In App.js, inside <Switch>:
 *   {harmonicsRoutes()}
 * To add a station, add a line to STATIONS in harmonicsConfig.js. Its page appears on its own.
 */
import React from 'react';
import { Route } from 'react-router-dom';
import HarmonicsPage, { HarmonicsSection } from './HarmonicsDashboard';
import { STATIONS } from './harmonicsConfig';
import OauSteelPage from './OauSteelPage';

export const harmonicsRoutes = () => [
  <Route key="oau-steel" exact path="/oau_steel_bilaterals">
    <OauSteelPage />
  </Route>,
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
export { default as BilateralTable } from './BilateralTable';
export { HarmonicCells, HarmonicHeaders } from './HarmonicCells';
