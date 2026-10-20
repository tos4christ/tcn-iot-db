/**
 * Genco portal routes: one route per Genco at /{slug}_units, e.g. /egbin_units, /kainji_units.
 *
 * In App.js:
 *   import { gencoRoutes } from './components/GencoPortal';
 *   ...
 *   <Switch>
 *     {gencoRoutes}
 *     ...your existing routes...
 *   </Switch>
 */
import React from 'react';
import { Route } from 'react-router-dom';
import GencoPortal from './GencoPortal';
import { GENCOS } from './gencos';

export const gencoRoutes = GENCOS.map((g) => (
  <Route key={g.slug} exact path={`/${g.slug}_units`}>
    <GencoPortal slug={g.slug} />
  </Route>
));

export { GENCOS } from './gencos';
export default GencoPortal;
