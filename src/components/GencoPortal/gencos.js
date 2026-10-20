/**
 * Genco portal configuration.
 *
 * Each Genco gets its own page at  nisonas.org/{slug}_units  and sees ONLY the stations listed
 * under `stations` (matched against the `id`/`name` field of the `generator_units` messages).
 *
 *   Username: the Genco slug, e.g.  egbin
 *   Password: a random 16-character password issued with scripts/genco-passwords.js
 *
 * Passwords are not stored here in plain text - only a SHA-256 fingerprint of
 * "niso-genco:{slug}:{password}". To issue new passwords (all, or some Gencos), run:
 *   node scripts/genco-passwords.js                 (all Gencos)
 *   node scripts/genco-passwords.js egbin kainji    (only these)
 * It updates the fingerprints below and writes the credentials file; then rebuild the app.
 *
 * IMPORTANT: this is an interim, browser-only login until the move to the new platform. It keeps
 * casual visitors out, but it is NOT a security boundary: the live socket feed still sends every
 * station's data to any browser. Do not treat it as protecting confidential data.
 *
 * `units` lists the expected units so the page shows them before the first message arrives.
 * Station groupings follow the existing Generator Units page; edit freely.
 */
// Year shown in the footer of the sign-in page.
export const PASSWORD_YEAR = 2026;

