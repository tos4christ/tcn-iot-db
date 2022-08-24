export default (state_data) => {
    if (!state_data) {
        return;
    }
    // console.log(state_data, 'the state data');
    // return;
    const ekim_ek1m = state_data.ekim.lines ? state_data.ekim.lines.filter(line => line.id === "ek1m").td : {mw: null, V: null};
    const eket_e21m = state_data.eket.lines ? state_data.eket.lines.filter(line => line.id === "e21m").td : {mw: null, V: null};
    const eket_e22m = state_data.eket.lines ? state_data.eket.lines.filter(line => line.id === "e22m").td : {mw: null, V: null};
    const kainjiTs_k1j = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k1j").td : {mw: null, V: null};
    const kainjiTs_k2j = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k2j").td : {mw: null, V: null};
    const kainjiTs_k3r = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k3r").td : {mw: null, V: null};
    const kainjiTs_k1f = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k1f").td : {mw: null, V: null};
    const egbinPs_st1 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const egbinPs_st2 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st2").gd : {mw: null, V: null};
    const egbinPs_st3 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st3").gd : {mw: null, V: null};
    const egbinPs_st4 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st4").gd : {mw: null, V: null};
    const egbinPs_st5 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st5").gd : {mw: null, V: null};
    const egbinPs_st6 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st6").gd : {mw: null, V: null};
    const shiroroPs_411g1 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g1").gd : {mw: null, V: null};
    const shiroroPs_411g2 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g2").gd : {mw: null, V: null};
    const shiroroPs_411g3 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g3").gd : {mw: null, V: null};
    const shiroroPs_411g4 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g4").gd : {mw: null, V: null};
    const afamIv_vPs_gt17 = state_data.afamIv_vPs.units ? state_data.afamIv_vPs.units.filter(line => line.id === "gt17").td : {mw: null, V: null};
    const afamIv_vPs_gt18 = state_data.afamIv_vPs.units ? state_data.afamIv_vPs.units.filter(line => line.id === "gt18").td : {mw: null, V: null};
    const omotosho1_tr1 = state_data.omotosho1.lines ? state_data.omotosho1.lines.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const omotosho1_tr2 = state_data.omotosho1.lines ? state_data.omotosho1.lines.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const omotosho2_tr3 = state_data.omotosho2.lines ? state_data.omotosho2.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const omotosho2_tr4 = state_data.omotosho2.lines ? state_data.omotosho2.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const deltaGs_g3b = state_data.deltaGs.lines ? state_data.deltaGs.lines.filter(line => line.id === "g3b").td : {mw: null, V: null};
    const deltaGs_s4g = state_data.deltaGs.lines ? state_data.deltaGs.lines.filter(line => line.id === "s4g").td : {mw: null, V: null};
    const okpaiGs_k1t = state_data.okpaiGs.lines ? state_data.okpaiGs.lines.filter(line => line.id === "k1t").td : {mw: null, V: null};
    const okpaiGs_k2t = state_data.okpaiGs.lines ? state_data.okpaiGs.lines.filter(line => line.id === "k2t").td : {mw: null, V: null};
    const jebbaTs_b8j = state_data.jebbaTs.lines ? state_data.jebbaTs.lines.filter(line => line.id === "b8j").td : {mw: null, V: null};
    const jebbaTs_b9j = state_data.jebbaTs.lines ? state_data.jebbaTs.lines.filter(line => line.id === "b9j").td : {mw: null, V: null};    
    const alaoji_l7a = state_data.alaoji.lines ? state_data.alaoji.lines.filter(line => line.id === "l7a").td : {mw: null, V: null};
    const alaoji_l8a = state_data.alaoji.lines ? state_data.alaoji.lines.filter(line => line.id === "l8a").td : {mw: null, V: null};
    const afamViTs_ada200 = state_data.afamViTs.lines ? state_data.afamViTs.lines.filter(line => line.id === "ada200").td : {mw: null, V: null};
    const afamViTs_adb200 = state_data.afamViTs.lines ? state_data.afamViTs.lines.filter(line => line.id === "adb200").td : {mw: null, V: null};
    const phMain_m21p = state_data.phMain.lines ? state_data.phMain.lines.filter(line => line.id === "m21p").td : {mw: null, V: null};
    const odukpaniGs_d1b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d1b").td : {mw: null, V: null};
    const odukpaniGs_d2b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d2b").td : {mw: null, V: null};
    const omotoshoNippPs_tr1 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const omotoshoNippPs_tr2 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const omotoshoNippPs_tr3 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const omotoshoNippPs_tr4 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const sapeleNippPs_st1 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const sapeleNippPs_st3 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "st3").gd : {mw: null, V: null};
    const sapeleNippPs_gt1 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const sapeleNippPs_gt2 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt2").gd : {mw: null, V: null};
    const sapeleNippPs_gt3 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt3").gd : {mw: null, V: null};
    const sapeleNippPs_gt4 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt4").gd : {mw: null, V: null};
    const omokuPs1_o1r = state_data.omokuPs1.lines ? state_data.omokuPs1.lines.filter(line => line.id === "o1r").td : {mw: null, V: null};
    const riversIppPs_gt1 = state_data.riversIppPs.units ? state_data.riversIppPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const ikotEkpene_d1k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "d1k").td : {mw: null, V: null};
    const ikotEkpene_d2k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "d2k").td : {mw: null, V: null};
    const ikotEkpene_k1u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k1u").td : {mw: null, V: null};
    const ikotEkpene_k2u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k2u").td : {mw: null, V: null};
    const ikotEkpene_k3u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k3u").td : {mw: null, V: null};
    const ikotEkpene_k4u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k4u").td : {mw: null, V: null};
    const ikotEkpene_a1k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "a1k").td : {mw: null, V: null};
    const ikotEkpene_a2k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "a2k").td : {mw: null, V: null};
    const gereguPs_r1j = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "r1j").gd : {mw: null, V: null};
    const gereguPs_r2j = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "r2j").gd : {mw: null, V: null};
    const gereguPs_gt11 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt11").gd : {mw: null, V: null};
    const gereguPs_gt12 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt12").gd : {mw: null, V: null};
    const gereguPs_gt13 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt13").gd : {mw: null, V: null};    
    const delta3_tr5 = state_data.delta3.lines ? state_data.delta3.lines.filter(line => line.id === "tr5").gd : {mw: null, V: null};
    const delta3_tr6 = state_data.delta3.lines ? state_data.delta3.lines.filter(line => line.id === "tr6").gd : {mw: null, V: null};
    const delta2_tr3 = state_data.delta2.lines ? state_data.delta2.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const delta2_tr4 = state_data.delta2.lines ? state_data.delta2.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const olorunsogo1_tr1 = state_data.olorunsogo1.lines ? state_data.olorunsogo1.lines.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const olorunsogo1_tr2 = state_data.olorunsogo1.lines ? state_data.olorunsogo1.lines.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const ihovborNippPs_ohl1 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "ohl1").gd : {mw: null, V: null};
    const ihovborNippPs_ohl2 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "ohl2").gd : {mw: null, V: null};
    const ihovborNippPs_gt1 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const ihovborNippPs_gt2 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt2").gd : {mw: null, V: null};
    const ihovborNippPs_gt3 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt3").gd : {mw: null, V: null};
    const ihovborNippPs_gt4 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt4").gd : {mw: null, V: null};
    const parasEnergyPs_132cb = state_data.parasEnergyPs.lines ? state_data.parasEnergyPs.lines.filter(line => line.id === "132cb").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_r2a = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "r2a").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_r1w = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "r1w").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_tr3 = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_tr4 = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const gbarain_st1 = state_data.gbarain.units ? state_data.gbarain.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const gbarain_st2 = state_data.gbarain.units ? state_data.gbarain.units.filter(line => line.id === "st2").gd : {mw: null, V: null};
    const dadinKowaGs_w21b = state_data.dadinKowaGs.lines ? state_data.dadinKowaGs.lines.filter(line => line.id === "w21b").td : {mw: null, V: null};
    const dadinKowaGs_w23e = state_data.dadinKowaGs.lines ? state_data.dadinKowaGs.lines.filter(line => line.id === "w23e").td : {mw: null, V: null};
    const lokojaTs_j1l = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "j1l").td : {mw: null, V: null};
    const lokojaTs_j2l = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "j2l").td : {mw: null, V: null};
    const lokojaTs_l6g = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "l6g").td : {mw: null, V: null};
    const lokojaTs_l7g = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "l7g").td : {mw: null, V: null};
    const gwagwalada_g5b = state_data.gwagwalada.lines ? state_data.gwagwalada.lines.filter(line => line.id === "g5b").td : {mw: null, V: null};
    const gwagwalada_r3g = state_data.gwagwalada.lines ? state_data.gwagwalada.lines.filter(line => line.id === "r3g").td : {mw: null, V: null};
    const asaba_b3d = state_data.asaba.lines ? state_data.asaba.lines.filter(line => line.id === "b3d").td : {mw: null, V: null};
    const asaba_d3t = state_data.asaba.lines ? state_data.asaba.lines.filter(line => line.id === "d3t").td : {mw: null, V: null};
    const ugwuaji_u1a = state_data.gbarain.lines ? state_data.gbarain.lines.filter(line => line.id === "u1a").td : {mw: null, V: null};
    const ugwuaji_u2a = state_data.gbarain.lines ? state_data.gbarain.lines.filter(line => line.id === "u2a").td : {mw: null, V: null};

    // Calculate the stations
    // console.log(ekim_ek1m, eket_e21m, eket_e22m, 'check the equipment')
    const eket_mw =  (eket_e21m.mw ? eket_e21m.mw : 0) + (eket_e22m.mw ? eket_e22m.mw : 0);
    const eket_kv =  eket_e21m.V ? eket_e21m.V : eket_e22m.V ? eket_e22m.V : 0;
    const phmain_mw = phMain_m21p.mw ? phMain_m21p.mw : 0;
    const phmain_kv = phMain_m21p.V ? phMain_m21p.V : 0;
    const dadkowa_mw = (dadinKowaGs_w21b.mw ? dadinKowaGs_w21b.mw : 0) + (dadinKowaGs_w23e.mw ? dadinKowaGs_w23e.mw : 0);
    const dadkowa_kv = dadinKowaGs_w21b.V ? dadinKowaGs_w21b.V : 0;
    const lokojaTs_mw = (lokojaTs_j1l.mw ? lokojaTs_j1l.mw : 0 + lokojaTs_j2l.mw ? lokojaTs_j2l.mw : 0) - 
                     (lokojaTs_l6g.mw ? lokojaTs_l6g.mw : 0 + lokojaTs_l7g.mw ? lokojaTs_l7g.mw : 0);
    const lokojaTs_kv = lokojaTs_j1l.V ? lokojaTs_j1l.V : 0;

    
    const station_array = { 
        'EKET': {mw: Number(eket_mw).toFixed(2), kv: eket_kv},
        'PORT-HARCOURT MAIN' : {mw: Number(phmain_mw).toFixed(2), kv: phmain_kv},
        'LOKOJA TS' : {mw: Number(lokojaTs_mw).toFixed(2), kv: lokojaTs_kv},
        // 'EKIM' : {mw: Number(ekim_ek1m.mw ? ekim_ek1m.mw : 0).toFixed(2), kv: ekim_ek1m.V ? ekim_ek1m.V : 0},
        // 'IKOT EKPENE' : {mw: Number(
        //     (ikotEkpene_a1k.mw?ikotEkpene_a1k.mw:0 + ikotEkpene_a2k.mw?ikotEkpene_a2k.mw:0 + ikotEkpene_d1k.mw?ikotEkpene_d1k.mw:0 + ikotEkpene_d2k.mw?ikotEkpene_d2k.mw:0) - 
        //     (ikotEkpene_k1u.mw?ikotEkpene_k1u.mw:0 + ikotEkpene_k2u.mw?ikotEkpene_k2u.mw:0 + ikotEkpene_k3u.mw?ikotEkpene_k3u.mw:0 + ikotEkpene_k4u.mw?ikotEkpene_k4u.mw:0)
        //         ).toFixed(2), kv: ikotEkpene_d1k.V?ikotEkpene_d1k.V:0}, 
        // 'GWAGWALADA' : {mw: Number(gwagwalada_g5b.mw?gwagwalada_g5b.mw:0 + gwagwalada_r3g.mw? gwagwalada_r3g.mw:0).toFixed(2), kv: gwagwalada_g5b.V?gwagwalada_g5b.V:0},
        // 'UGWUAJI' : {mw: Number(ugwuaji_u1a.mw?ugwuaji_u1a.mw:0 + ugwuaji_u2a.mw?ugwuaji_u2a.mw:0).toFixed(2), kv: ugwuaji_u1a.V?ugwuaji_u1a.V:0},
        // 'ASABA' : {mw: Number(asaba_b3d.mw?asaba_b3d.mw:0 + asaba_d3t.mw?asaba_d3t.mw:0).toFixed(2), kv: asaba_b3d.V?asaba_b3d.V:0},
        // 'SHIRORO (HYDRO)' : {mw: Number(
        //     shiroroPs_411g1.mw?shiroroPs_411g1.mw:0 + shiroroPs_411g2.mw?shiroroPs_411g2.mw:0 + shiroroPs_411g3.mw?shiroroPs_411g3.mw:0 + shiroroPs_411g4.mw?shiroroPs_411g4.mw:0   
        //         ).toFixed(2), kv: shiroroPs_411g1.V?shiroroPs_411g1.V:0},
        // 'AFAM IV & V (GAS)' : {mw: Number(afamViTs_ada200.mw?afamViTs_ada200.mw:0 + afamViTs_adb200.mw?afamViTs_adb200.mw:0).toFixed(2), kv: afamViTs_ada200.V?afamViTs_ada200.V:0},
        // 'KAINJI (HYDRO)' : {mw: Number(
        //     kainjiTs_k1f.mw?kainjiTs_k1f.mw:0 + kainjiTs_k1j.mw?kainjiTs_k1j.mw:0 + kainjiTs_k2j.mw?kainjiTs_k2j.mw:0 + kainjiTs_k3r.mw?kainjiTs_k3r.mw:0
        //         ).toFixed(2), kv: kainjiTs_k1f.V?kainjiTs_k1f.V:0},
        // 'EGBIN (STEAM)' : {mw: Number(
        //     egbinPs_st1.mw?egbinPs_st1.mw:0 + egbinPs_st2.mw?egbinPs_st2.mw:0 + egbinPs_st3.mw?egbinPs_st3.mw:0 + egbinPs_st4.mw?egbinPs_st4.mw:0 + egbinPs_st5.mw?egbinPs_st5.mw:0 + egbinPs_st6.mw?egbinPs_st6.mw:0
        //         ).toFixed(2), kv: egbinPs_st1.V?egbinPs_st1.V:0},
        // 'OKPAI (GAS/STEAM)' : {mw: Number(okpaiGs_k1t.mw?okpaiGs_k1t.mw:0 + okpaiGs_k2t.mw?okpaiGs_k2t.mw:0).toFixed(2), kv: okpaiGs_k1t.V?okpaiGs_k1t.V:0},
        // 'DELTA (GAS)' : {mw: Number(
        //     delta2_tr3.mw?delta2_tr3.mw:0 + delta2_tr4.mw?delta2_tr4.mw:0 + delta3_tr5.mw?delta3_tr5.mw:0 + delta3_tr6.mw?delta3_tr6.mw:0 + deltaGs_g3b.mw?deltaGs_g3b.mw:0 + deltaGs_s4g.mw?deltaGs_s4g.mw:0    
        //         ).toFixed(2), kv: delta2_tr3.V?delta2_tr3.V:0},
        // 'JEBBA (HYDRO)' : {mw: Number(jebbaTs_b8j.mw?jebbaTs_b8j.mw:0 + jebbaTs_b9j.mw?jebbaTs_b9j.mw:0).toFixed(2), kv: jebbaTs_b8j.V?jebbaTs_b8j.V:0},
        // 'AFAM VI (GAS/STEAM)' : {mw: Number(afamIv_vPs_gt17.mw?afamIv_vPs_gt17.mw:0 + afamIv_vPs_gt18.mw?afamIv_vPs_gt18.mw:0).toFixed(2), kv: afamIv_vPs_gt17.V?afamIv_vPs_gt17.V:0},
        // 'ALAOJI NIPP (GAS)' : {mw: Number(alaoji_l7a.mw?alaoji_l7a.mw:0 + alaoji_l8a.mw?alaoji_l8a.mw:0).toFixed(2), kv: alaoji_l7a.V?alaoji_l7a.V:0},
        // 'SAPELE (STEAM)' : {mw: Number(sapeleNippPs_st1.mw?sapeleNippPs_st1.mw:0 + sapeleNippPs_st3.mw?sapeleNippPs_st3.mw:0).toFixed(2), kv: sapeleNippPs_st1.V?sapeleNippPs_st1.V:0},
        // 'SAPELE NIPP (GAS)' : {mw: Number(
        //     sapeleNippPs_gt1.mw?sapeleNippPs_gt1.mw:0 + sapeleNippPs_gt2.mw?sapeleNippPs_gt2.mw:0 + sapeleNippPs_gt3.mw?sapeleNippPs_gt3.mw:0 + sapeleNippPs_gt4.mw?sapeleNippPs_gt4.mw:0
        //         ).toFixed(2), kv: sapeleNippPs_gt1.V?sapeleNippPs_gt1.V:0},
        // 'ODUKPANI NIPP (GAS)' : {mw: Number(
        //     odukpaniGs_d1b.mw?odukpaniGs_d1b.mw:0 + odukpaniGs_d2b.mw?odukpaniGs_d2b.mw:0 + ikotEkpene_d1k.mw?ikotEkpene_d1k.mw:0 + ikotEkpene_d2k.mw?ikotEkpene_d2k.mw:0
        //         ).toFixed(2), kv: odukpaniGs_d1b.V?odukpaniGs_d1b.V:0},
        // 'OMOTOSHO (GAS)' : {mw: Number(
        //     omotosho1_tr1.mw?omotosho1_tr1.mw:0 + omotosho1_tr2.mw?omotosho1_tr2.mw:0 + omotosho2_tr3.mw?omotosho2_tr3.mw:0 + omotosho2_tr4.mw?omotosho2_tr4.mw:0
        //         ).toFixed(2), kv: omotosho1_tr1.V?omotosho1_tr1.V:0},
        // 'GEREGU (GAS)' : {mw: Number(
        //     gereguPs_gt11.mw?gereguPs_gt11.mw:0 + gereguPs_gt12.mw?gereguPs_gt12.mw:0 + gereguPs_gt13.mw?gereguPs_gt13.mw:0
        //         ).toFixed(2), kv: gereguPs_gt11.V?gereguPs_gt11.V:0},
        // 'RIVERS IPP (GAS)' : {mw: Number(riversIppPs_gt1.mw?riversIppPs_gt1.mw:0).toFixed(2), kv: riversIppPs_gt1.V?riversIppPs_gt1.V:0},
        // 'OMOKU (GAS)' : {mw: Number(omokuPs1_o1r.mw?omokuPs1_o1r.mw:0).toFixed(2), kv: omokuPs1_o1r.V?omokuPs1_o1r.V:0},
        // 'IHOVBOR NIPP (GAS)' : {mw: Number(
        //     ihovborNippPs_gt1.mw?ihovborNippPs_gt1.mw:0 + ihovborNippPs_gt2.mw?ihovborNippPs_gt2.mw:0 + ihovborNippPs_gt3.mw?ihovborNippPs_gt3.mw:0 + ihovborNippPs_gt4.mw?ihovborNippPs_gt4.mw:0
        //         ).toFixed(2), kv: ihovborNippPs_gt1.V?ihovborNippPs_gt1.V:0},
        // 'OLORUNSOGO NIPP' : {mw: Number(
        //     (olorunsogoPhase1Gs_r1w.mw?olorunsogoPhase1Gs_r1w.mw:0 + olorunsogoPhase1Gs_r2a.mw?olorunsogoPhase1Gs_r2a.mw:0) - 
        //     (olorunsogo1_tr1.mw?olorunsogo1_tr1.mw:0 + olorunsogo1_tr2.mw?olorunsogo1_tr2.mw:0 + olorunsogoPhase1Gs_tr3.mw?olorunsogoPhase1Gs_tr3.mw:0 + olorunsogoPhase1Gs_tr4.mw?olorunsogoPhase1Gs_tr4.mw:0)
        //         ).toFixed(2), kv: olorunsogoPhase1Gs_r1w.V?olorunsogoPhase1Gs_r1w.V:0},
        // 'PARAS ENERGY (GAS)' : {mw: Number(parasEnergyPs_132cb.mw?parasEnergyPs_132cb.mw:0).toFixed(2), kv: parasEnergyPs_132cb.V?parasEnergyPs_132cb.V:0},
        // 'OMOTOSHO NIPP (GAS)' : {mw: Number(
        //     omotoshoNippPs_tr1.mw?omotoshoNippPs_tr1.mw:0 + omotoshoNippPs_tr2.mw?omotoshoNippPs_tr2.mw:0 + omotoshoNippPs_tr3.mw?omotoshoNippPs_tr3.mw:0 + omotoshoNippPs_tr4.mw?omotoshoNippPs_tr4.mw:0
        //         ).toFixed(2), kv: omotoshoNippPs_tr1.V?omotoshoNippPs_tr1.V:0},
        // 'GEREGU NIPP (GAS)' : {mw: Number(
        //     -(gereguPs_r1j.mw?gereguPs_r1j.mw:0 + gereguPs_r1j.mw?gereguPs_r1j.mw:0) - (gereguPs_gt11.mw?gereguPs_gt11.mw:0 + gereguPs_gt12.mw?gereguPs_gt12.mw:0 + gereguPs_gt13.mw?gereguPs_gt13.mw:0)
        //         ).toFixed(2), kv: gereguPs_r2j.V?gereguPs_r2j.V:0},
        // 'AZURA-EDO IPP (GAS)' : {mw: Number(
        //     -(ihovborNippPs_ohl1.mw?ihovborNippPs_ohl1.mw:0 + ihovborNippPs_ohl2.mw?ihovborNippPs_ohl2.mw:0)
        // ).toFixed(2), kv: ihovborNippPs_ohl1.V?ihovborNippPs_ohl1.V:0},
        // 'TRANS-AMADI (GAS)' : {mw: Number(phMain_m21p.mw?phMain_m21p.mw:0).toFixed(2), kv: phMain_m21p.V?phMain_m21p.V:0},
        // 'IBOM POWER (GAS)' : {mw: Number(
        //     -(eket_e21m.mw?eket_e21m.mw:0 + eket_e22m.mw?eket_e22m.mw:0) - (ekim_ek1m.mw?ekim_ek1m.mw:0)
        // ).toFixed(2), kv: eket_e21m.V?eket_e21m.V:0},
        // 'GBARAIN NIPP (GAS)' : {mw: Number(gbarain_st1.mw?gbarain_st1.mw:0 + gbarain_st2.mw?gbarain_st2.mw:0).toFixed(2), kv: gbarain_st1.V?gbarain_st1.V:0},
        // 'OLORUNSOGO (GAS)' : {mw: Number(
        //     olorunsogo1_tr1.mw?olorunsogo1_tr1.mw:0 + olorunsogo1_tr2.mw?olorunsogo1_tr2.mw:0 + olorunsogoPhase1Gs_tr3.mw?olorunsogoPhase1Gs_tr3.mw:0 + olorunsogoPhase1Gs_tr4.mw?olorunsogoPhase1Gs_tr4.mw:0
        //         ).toFixed(2), kv: olorunsogo1_tr1.V?olorunsogo1_tr1.V:0},
        'DADINKOWA G.S (HYDRO)' : {mw: Number(dadkowa_mw).toFixed(2), kv: dadkowa_kv},
    };
    return station_array;
}
