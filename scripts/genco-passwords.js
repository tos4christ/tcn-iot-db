#!/usr/bin/env node
/**
 * Issues new random passwords for the Genco portal logins.
 *
 *   node scripts/genco-passwords.js [output-file] [slug ...]
 *
 * - Generates a random 16-character password per Genco (or only for the slugs listed).
 * - Writes ONLY the SHA-256 fingerprints into src/components/GencoPortal/gencos.js.
 * - Writes the usernames and passwords to an Excel file (if the "xlsx" package can be loaded,
 *   e.g. XLSX_MODULE=path/to/node_modules/xlsx) or otherwise a CSV file.
 *   Default output: ../Genco portal credentials.xlsx (outside this project, so it is never
 *   built into the website). Keep that file private.
 * Then rebuild the app (npm run build) for the new passwords to take effect.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CONFIG = path.join(ROOT, 'src/components/GencoPortal/gencos.js');
const SITE = 'https://nisonas.org';

// No look-alike characters (I l 1 O 0) and no characters that break CSV/Excel or URLs.
const UPPER = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const LOWER = 'abcdefghijkmnpqrstuvwxyz';
const DIGIT = '23456789';
const SYMBOL = '!#%*?@$';
const ALL = UPPER + LOWER + DIGIT + SYMBOL;
const pick = (set) => set[crypto.randomInt(set.length)];

function makePassword(length = 16) {
  const chars = [pick(UPPER), pick(LOWER), pick(DIGIT), pick(SYMBOL), pick(DIGIT)];
  while (chars.length < length) chars.push(pick(ALL));
  for (let i = chars.length - 1; i > 0; i -= 1) { // Fisher-Yates shuffle
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  if (!/[A-Za-z]/.test(chars[0])) { // start with a letter (Excel never treats it as a formula)
    const k = chars.findIndex((c) => /[A-Za-z]/.test(c));
    [chars[0], chars[k]] = [chars[k], chars[0]];
  }
  return chars.join('');
}

const fingerprint = (slug, password) => crypto.createHash('sha256').update(`niso-genco:${slug}:${password}`).digest('hex');

function main() {
  const args = process.argv.slice(2);
  const out = args[0] && !/^[a-z0-9]+$/.test(args[0]) ? path.resolve(args.shift()) : path.resolve(ROOT, '..', 'Genco portal credentials.xlsx');
  const only = new Set(args);

  let src = fs.readFileSync(CONFIG, 'utf8');
  const entries = [...src.matchAll(/\{ slug: '([a-z0-9]+)', name: '([^']+)'/g)].map((m) => ({ slug: m[1], name: m[2] }));
  if (!entries.length) throw new Error('No Gencos found in gencos.js');

  const issued = [];
  for (const g of entries) {
    if (only.size && !only.has(g.slug)) continue;
    const password = makePassword();
    const block = new RegExp(`(\\{ slug: '${g.slug}',[\\s\\S]*?hash: ')[0-9a-f]{64}(')`);
    if (!block.test(src)) throw new Error(`No hash found for ${g.slug}`);
    src = src.replace(block, `$1${fingerprint(g.slug, password)}$2`);
    issued.push({ Genco: g.name, Route: `${SITE}/${g.slug}_units`, Username: g.slug, Password: password });
  }
  fs.writeFileSync(CONFIG, src);

  const issuedOn = new Date().toISOString().slice(0, 10);
  let xlsx = null;
  try { xlsx = require(process.env.XLSX_MODULE || 'xlsx'); } catch (e) { /* fall back to CSV */ }
  if (xlsx && out.endsWith('.xlsx')) {
    const rows = [
      ['NISO Genco Portal - login credentials'],
      [`Issued ${issuedOn}. Confidential: give each Genco only its own row.`],
      [],
      ['Genco', 'Page (route)', 'Username', 'Password'],
      ...issued.map((r) => [r.Genco, r.Route, r.Username, r.Password]),
    ];
    const ws = xlsx.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 30 }, { wch: 40 }, { wch: 14 }, { wch: 22 }];
    ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }];
    for (let r = 4; r < rows.length; r += 1) { // keep passwords as plain text
      const cell = ws[xlsx.utils.encode_cell({ r, c: 3 })];
      if (cell) { cell.t = 's'; cell.z = '@'; }
    }
    ws['!autofilter'] = { ref: `A4:D${rows.length}` };
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Credentials');
    xlsx.writeFile(wb, out);
  } else {
    const csv = out.replace(/\.xlsx$/, '.csv');
    fs.writeFileSync(csv, ['Genco,Page (route),Username,Password', ...issued.map((r) => [r.Genco, r.Route, r.Username, r.Password].join(','))].join('\n'));
    console.log('xlsx package not available - wrote CSV instead');
  }
  console.log(`Issued ${issued.length} password(s). Fingerprints updated in ${path.relative(ROOT, CONFIG)}.`);
  console.log(`Credentials file: ${out}`);
  console.log('Rebuild the app (npm run build) for the new passwords to take effect.');
}

main();