export const GENCOS = [
  { slug: 'egbin', name: 'Egbin Power', type: 'Steam', stations: [{ id: 'egbinPs', units: ['st1', 'st2', 'st3', 'st4', 'st5', 'st6'] }],
    hash: '6d51d193902c1a8817013f237474016b4d5aaedde2ff7b330d4c8edcf67dff35' },
  { slug: 'sapele', name: 'Sapele Power', type: 'Gas', stations: [{ id: 'sapele-gas', units: ['pb203'] }],
    hash: 'd07b1163ca5ed8a106c4f12ebaac5a3cc559f58805d062b8eadc304b7aadaccc' },
  { slug: 'afam', name: 'Afam III & V Power', type: 'Gas', stations: [{ id: 'afamIIIPs', units: ['tm23', 'tm24', 'tm25'] }, { id: 'afamVPs', units: ['gt20'] }],
    hash: '745f5763b5c2f629dde93faecdf0fa4023c6326b309387f18bd8c46bf81ed6d1' },
  { slug: 'afamvi', name: 'Afam VI Power', type: 'Gas/Steam', stations: [{ id: 'afamVIPs', units: ['gt12', 'gt13'] }],
    hash: '6e9e29b5538b66a594097f4bc06d2ceef3b20c0f69b91982d7d0123995491383' },
  { slug: 'afamiii', name: 'Afam III Fast Power (Delta)', type: 'Gas', stations: [{ id: 'afamIIIPs_delta1', units: ['tm11', 'tm12'] }, { id: 'afamIIIPs_delta2', units: ['tm27', 'tm28'] }],
    hash: '7fba63d769831ba967ca6562a5292c9d4fb4ca0e595356f16af976da21e22ef5' },
  { slug: 'delta', name: 'Delta Power (Ughelli)', type: 'Gas',
    stations: [{ id: 'delta2', units: ['gt6'] }, { id: 'delta3', units: ['gt9', 'gt10', 'gt11', 'gt12', 'gt13'] },
      { id: 'delta4-1', units: ['gt16', 'gt17', 'gt18', 'gt19', 'gt20'] }, { id: 'delta4-2', units: ['gt15'] }],
    hash: 'a94dbefe456afa6cddae1e03d0200277bdf6a3d2d63a3b02d12fb783e7ace9f9' },
  { slug: 'dadinkowa', name: 'Dadin Kowa Hydro', type: 'Hydro', stations: [{ id: 'dadinkowa', units: ['unit1', 'unit2'] }],
    hash: '524b4e8758b054d62ebd095969ceac6ef7fd27b1a7590db0c45ee95a768f2c9c' },
  { slug: 'okpai', name: 'Okpai Power', type: 'Gas/Steam', stations: [{ id: 'okpai_1', units: ['gt11', 'gt12'] }, { id: 'okpai_2', units: ['st18'] }],
    hash: 'd80faf22aad6f64994b2a4b25269a82a13274053768c609d24ed003090b0fc56' },
  { slug: 'paras', name: 'Paras Energy', type: 'Gas',
    stations: [{ id: 'paras_1', units: ['gt1', 'gt2', 'gt3', 'gt4', 'gt7', 'gt8'] }, { id: 'paras_2', units: ['gt5', 'gt6', 'gt9', 'gt10', 'gt11', 'gt12'] }],
    hash: '7408dd812ba989dcfd9b07e8a777d7d1a637e597b49fb6ecb64005d99fab1a22' },
  { slug: 'shiroro', name: 'Shiroro Hydro', type: 'Hydro', stations: [{ id: 'shiroroPs', units: ['411g1', '411g2', '411g3', '411g4'] }],
    hash: '5ce612ed56a5960817f777d7b0c7bf3214ff347fa1e496b620ce63797e1f9b1b' },
  { slug: 'zungeru', name: 'Zungeru Hydro', type: 'Hydro', stations: [{ id: 'zungeru', units: ['g1', 'g2', 'g3', 'g4'] }],
    hash: '2b182c797e5515a13e493e1ff5dc3d691a929ff105a7e28fed4791f6ecf7470a' },
  { slug: 'kainji', name: 'Kainji Hydro', type: 'Hydro', stations: [{ id: 'kainjiPs', units: ['1g5', '1g6', '1g7', '1g9', '1g11', '1g12'] }],
    hash: '327ec2dff63f2ea5a37c1ebbbc7fafde5b7b654d2477fd121618d087f5920647' },
  { slug: 'jebba', name: 'Jebba Hydro', type: 'Hydro', stations: [{ id: 'jebbaPs', units: ['2g1', '2g2', '2g3', '2g4', '2g5', '2g6'] }],
    hash: 'cbc5a50a09097feb7311f5eeb8f41a2ec932ecda20bb1d233fded89995900b04' },
  { slug: 'geometric', name: 'Geometric Power (Aba)', type: 'Gas',
    stations: [{ id: 'geometricPlant1', units: ['gt1'] }, { id: 'geometricPlant2', units: ['gt2'] }, { id: 'geometricPlant3', units: ['gt3'] }],
    hash: 'a76c2d70cfbd48fc0e16426097dcceb4d2de7c3cee33e439ad505820bd4c07b0' },
  { slug: 'ibom', name: 'Ibom Power', type: 'Gas', stations: [{ id: 'ibom', aliases: ['ibom power'], units: ['gt3'] }],
    hash: '1bc04816946b7072715b97b18798a920d4d7fe768e507d75c164368e812ae237' },
  { slug: 'riversipp', name: 'Rivers IPP', type: 'Gas', stations: [{ id: 'cnl', units: ['gt21'] }],
    hash: '5618cc9883c87842a4da74d0066a4767fe08a0498a77d81c015a8a6123ed6d1d' },
  { slug: 'mepp', name: 'MEPP', type: 'Gas', stations: [{ id: 'mepp', units: ['gt1'] }],
    hash: '58bd68b2693f859b7f5375a07a65758d14306a473e3046643debfed2b0619b9e' },
  { slug: 'olorunsogo', name: 'Olorunsogo Gas', type: 'Gas',
    stations: [{ id: 'olorunsogoGas1', units: ['gt1', 'gt2'] }, { id: 'olorunsogoGas3', units: ['gt3', 'gt4'] },
      { id: 'olorunsogoGas5', units: ['gt5', 'gt6'] }, { id: 'olorunsogoGas7', units: ['gt7', 'gt8'] }],
    hash: '46ae14eb4c42ac1af25cb39e654af7a1d6ed7ca5973897f5dbbb268d08e8ccdc' },
];

export const gencoBySlug = (slug) => GENCOS.find((g) => g.slug === slug) || null;
