/**
 * Calls to the server-side session API (/auth2) and data API (/api2) used by every *_fix page.
 * The session lives in an HttpOnly cookie set by the server, so nothing sensitive is kept in
 * localStorage. Same-origin only: the build is served by the backend at nisonas.org.
 */
export class ApiError extends Error {
  constructor(status, message, code = null) {
    super(message);
    this.status = status;
    this.code = code; // the server's machine-readable reason, e.g. 'weather_suspended'
  }
}

const HEADERS = { 'X-Requested-With': 'nas-fix' };

/** { message, code } from an error answer ({ error, code } or { data: 'text' }); nulls when absent. */
async function readError(res) {
  try {
    const json = await res.json();
    if (json && (json.error || json.data)) {
      return {
        message: typeof json.error === 'string' ? json.error : (typeof json.data === 'string' ? json.data : null),
        code: typeof json.code === 'string' ? json.code : null,
      };
    }
  } catch (e) { /* not JSON */ }
  return { message: null, code: null };
}

async function errorFrom(res) {
  const { message, code } = await readError(res);
  return new ApiError(res.status, message || `The server answered ${res.status}.`, code);
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
  if (!res.ok) throw await errorFrom(res);
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
  if (!res.ok) throw await errorFrom(res);
  // Some old report endpoints answer 200 with a JSON message instead of a file.
  if (/application\/json/.test(res.headers.get('Content-Type') || '')) {
    throw new ApiError(200, (await readError(res)).message || 'The server returned no file.');
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
