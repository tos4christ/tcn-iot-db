/**
 * Banner at the top of the bilateral pages telling visitors that the Ikorodu-Sagamu load flow
 * diagram is further down, with a button that scrolls to it (AxisFlow's section, id AXIS_SECTION_ID).
 */
import React from 'react';

export const AXIS_SECTION_ID = 'axis-load-flow';

export function goToAxis() {
  const el = document.getElementById(AXIS_SECTION_ID);
  if (!el) return;
  // the page header is sticky: stop just below it so the section title is not hidden
  const header = document.querySelector('.gx-top');
  const offset = (header ? header.getBoundingClientRect().height : 0) + 12;
  let reduce = false;
  try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { /* old browser */ }
  window.scrollTo({ top: el.getBoundingClientRect().top + window.pageYOffset - offset, behavior: reduce ? 'auto' : 'smooth' });
  const heading = el.querySelector('h2');
  if (heading) heading.focus({ preventScroll: true });
}

export default function AxisJump() {
  return (
    <div className="ax-jump" role="note">
      <span className="ax-jump-icon" aria-hidden="true">⚡</span>
      <p>
        <b>New: Ikorodu–Sagamu load flow diagram.</b> A live diagram of Ikorodu–Sagamu Lines 1 and 2 (which genco and customer
        is on each line, the direction power flows, and power not accounted for) is further down this page.
      </p>
      <button type="button" className="gx-btn gx-btn-primary" onClick={goToAxis}>Go to load flow diagram ↓</button>
    </div>
  );
}
