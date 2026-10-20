/**
 * Genco portal configuration.
 *
 * Each Genco gets its own page at  nisonas.org/{slug}_units  and sees ONLY the stations listed
 * under `stations` (matched against the `id`/`name` field of the `generator_units` messages).
 *
 *   Username: the Genco slug, e.g.  egbin
 *   Password: {slug}_{PASSWORD_YEAR}_$, e.g.  egbin_2026_$
 *
 * Passwords are not stored here in plain text - only a SHA-256 fingerprint of
 * "niso-genco:{slug}:{password}". To change the year (or one Genco's password), regenerate the
 * fingerprints with:
 *   node -e "const c=require('crypto');const s='egbin';console.log(c.createHash('sha256').update('niso-genco:'+s+':'+s+'_2026_$').digest('hex'))"
 *
 * IMPORTANT: this is an interim, browser-only login until the move to the new platform. It keeps
 * casual visitors out, but it is NOT a security boundary: the live socket feed still sends every
 * station's data to any browser. Do not treat it as protecting confidential data.
 *
 * `units` lists the expected units so the page shows them before the first message arrives.
 * Station groupings follow the existing Generator Units page; edit freely.
 */
export const PASSWORD_YEAR = 2026;

export const GENCOS = [
  { slug: 'egbin', name: 'Egbin Power', type: 'Steam', stations: [{ id: 'egbinPs', units: ['st1', 'st2', 'st3', 'st4', 'st5', 'st6'] }],
    hash: 'ba727d082e3ca81583541026ca7923f664f5e79fc50315f8275fdaf1cec15125' },
  { slug: 'sapele', name: 'Sapele Power', type: 'Gas', stations: [{ id: 'sapele-gas', units: ['pb203'] }],
    hash: 'fe8d9fb38929e2c64554753dbf9f8288012d240826cac967524da1ca605ee5c5' },
  { slug: 'afam', name: 'Afam III & V Power', type: 'Gas', stations: [{ id: 'afamIIIPs', units: ['tm23', 'tm24', 'tm25'] }, { id: 'afamVPs', units: ['gt20'] }],
    hash: '97a6d1758a72a09f39417760d37133520e3768a60194b3a63249897914f47667' },
  { slug: 'afamvi', name: 'Afam VI Power', type: 'Gas/Steam', stations: [{ id: 'afamVIPs', units: ['gt12', 'gt13'] }],
    hash: 'b6dcba3ad5d08d4b4a9405e34274991f757e1a40bf2694f3d698beb36533e6cd' },
  { slug: 'afamiii', name: 'Afam III Fast Power (Delta)', type: 'Gas', stations: [{ id: 'afamIIIPs_delta1', units: ['tm11', 'tm12'] }, { id: 'afamIIIPs_delta2', units: ['tm27', 'tm28'] }],
    hash: 'a5bf38472ea9eda9b864c7dc425577a63420c365e3da7b93955b14183a74363a' },
  { slug: 'delta', name: 'Delta Power (Ughelli)', type: 'Gas',
    stations: [{ id: 'delta2', units: ['gt6'] }, { id: 'delta3', units: ['gt9', 'gt10', 'gt11', 'gt12', 'gt13'] },
      { id: 'delta4-1', units: ['gt16', 'gt17', 'gt18', 'gt19', 'gt20'] }, { id: 'delta4-2', units: ['gt15'] }],
    hash: 'f68242262e5fc9d258d851feb7b34686aad62c702a2c064e872df89d4ca10998' },
  { slug: 'dadinkowa', name: 'Dadin Kowa Hydro', type: 'Hydro', stations: [{ id: 'dadinkowa', units: ['unit1', 'unit2'] }],
    hash: '50923a9e2dfcbaedff470f95566481b73614343d3b010719c27f0d8009d13dc4' },
  { slug: 'okpai', name: 'Okpai Power', type: 'Gas/Steam', stations: [{ id: 'okpai_1', units: ['gt11', 'gt12'] }, { id: 'okpai_2', units: ['st18'] }],
    hash: 'd6ca6196bb72c7eaf18c229555832f3d7a67355ba3c9716be0e28907d352fffd' },
  { slug: 'paras', name: 'Paras Energy', type: 'Gas',
    stations: [{ id: 'paras_1', units: ['gt1', 'gt2', 'gt3', 'gt4', 'gt7', 'gt8'] }, { id: 'paras_2', units: ['gt5', 'gt6', 'gt9', 'gt10', 'gt11', 'gt12'] }],
    hash: '48fb4df3fd6a0f596e1725a09bdc67ce17d76eb02172cb2e358ab8bf93af0db5' },
  { slug: 'shiroro', name: 'Shiroro Hydro', type: 'Hydro', stations: [{ id: 'shiroroPs', units: ['411g1', '411g2', '411g3', '411g4'] }],
    hash: '554580c403e27bbe94c6810fabafbc015989674e9a1568c55b80b29e65dd6ce0' },
  { slug: 'zungeru', name: 'Zungeru Hydro', type: 'Hydro', stations: [{ id: 'zungeru', units: ['g1', 'g2', 'g3', 'g4'] }],
    hash: '29103e468cdcf2e518a9a279cbcee00c35df9edac07ff1a4f65375900a20e561' },
  { slug: 'kainji', name: 'Kainji Hydro', type: 'Hydro', stations: [{ id: 'kainjiPs', units: ['1g5', '1g6', '1g7', '1g9', '1g11', '1g12'] }],
    hash: '519caf409e63c46e40a953dd999070a2fe867221ac036d63a8e609dfbe396d7f' },
  { slug: 'jebba', name: 'Jebba Hydro', type: 'Hydro', stations: [{ id: 'jebbaPs', units: ['2g1', '2g2', '2g3', '2g4', '2g5', '2g6'] }],
    hash: 'c908f29eb5c1726b32b50154eb06a28a8d504b49e7efae441aea704649f2b15c' },
  { slug: 'geometric', name: 'Geometric Power (Aba)', type: 'Gas',
    stations: [{ id: 'geometricPlant1', units: ['gt1'] }, { id: 'geometricPlant2', units: ['gt2'] }, { id: 'geometricPlant3', units: ['gt3'] }],
    hash: '741eb88ae1dd8763819f2086e197e9c45b071b16fcfec749ae620374c5f07fe8' },
  { slug: 'ibom', name: 'Ibom Power', type: 'Gas', stations: [{ id: 'ibom', aliases: ['ibom power'], units: ['gt3'] }],
    hash: 'b1b24daca94605591401b5861a02a1221208ef5a301a1ecae7af87bffbdd7d18' },
  { slug: 'riversipp', name: 'Rivers IPP', type: 'Gas', stations: [{ id: 'cnl', units: ['gt21'] }],
    hash: '15e3bd236180e7ebf3806dda67ced4425ceb36bed4ae21eb800a671341876454' },
  { slug: 'mepp', name: 'MEPP', type: 'Gas', stations: [{ id: 'mepp', units: ['gt1'] }],
    hash: '37a3b94920e65e08d20cf07368b6313ddcb7a5c85bae8d306660c356f636e57c' },
  { slug: 'olorunsogo', name: 'Olorunsogo Gas', type: 'Gas',
    stations: [{ id: 'olorunsogoGas1', units: ['gt1', 'gt2'] }, { id: 'olorunsogoGas3', units: ['gt3', 'gt4'] },
      { id: 'olorunsogoGas5', units: ['gt5', 'gt6'] }, { id: 'olorunsogoGas7', units: ['gt7', 'gt8'] }],
    hash: '31e98d2825f3e18c33c642a400a40568563b006121aaa7a3dce6b91fedd6e510' },
];

export const gencoBySlug = (slug) => GENCOS.find((g) => g.slug === slug) || null;
