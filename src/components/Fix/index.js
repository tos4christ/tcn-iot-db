/**
 * The *_fix pages: replicas of existing pages with the bug fixes, server-side sign-in / sign-out,
 * the audit trail and the modern design. The original routes and components are not changed.
 *
 *   Modern rebuilds  /home_fix, /charts_fix, /history_fix, /average_fix, /profile_fix, /downtime_fix, /uptime_fix,
 *                    /collapse_fix, /tem_fix, /voltageprofile_fix, /weather_download_fix,
 *                    /sp_bilateral_fix, /audit_fix, /updatepassword_fix,
 *                    /signin_fix, /bilateral_signin_fix
 *   Fixed copies     /gridpageone_fix, /gridpagetwo_fix (wall screens: never signed out),
 *                    /nisonaspage_fix, /nisonaspage_sp_fix, /api/gridtable_fix, /bilateral_fix,
 *                    /bilaterals_fix, /mesl_bilaterals_fix, /fipl_bilaterals_fix,
 *                    /taopex_bilaterals_fix, /ndphc_bilaterals_fix, /sakete_bilaterals_fix
 *
 * Server side: tcn_radar_BE routes/auth2.js and routes/api2.js.
 */
import React, { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import Footer from '../Footer/Footer';
import FixPage from './FixPage';
import './fix.css';
const SignInFix = lazy(() => import('./SignInFix'));
const PasswordFix = lazy(() => import('./PasswordFix'));
const HomeFix = lazy(() => import('./HomeFix'));
const AnalyticsFix = lazy(() => import('./AnalyticsFix'));
const DownloadsFix = lazy(() => import('./DownloadsFix'));
const AuditFix = lazy(() => import('./AuditFix'));
const ChartsFix = lazy(() => import('./ChartsFix'));
const PageOneFix = lazy(() => import('./legacy/PageOneFix'));
const PageTwoFix = lazy(() => import('./legacy/PageTwoFix'));
const FullPageFix = lazy(() => import('./legacy/FullPageFix'));
const GridTableSPFix = lazy(() => import('./legacy/GridTable_SPFix'));
const GridTableFix = lazy(() => import('./legacy/GridTableFix'));
const BilateralPageFix = lazy(() => import('./legacy/BILATERAL_PageFix'));
const BilateralFix = lazy(() => import('./legacy/BilateralFix'));
const MESLPageFix = lazy(() => import('./legacy/MESL_PageFix'));
const FIPLPageFix = lazy(() => import('./legacy/FIPL_PageFix'));
const TAOPEXPageFix = lazy(() => import('./legacy/TAOPEX_PageFix'));
const NDPHCPageFix = lazy(() => import('./legacy/NDPHC_PageFix'));
const SaketePageFix = lazy(() => import('./legacy/Sakete_PageFix'));

// The copies were written for the old localStorage check; the server session is checked by
// FixPage before they render, so they are told the user is signed in.
const SIGNED_IN = 'true';

// Each page is downloaded only when it is opened, so the existing pages do not load any of this.
function Loading() {
  return <div className="gx-root fx-root"><div className="fx-screen"><div><span className="fx-spinner" aria-label="Loading" /></div></div></div>;
}

export function fixRoutes() {
  return [
    <Route key="signin_fix" exact path="/signin_fix"><Suspense fallback={<Loading />}><SignInFix realm="ncc" /></Suspense></Route>,
    <Route key="bilateral_signin_fix" exact path="/bilateral_signin_fix"><Suspense fallback={<Loading />}><SignInFix realm="bilateral" /></Suspense></Route>,
    <Route key="updatepassword_fix" exact path="/updatepassword_fix"><Suspense fallback={<Loading />}><PasswordFix /></Suspense></Route>,
    <Route key="home_fix" exact path="/home_fix"><Suspense fallback={<Loading />}><HomeFix /></Suspense></Route>,
    ...['history', 'average', 'profile', 'downtime', 'uptime'].map((m) => (
      <Route key={`${m}_fix`} exact path={`/${m}_fix`}><Suspense fallback={<Loading />}><AnalyticsFix mode={m} /></Suspense></Route>
    )),
    <Route key="tem_fix" exact path="/tem_fix"><Suspense fallback={<Loading />}><DownloadsFix kind="tem" /></Suspense></Route>,
    <Route key="voltageprofile_fix" exact path="/voltageprofile_fix"><Suspense fallback={<Loading />}><DownloadsFix kind="voltageprofile" /></Suspense></Route>,
    <Route key="collapse_fix" exact path="/collapse_fix"><Suspense fallback={<Loading />}><DownloadsFix kind="collapse" /></Suspense></Route>,
    <Route key="weather_download_fix" exact path="/weather_download_fix"><Suspense fallback={<Loading />}><DownloadsFix kind="weather" /></Suspense></Route>,
    <Route key="sp_bilateral_fix" exact path="/sp_bilateral_fix"><Suspense fallback={<Loading />}><DownloadsFix kind="bilateral" /></Suspense></Route>,
    <Route key="audit_fix" exact path="/audit_fix"><Suspense fallback={<Loading />}><AuditFix /></Suspense></Route>,
    <Route key="charts_fix" exact path="/charts_fix"><Suspense fallback={<Loading />}><ChartsFix /></Suspense></Route>,

    // Wall screens: signed in for good, no sign-out button, full-screen layout as before.
    <Route key="gridpageone_fix" exact path="/gridpageone_fix"><Suspense fallback={<Loading />}>
      <FixPage title="Grid page one" kiosk bare>{() => <div className="App"><PageOneFix isLoggedIn={SIGNED_IN} /></div>}</FixPage>
    </Suspense></Route>,
    <Route key="gridpagetwo_fix" exact path="/gridpagetwo_fix"><Suspense fallback={<Loading />}>
      <FixPage title="Grid page two" kiosk bare>{() => <div className="App"><PageTwoFix isLoggedIn={SIGNED_IN} /></div>}</FixPage>
    </Suspense></Route>,
    // NCC pages with their own layout under the modern top bar (sign-out included).
    <Route key="nisonaspage_fix" exact path="/nisonaspage_fix"><Suspense fallback={<Loading />}>
      <FixPage title="NISO NAS page" legacy live>{() => <><div className="App"><FullPageFix isLoggedIn={SIGNED_IN} /></div><Footer /></>}</FixPage>
    </Suspense></Route>,
    <Route key="nisonaspage_sp_fix" exact path="/nisonaspage_sp_fix"><Suspense fallback={<Loading />}>
      <FixPage title="System planning page" legacy live>{() => <><div className="App"><GridTableSPFix isLoggedIn={SIGNED_IN} /></div><Footer /></>}</FixPage>
    </Suspense></Route>,
    // Public pages, public as before (no sign-in on the originals).
    <Route key="gridtable_fix" path="/api/gridtable_fix"><Suspense fallback={<Loading />}><div><GridTableFix /><Footer /></div></Suspense></Route>,
    <Route key="bilateral_fix" exact path="/bilateral_fix"><Suspense fallback={<Loading />}><div><BilateralPageFix /></div><Footer /></Suspense></Route>,
    <Route key="bilaterals_fix" exact path="/bilaterals_fix"><Suspense fallback={<Loading />}><div><BilateralFix /></div><Footer /></Suspense></Route>,
    <Route key="mesl_bilaterals_fix" exact path="/mesl_bilaterals_fix"><Suspense fallback={<Loading />}><div className="mesl_background"><MESLPageFix isLoggedIn={SIGNED_IN} /></div></Suspense></Route>,
    <Route key="fipl_bilaterals_fix" exact path="/fipl_bilaterals_fix"><Suspense fallback={<Loading />}><div className="fipl_background"><FIPLPageFix isLoggedIn={SIGNED_IN} /></div></Suspense></Route>,
    <Route key="taopex_bilaterals_fix" exact path="/taopex_bilaterals_fix"><Suspense fallback={<Loading />}><div className="taopex_background"><TAOPEXPageFix isLoggedIn={SIGNED_IN} /></div></Suspense></Route>,
    <Route key="ndphc_bilaterals_fix" exact path="/ndphc_bilaterals_fix"><Suspense fallback={<Loading />}><div className="ndphc_background"><NDPHCPageFix isLoggedIn={SIGNED_IN} /></div></Suspense></Route>,
    <Route key="sakete_bilaterals_fix" exact path="/sakete_bilaterals_fix"><Suspense fallback={<Loading />}><div><div className="sakete_background"><SaketePageFix isLoggedIn={SIGNED_IN} /></div></div></Suspense></Route>,
  ];
}
