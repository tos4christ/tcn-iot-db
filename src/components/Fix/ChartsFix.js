/**
 * /charts_fix: the /charts dashboard (CanvasJS) rebuilt with SVG charts.
 *
 * Same live data and station formulas as /home_fix (it extends HomeFixView, so the figures always
 * match), shown the way /charts did, with these changes:
 *   - the 29-slice pie "Generation by Power Plants" becomes ranked bars with MW and share, which
 *     stay readable when a plant has a small share (the pie rounded those down to 0 %)
 *   - the two-axis "generation + frequency" chart becomes two charts, each with its own scale
 *   - the disconnected-plant cards become a list you can click for the meter detail
 *   - the trend keeps 2 hours (the old chart kept the last 25 points)
 * The listeners are removed when the page closes (the old page removed every page's listeners).
 */
import React from 'react';
import FixPage from './FixPage';
import { HomeFixView } from './HomeFix';
import { isConnected } from './StationTable';
import ModalFix from './ModalFix';
import { BarList } from './FixCharts';
import { TrendChart } from '../GencoPortal/charts';

class ChartsFixView extends HomeFixView {
  render() {
    const { generation, totalGeneration } = this.computeView();
    const freq = this.state.frequency && this.state.frequency.value ? this.state.frequency.value : null;
    const rows = generation.map((r) => ({ ...r, on: isConnected(r.status), value: Number(r.mw) }));
    const on = rows.filter((r) => r.on);
    const off = rows.filter((r) => !r.on);
    // Negative MW (station import) counts as 0, as in the total.
    const producing = on.filter((r) => Number.isFinite(r.value) && r.value > 0).sort((a, b) => b.value - a.value);
    const idle = on.length - producing.length;
    const trend = this.state.trend;
    const freqPoints = trend.filter((p) => p.f !== null).length;
    return (
      <main className="gx-main">
        <div className="fx-tiles">
          <div className="fx-tile hero"><span>Total IoT generation</span><b>{totalGeneration.toFixed(2)}<small>MW</small></b><em>{producing.length} plants generating</em></div>
          <div className="fx-tile"><span>Frequency</span><b>{freq !== null ? freq : '—'}<small>Hz</small></b><em>Grid frequency, live</em></div>
          <div className="fx-tile good"><span>Connected</span><b>{on.length}<small>of {rows.length}</small></b><em>Reporting in the last 30 s</em></div>
          <div className={`fx-tile ${off.length ? 'bad' : ''}`}><span>Not connected</span><b>{off.length}</b><em>{off.length ? 'Listed below' : 'All plants reporting'}</em></div>
        </div>

        {off.length > 0 && (
          <section className="gx-panel">
            <header><h2>Not connected</h2><span>No reading in the last 30 seconds · click for the last reading received</span></header>
            <div className="fx-quick">
              {off.map((r) => (
                <button key={r.label} type="button" onClick={() => this.setModalTrue(r.modal)} title="Show the last reading received">
                  <span className="fx-status off" style={{ border: 0, padding: 0, background: 'none' }}><i aria-hidden="true" />{r.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="gx-panel">
          <header>
            <h2>Generation by power plant</h2>
            <span>Share of the total IoT generation · click a bar for meter detail{idle > 0 ? ` · ${idle} connected plant${idle > 1 ? 's' : ''} at 0 MW not shown` : ''}</span>
          </header>
          <BarList
            items={producing.map((r) => ({ key: r.label, label: r.label, value: r.value, onClick: () => this.setModalTrue(r.modal) }))}
            total={totalGeneration} unit="MW" digits={2}
            emptyText="No plant is generating or connected yet. Readings arrive every few seconds." />
        </section>

        <div className="gx-grid-2">
          <section className="gx-panel">
            <header><h2>Real-time total generation</h2><span>Last 2 hours, sampled every 10 s since this page opened</span></header>
            <TrendChart key={trend.length > 1 ? 'drawn' : 'empty'} series={[{ key: 'gen', label: 'Total generation', color: '#3987e5', points: trend.map((p) => ({ t: p.t, v: p.gen })) }]} unit="MW" digits={2} height={260}
              emptyText="The trend starts 20 seconds after the page opens." />
          </section>
          <section className="gx-panel">
            <header><h2>Frequency</h2><span>Same period, own scale</span></header>
            <TrendChart key={freqPoints > 1 ? 'drawn' : 'empty'} series={[{ key: 'f', label: 'Frequency', color: '#3987e5', points: trend.filter((p) => p.f !== null).map((p) => ({ t: p.t, v: p.f })) }]} unit="Hz" digits={2} height={260}
              refLines={[{ v: 50, label: '50 Hz' }]} emptyText="Waiting for frequency readings." />
          </section>
        </div>
        {this.state.ModalState && <ModalFix setModalFalse={this.setModalFalse} modalData={this.state.modal_data} />}
      </main>
    );
  }
}

export default function ChartsFix() {
  return (
    <FixPage title="Generation charts" eyebrow="NCC live" live>
      {() => <ChartsFixView />}
    </FixPage>
  );
}
