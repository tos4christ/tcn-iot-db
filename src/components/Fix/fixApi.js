/**
 * Calls to the server-side session API (/auth2) and data API (/api2) used by every *_fix page.
 * The session lives in an HttpOnly cookie set by the server, so nothing sensitive is kept in
 * localStorage. Same-origin only: the build is served by the backend at nisonas.org.
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const HEADERS = { 'X-Requested-With': 'nas-fix' };

async function readError(res) {
  try {
    const json = await res.json();
    if (json && (json.error || json.data)) return typeof json.error === 'string' ? json.error : (typeof json.data === 'string' ? json.data : null);
  } catch (e) { /* not JSON */ }
  return null;
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { ...HEADERS, 'Content-Type': 'application/json' } : HEADERS,
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError(0, 'Cannot reach the server. Check the network connection.');
  }
  if (!res.ok) throw new ApiError(res.status, (await readError(res)) || `The server answered ${res.status}.`);
  const json = await res.json().catch(() => null);
  return json ? json.data : null;
}

/** Fetches a file (Excel or CSV) and saves it. Resolves to the saved file name. */
export async function downloadFile(path, { method = 'POST', body, fallbackName = 'download' } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: 'same-origin',
      headers: body ? { ...HEADERS, 'Content-Type': 'application/json' } : HEADERS,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new ApiError(0, 'Cannot reach the server. Check the network connection.');
  }
  if (!res.ok) throw new ApiError(res.status, (await readError(res)) || `The server answered ${res.status}.`);
  // Some old report endpoints answer 200 with a JSON message instead of a file.
  if (/application\/json/.test(res.headers.get('Content-Type') || '')) {
    throw new ApiError(200, (await readError(res)) || 'The server returned no file.');
  }
  const blob = await res.blob();
  if (!blob.size) throw new ApiError(200, 'The server returned an empty file. There may be no data for that date.');
  const m = /filename="?([^";]+)"?/i.exec(res.headers.get('Content-Disposition') || '');
  const name = m ? m[1] : fallbackName;
  saveBlob(blob, name);
  return name;
}

export function saveBlob(blob, name) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(url), 1000);
}

/** rows: array of arrays (first row = header). */
export function saveCsv(rows, name) {
  const cell = (v) => (v === null || v === undefined ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  saveBlob(new Blob([rows.map((r) => r.map(cell).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' }), name);
}
