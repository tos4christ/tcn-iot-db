const get_stations =  function(state_data) {
    if (!state_data) {
        return;
    }
    const ekim_ek1m = state_data.ekim.lines ? state_data.ekim.lines.filter(line => line.id === "ek1m") : [{mw: null, V: null}];
    const eket_e21m = state_data.eket.lines ? state_data.eket.lines.filter(line => line.id === "e21m") : [{mw: null, V: null}];
    const eket_e22m = state_data.eket.lines ? state_data.eket.lines.filter(line => line.id === "e22m") : [{mw: null, V: null}];
    const kainjiTs_k1j = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k1j") : [{mw: null, V: null}];
    const kainjiTs_k2j = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k2j") : [{mw: null, V: null}];
    const kainjiTs_k3r = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k3r") : [{mw: null, V: null}];
    const kainjiTs_k1f = state_data.kainjiTs.lines ? state_data.kainjiTs.lines.filter(line => line.id === "k1f") : [{mw: null, V: null}];
    const egbinPs_st1 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st1") : [{mw: null, V: null}];
    const egbinPs_st2 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st2") : [{mw: null, V: null}];
    const egbinPs_st3 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st3") : [{mw: null, V: null}];
    const egbinPs_st4 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st4") : [{mw: null, V: null}];
    const egbinPs_st5 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st5") : [{mw: null, V: null}];
    const egbinPs_st6 = state_data.egbinPs.units ? state_data.egbinPs.units.filter(line => line.id === "st6") : [{mw: null, V: null}];
    const shiroroPs_411g1 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g1") : [{mw: null, V: null}];
    const shiroroPs_411g2 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g2") : [{mw: null, V: null}];
    const shiroroPs_411g3 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g3") : [{mw: null, V: null}];
    const shiroroPs_411g4 = state_data.shiroroPs.units ? state_data.shiroroPs.units.filter(line => line.id === "411g4") : [{mw: null, V: null}];
    const afamIv_vPs_gt17 = state_data.afamIv_vPs.units ? state_data.afamIv_vPs.units.filter(line => line.id === "gt17") : [{mw: null, V: null}];
    const afamIv_vPs_gt18 = state_data.afamIv_vPs.units ? state_data.afamIv_vPs.units.filter(line => line.id === "gt18") : [{mw: null, V: null}];
    const omotosho1_tr1 = state_data.omotosho1.lines ? state_data.omotosho1.lines.filter(line => line.id === "tr1") : [{mw: null, V: null}];
    const omotosho1_tr2 = state_data.omotosho1.lines ? state_data.omotosho1.lines.filter(line => line.id === "tr2") : [{mw: null, V: null}];
    const omotosho2_tr3 = state_data.omotosho2.lines ? state_data.omotosho2.lines.filter(line => line.id === "tr3") : [{mw: null, V: null}];
    const omotosho2_tr4 = state_data.omotosho2.lines ? state_data.omotosho2.lines.filter(line => line.id === "tr4") : [{mw: null, V: null}];
    const deltaGs_g3b = state_data.deltaGs.lines ? state_data.deltaGs.lines.filter(line => line.id === "g3b") : [{mw: null, V: null}];
    const deltaGs_s4g = state_data.deltaGs.lines ? state_data.deltaGs.lines.filter(line => line.id === "s4g") : [{mw: null, V: null}];
    const okpaiGs_k1t = state_data.okpaiGs.lines ? state_data.okpaiGs.lines.filter(line => line.id === "k1t") : [{mw: null, V: null}];
    const okpaiGs_k2t = state_data.okpaiGs.lines ? state_data.okpaiGs.lines.filter(line => line.id === "k2t") : [{mw: null, V: null}];
    const jebbaTs_b8j = state_data.jebbaTs.lines ? state_data.jebbaTs.lines.filter(line => line.id === "b8j") : [{mw: null, V: null}];
    const jebbaTs_b9j = state_data.jebbaTs.lines ? state_data.jebbaTs.lines.filter(line => line.id === "b9j") : [{mw: null, V: null}];    
    const alaoji_l7a = state_data.alaoji.lines ? state_data.alaoji.lines.filter(line => line.id === "l7a") : [{mw: null, V: null}];
    const alaoji_l8a = state_data.alaoji.lines ? state_data.alaoji.lines.filter(line => line.id === "l8a") : [{mw: null, V: null}];
    const afamViTs_ada200 = state_data.afamViTs.lines ? state_data.afamViTs.lines.filter(line => line.id === "ada200") : [{mw: null, V: null}];
    const afamViTs_adb200 = state_data.afamViTs.lines ? state_data.afamViTs.lines.filter(line => line.id === "adb200") : [{mw: null, V: null}];
    const phMain_m21p = state_data.phMain.lines ? state_data.phMain.lines.filter(line => line.id === "m21p") : [{mw: null, V: null}];
    const odukpaniGs_d1b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d1b") : [{mw: null, V: null}];
    const odukpaniGs_d2b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d2b") : [{mw: null, V: null}];
    const omotoshoNippPs_tr1 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr1") : [{mw: null, V: null}];
    const omotoshoNippPs_tr2 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr2") : [{mw: null, V: null}];
    const omotoshoNippPs_tr3 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr3") : [{mw: null, V: null}];
    const omotoshoNippPs_tr4 = state_data.omotoshoNippPs.units ? state_data.omotoshoNippPs.units.filter(line => line.id === "tr4") : [{mw: null, V: null}];
    const sapeleNippPs_st1 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "st1") : [{mw: null, V: null}];
    const sapeleNippPs_st3 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "st3") : [{mw: null, V: null}];
    const sapeleNippPs_gt1 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt1") : [{mw: null, V: null}];
    const sapeleNippPs_gt2 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt2") : [{mw: null, V: null}];
    const sapeleNippPs_gt3 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt3") : [{mw: null, V: null}];
    const sapeleNippPs_gt4 = state_data.sapeleNippPs.units ? state_data.sapeleNippPs.units.filter(line => line.id === "gt4") : [{mw: null, V: null}];
    const omokuPs1_o1r = state_data.omokuPs1.lines ? state_data.omokuPs1.lines.filter(line => line.id === "o1r") : [{mw: null, V: null}];
    const riversIppPs_gt1 = state_data.riversIppPs.units ? state_data.riversIppPs.units.filter(line => line.id === "gt1") : [{mw: null, V: null}];
    const ikotEkpene_d1k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "d1k") : [{mw: null, V: null}];
    const ikotEkpene_d2k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "d2k") : [{mw: null, V: null}];
    const ikotEkpene_k1u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k1u") : [{mw: null, V: null}];
    const ikotEkpene_k2u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k2u") : [{mw: null, V: null}];
    const ikotEkpene_k3u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k3u") : [{mw: null, V: null}];
    const ikotEkpene_k4u = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "k4u") : [{mw: null, V: null}];
    const ikotEkpene_a1k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "a1k") : [{mw: null, V: null}];
    const ikotEkpene_a2k = state_data.ikotEkpene.lines ? state_data.ikotEkpene.lines.filter(line => line.id === "a2k") : [{mw: null, V: null}];
    const gereguPs_r1j = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "r1j") : [{mw: null, V: null}];
    const gereguPs_r2j = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "r2j") : [{mw: null, V: null}];
    const gereguPs_gt11 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt11") : [{mw: null, V: null}];
    const gereguPs_gt12 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt12") : [{mw: null, V: null}];
    const gereguPs_gt13 = state_data.gereguPs.units ? state_data.gereguPs.units.filter(line => line.id === "gt13") : [{mw: null, V: null}];    
    const delta3_tr5 = state_data.delta3.lines ? state_data.delta3.lines.filter(line => line.id === "tr5") : [{mw: null, V: null}];
    const delta3_tr6 = state_data.delta3.lines ? state_data.delta3.lines.filter(line => line.id === "tr6") : [{mw: null, V: null}];
    const delta2_tr3 = state_data.delta2.lines ? state_data.delta2.lines.filter(line => line.id === "tr3") : [{mw: null, V: null}];
    const delta2_tr4 = state_data.delta2.lines ? state_data.delta2.lines.filter(line => line.id === "tr4") : [{mw: null, V: null}];
    const olorunsogo1_tr1 = state_data.olorunsogo1.lines ? state_data.olorunsogo1.lines.filter(line => line.id === "tr1") : [{mw: null, V: null}];
    const olorunsogo1_tr2 = state_data.olorunsogo1.lines ? state_data.olorunsogo1.lines.filter(line => line.id === "tr2") : [{mw: null, V: null}];
    const ihovborNippPs_ohl1 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "ohl1") : [{mw: null, V: null}];
    const ihovborNippPs_ohl2 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "ohl2") : [{mw: null, V: null}];
    const ihovborNippPs_gt1 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt1") : [{mw: null, V: null}];
    const ihovborNippPs_gt2 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt2") : [{mw: null, V: null}];
    const ihovborNippPs_gt3 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt3") : [{mw: null, V: null}];
    const ihovborNippPs_gt4 = state_data.ihovborNippPs.units ? state_data.ihovborNippPs.units.filter(line => line.id === "gt4") : [{mw: null, V: null}];
    const parasEnergyPs_132cb = state_data.parasEnergyPs.lines ? state_data.parasEnergyPs.lines.filter(line => line.id === "132cb") : [{mw: null, V: null}];
    const olorunsogoPhase1Gs_r2a = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "r2a") : [{mw: null, V: null}];
    const olorunsogoPhase1Gs_r1w = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "r1w") : [{mw: null, V: null}];
    const olorunsogoPhase1Gs_tr3 = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr3") : [{mw: null, V: null}];
    const olorunsogoPhase1Gs_tr4 = state_data.olorunsogoPhase1Gs.lines ? state_data.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr4") : [{mw: null, V: null}];
    const gbarain_st1 = state_data.gbarain.units ? state_data.gbarain.units.filter(line => line.id === "st1") : [{mw: null, V: null}];
    const gbarain_st2 = state_data.gbarain.units ? state_data.gbarain.units.filter(line => line.id === "st2") : [{mw: null, V: null}];
    const dadinKowaGs_w21b = state_data.dadinKowaGs.lines ? state_data.dadinKowaGs.lines.filter(line => line.id === "w21b") : [{mw: null, V: null}];
    const dadinKowaGs_w23e = state_data.dadinKowaGs.lines ? state_data.dadinKowaGs.lines.filter(line => line.id === "w23e") : [{mw: null, V: null}];
    const lokojaTs_j1l = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "j1l") : [{mw: null, V: null}];
    const lokojaTs_j2l = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "j2l") : [{mw: null, V: null}];
    const lokojaTs_l6g = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "l6g") : [{mw: null, V: null}];
    const lokojaTs_l7g = state_data.lokojaTs.lines ? state_data.lokojaTs.lines.filter(line => line.id === "l7g") : [{mw: null, V: null}];
    const gwagwalada_g5b = state_data.gwagwalada.lines ? state_data.gwagwalada.lines.filter(line => line.id === "g5b") : [{mw: null, V: null}];
    const gwagwalada_r3g = state_data.gwagwalada.lines ? state_data.gwagwalada.lines.filter(line => line.id === "r3g") : [{mw: null, V: null}];
    const asaba_b3d = state_data.asaba.lines ? state_data.asaba.lines.filter(line => line.id === "b3d") : [{mw: null, V: null}];
    const asaba_d3t = state_data.asaba.lines ? state_data.asaba.lines.filter(line => line.id === "d3t") : [{mw: null, V: null}];
    const ugwuaji_u1a = state_data.gbarain.lines ? state_data.gbarain.lines.filter(line => line.id === "u1a") : [{mw: null, V: null}];
    const ugwuaji_u2a = state_data.gbarain.lines ? state_data.gbarain.lines.filter(line => line.id === "u2a") : [{mw: null, V: null}];    

    console.log(ikotEkpene_d1k, ikotEkpene_d2k, odukpaniGs_d2b, 'the odukpanis');
    return { 
        'EKET': {mw: Number(
            Math.abs((eket_e21m[0]?.td ? eket_e21m[0].td.mw : 0) + (eket_e22m[0]?.td ? eket_e22m[0].td.mw : 0))
        ).toFixed(2), kv: (eket_e21m[0]?.td ? eket_e21m[0].td.V : eket_e22m[0]?.td ? eket_e22m[0].td.V : 0)},
        'PORT-HARCOURT MAIN' : {mw: Number(
            Math.abs(phMain_m21p[0]?.td ? phMain_m21p[0].td.mw : 0)
            ).toFixed(2), kv: (phMain_m21p[0]?.td ? phMain_m21p[0].td.V : 0)},
        'LOKOJA TS' : {mw: Number(
            Math.abs((Math.abs(lokojaTs_j1l[0]?.td ? lokojaTs_j1l[0].td.mw : 0) + Math.abs(lokojaTs_j2l[0]?.td ? lokojaTs_j2l[0].td.mw : 0)) - 
            (Math.abs(lokojaTs_l6g[0]?.td ? lokojaTs_l6g[0].td.mw : 0) + Math.abs(lokojaTs_l7g[0]?.td ? lokojaTs_l7g[0].td.mw : 0)))
                ).toFixed(2), kv: (lokojaTs_j1l[0]?.td ? lokojaTs_j1l[0].td.V : 0)},
        'EKIM' : {mw: Number(
            Math.abs(ekim_ek1m[0]?.td ? ekim_ek1m[0].td.mw : 0)
            ).toFixed(2), kv: ekim_ek1m[0]?.td ? ekim_ek1m[0].td.V : 0},
        'IKOT EKPENE' : {mw: Number(
            Math.abs((Math.abs(ikotEkpene_a1k[0]?.td ? ikotEkpene_a1k[0].td.mw:0) + Math.abs(ikotEkpene_a2k[0]?.td ?ikotEkpene_a2k[0].td.mw:0) +
            Math.abs(ikotEkpene_d1k[0]?.td ?ikotEkpene_d1k[0].td.mw:0) + Math.abs(ikotEkpene_d2k[0]?.td ?ikotEkpene_d2k[0].td.mw:0)) - 
            (Math.abs(ikotEkpene_k1u[0]?.td ?ikotEkpene_k1u[0].td.mw:0) + Math.abs(ikotEkpene_k2u[0]?.td ?ikotEkpene_k2u[0].td.mw:0) + 
            Math.abs(ikotEkpene_k3u[0]?.td ?ikotEkpene_k3u[0].td.mw:0) + Math.abs(ikotEkpene_k4u[0]?.td ?ikotEkpene_k4u[0].td.mw:0)))
                ).toFixed(2), kv: ikotEkpene_d1k[0]?.td ?ikotEkpene_d1k[0].td.V:0}, 
        'GWAGWALADA' : {mw: Number(
            (gwagwalada_g5b[0]?.td ?gwagwalada_g5b[0].td.mw:0) + (gwagwalada_r3g[0]?.td ? gwagwalada_r3g[0].td.mw:0)
            ).toFixed(2), kv: (gwagwalada_g5b[0]?.td ?gwagwalada_g5b[0].td.V:0)},
        'UGWUAJI' : {mw: Number(
            (ugwuaji_u1a[0]?.td ?ugwuaji_u1a[0].td.mw:0) + (ugwuaji_u2a[0]?.td ?ugwuaji_u2a[0].td.mw:0)
            ).toFixed(2), kv: ugwuaji_u1a[0]?.td ?ugwuaji_u1a[0].td.V:0},
        'ASABA' : {mw: Number(
            (asaba_b3d[0]?.td ?asaba_b3d[0].td.mw:0) + (asaba_d3t[0]?.td ?asaba_d3t[0].td.mw:0)
            ).toFixed(2), kv: (asaba_b3d[0]?.td ?asaba_b3d[0].td.V:0)},
        'SHIRORO (HYDRO)' : {mw: Number(
            (shiroroPs_411g1[0]?.gd ?shiroroPs_411g1[0].gd.mw:0) + (shiroroPs_411g2[0]?.gd ?shiroroPs_411g2[0].gd.mw:0) + 
            (shiroroPs_411g3[0]?.gd ?shiroroPs_411g3[0].gd.mw:0) + (shiroroPs_411g4[0]?.gd ?shiroroPs_411g4[0].gd.mw:0)  
                ).toFixed(2), kv: (shiroroPs_411g1[0]?.gd ?shiroroPs_411g1[0].gd.V:0)},
        'AFAM IV & V (GAS)' : {mw: Number(
            (afamIv_vPs_gt17[0]?.td ?afamIv_vPs_gt17[0].td.mw:0) + (afamIv_vPs_gt18[0]?.td ?afamIv_vPs_gt18[0].td.mw:0)
            ).toFixed(2), kv: (afamIv_vPs_gt17[0]?.td ?afamIv_vPs_gt17[0].td.V:0)},
        'KAINJI (HYDRO)' : {mw: Number(
            (kainjiTs_k1f[0]?.td ?kainjiTs_k1f[0].td.mw:0) + (kainjiTs_k1j[0]?.td ?kainjiTs_k1j[0].td.mw:0) + 
            (kainjiTs_k2j[0]?.td ?kainjiTs_k2j[0].td.mw:0) + (kainjiTs_k3r[0]?.td ?kainjiTs_k3r[0].td.mw:0)
                ).toFixed(2), kv: (kainjiTs_k1f[0]?.td ?kainjiTs_k1f[0].td.V:0)},
        'EGBIN (STEAM)' : {mw: Number(
            (egbinPs_st1[0]?.gd ?egbinPs_st1[0].gd.mw:0) + (egbinPs_st2[0]?.gd ?egbinPs_st2[0].gd.mw:0) + 
            (egbinPs_st3[0]?.gd ?egbinPs_st3[0].gd.mw:0) + (egbinPs_st4[0]?.gd ?egbinPs_st4[0].gd.mw:0) + 
            (egbinPs_st5[0]?.gd ?egbinPs_st5[0].gd.mw:0) + (egbinPs_st6[0]?.gd ?egbinPs_st6[0].gd.mw:0)
                ).toFixed(2), kv: (egbinPs_st1[0]?.gd ?egbinPs_st1[0].gd.V:0)},
        'OKPAI (GAS/STEAM)' : {mw: Number(
            (okpaiGs_k1t[0]?.td ?okpaiGs_k1t[0].td.mw:0) + (okpaiGs_k2t[0]?.td ?okpaiGs_k2t[0].td.mw:0)
            ).toFixed(2), kv: (okpaiGs_k1t[0]?.td ?okpaiGs_k1t[0].td.V:0)},
        'DELTA (GAS)' : {mw: Number(
            Math.abs(delta2_tr3[0]?.gd ?delta2_tr3[0].gd.mw:0) + Math.abs(delta2_tr4[0]?.gd ?delta2_tr4[0].gd.mw:0) + 
            Math.abs(delta3_tr5[0]?.gd ?delta3_tr5[0].gd.mw:0) + Math.abs(delta3_tr6[0]?.gd ?delta3_tr6[0].gd.mw:0) + 
            Math.abs(deltaGs_g3b[0]?.td ?deltaGs_g3b[0].td.mw:0) + Math.abs(deltaGs_s4g[0]?.td ?deltaGs_s4g[0].td.mw:0)   
                ).toFixed(2), kv: (deltaGs_g3b[0]?.td ?deltaGs_g3b[0].td.V:0)},
        'JEBBA (HYDRO)' : {mw: Number(
            (jebbaTs_b8j[0]?.td ?jebbaTs_b8j[0].td.mw:0) + (jebbaTs_b9j[0]?.td ?jebbaTs_b9j[0].td.mw:0)
            ).toFixed(2), kv: (jebbaTs_b8j[0]?.td ?jebbaTs_b8j[0].td.V:0)},
        'AFAM VI (GAS/STEAM)' : {mw: Number(
            (afamViTs_ada200[0]?.td ?afamViTs_ada200[0].td.mw:0) + (afamViTs_adb200[0]?.td ?afamViTs_adb200[0].td.mw:0)
            ).toFixed(2), kv: (afamViTs_ada200[0]?.td ?afamViTs_ada200[0].td.V:0)},
        'ALAOJI NIPP (GAS)' : {mw: Number(
            Math.abs(alaoji_l7a[0]?.td ?alaoji_l7a[0].td.mw:0) + Math.abs(alaoji_l8a[0]?.td ?alaoji_l8a[0].td.mw:0)
            ).toFixed(2), kv: (alaoji_l7a[0]?.td ?alaoji_l7a[0].td.V:0)},
        'SAPELE (STEAM)' : {mw: Number(
            Math.abs((sapeleNippPs_st1[0]?.gd ?sapeleNippPs_st1[0].gd.mw:0) + (sapeleNippPs_st3[0]?.gd ?sapeleNippPs_st3[0].gd.mw:0))
            ).toFixed(2), kv: sapeleNippPs_st1[0]?.gd ?sapeleNippPs_st1[0].gd.V:0},
        'SAPELE NIPP (GAS)' : {mw: Number(
            Math.abs((sapeleNippPs_gt1[0]?.gd ?sapeleNippPs_gt1[0].gd.mw:0) + (sapeleNippPs_gt2[0]?.gd ?sapeleNippPs_gt2[0].gd.mw:0) + 
            (sapeleNippPs_gt3[0]?.gd ?sapeleNippPs_gt3[0].gd.mw:0) + (sapeleNippPs_gt4[0]?.gd ?sapeleNippPs_gt4[0].gd.mw:0))
                ).toFixed(2), kv: (sapeleNippPs_gt1[0]?.gd ?sapeleNippPs_gt1[0].gd.V:0)},
        'ODUKPANI NIPP (GAS)' : {mw: Number(
            Math.abs(Math.abs(odukpaniGs_d1b[0]?.td ?odukpaniGs_d1b[0].td.mw:0) + Math.abs(odukpaniGs_d2b[0]?.td ?odukpaniGs_d2b[0].td.mw:0) + 
            Math.abs(ikotEkpene_d1k[0]?.td ?ikotEkpene_d1k[0].td.mw:0) + Math.abs(ikotEkpene_d2k[0]?.td ?ikotEkpene_d2k[0].td.mw:0))
                ).toFixed(2), kv: (odukpaniGs_d1b[0]?.td ?odukpaniGs_d1b[0].td.V:0)},
        'OMOTOSHO (GAS)' : {mw: Number(
            Math.abs(omotosho1_tr1[0]?.gd ?omotosho1_tr1[0].gd.mw:0) + Math.abs(omotosho1_tr2[0]?.gd ?omotosho1_tr2[0].gd.mw:0) + 
            Math.abs(omotosho2_tr3[0]?.gd ?omotosho2_tr3[0].gd.mw:0) + Math.abs(omotosho2_tr4[0]?.gd ?omotosho2_tr4[0].gd.mw:0)
                ).toFixed(2), kv: (omotosho1_tr1[0]?.gd ?omotosho1_tr1[0].gd.V:0)},
        'GEREGU (GAS)' : {mw: Number(
            Math.abs(gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.mw:0) + Math.abs(gereguPs_gt12[0]?.gd ?gereguPs_gt12[0].gd.mw:0) + 
            Math.abs(gereguPs_gt13[0]?.gd ?gereguPs_gt13[0].gd.mw:0)
                ).toFixed(2), kv: (gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.V:0)},
        'RIVERS IPP (GAS)' : {mw: Number(
            Math.abs(riversIppPs_gt1[0]?.gd ?riversIppPs_gt1[0].gd.mw:0)
            ).toFixed(2), kv: (riversIppPs_gt1[0]?.gd ?riversIppPs_gt1[0].gd.V:0)},
        'OMOKU (GAS)' : {mw: Number(
            (omokuPs1_o1r[0]?.td ?omokuPs1_o1r[0].td.mw:0)
            ).toFixed(2), kv: (omokuPs1_o1r[0]?.td ?omokuPs1_o1r[0].td.V:0)},
        'IHOVBOR NIPP (GAS)' : {mw: Number(
            Math.abs((ihovborNippPs_gt1[0]?.gd ?ihovborNippPs_gt1[0].gd.mw:0) + (ihovborNippPs_gt2[0]?.gd ?ihovborNippPs_gt2[0].gd.mw:0) + 
            (ihovborNippPs_gt3[0]?.gd ?ihovborNippPs_gt3[0].gd.mw:0) + (ihovborNippPs_gt4[0]?.gd ?ihovborNippPs_gt4[0].gd.mw:0))
                ).toFixed(2), kv: (ihovborNippPs_gt1[0]?.gd ?ihovborNippPs_gt1[0].gd.V:0)},
        'OLORUNSOGO NIPP' : {mw: Number(
            ((olorunsogoPhase1Gs_r1w[0]?.td ?olorunsogoPhase1Gs_r1w[0].td.mw:0) + (olorunsogoPhase1Gs_r2a[0]?.td ?olorunsogoPhase1Gs_r2a[0].td.mw:0)) - 
            ((olorunsogo1_tr1[0]?.gd ?olorunsogo1_tr1[0].gd.mw:0) + (olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.mw:0) + 
            (olorunsogoPhase1Gs_tr3[0]?.gd ?olorunsogoPhase1Gs_tr3[0].gd.mw:0) + (olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.mw:0))
                ).toFixed(2), kv: (olorunsogoPhase1Gs_r1w[0]?.td ?olorunsogoPhase1Gs_r1w[0].td.V:0)},
        'PARAS ENERGY (GAS)' : {mw: Number(
            (parasEnergyPs_132cb[0]?.gd ?parasEnergyPs_132cb[0].gd.mw:0)
            ).toFixed(2), kv: (parasEnergyPs_132cb[0]?.gd ?parasEnergyPs_132cb[0].gd.V:0)},
        'OMOTOSHO NIPP (GAS)' : {mw: Number(
            Math.abs(Math.abs(omotoshoNippPs_tr1[0]?.gd ?omotoshoNippPs_tr1[0].gd.mw:0) + Math.abs(omotoshoNippPs_tr2[0]?.gd ?omotoshoNippPs_tr2[0].gd.mw:0) + 
            Math.abs(omotoshoNippPs_tr3[0]?.gd ?omotoshoNippPs_tr3[0].gd.mw:0) + Math.abs(omotoshoNippPs_tr4[0]?.gd ?omotoshoNippPs_tr4[0].gd.mw:0))
                ).toFixed(2), kv: (omotoshoNippPs_tr1[0]?.gd ?omotoshoNippPs_tr1[0].gd.V:0)},
        'GEREGU NIPP (GAS)' : {mw: Number(
            -((gereguPs_r1j[0]?.gd ?gereguPs_r1j[0].gd.mw:0) + (gereguPs_r1j[0]?.gd ?gereguPs_r1j[0].gd.mw:0)) - 
            ((gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.mw:0) + (gereguPs_gt12[0]?.gd ?gereguPs_gt12[0].gd.mw:0) +
            (gereguPs_gt13[0]?.gd ?gereguPs_gt13[0].gd.mw:0))
                ).toFixed(2), kv: (gereguPs_r2j[0]?.gd ?gereguPs_r2j[0].gd.V:0)},
        'AZURA-EDO IPP (GAS)' : {mw: Number(
            -((ihovborNippPs_ohl1[0]?.gd ?ihovborNippPs_ohl1[0].gd.mw:0) + (ihovborNippPs_ohl2[0]?.gd ?ihovborNippPs_ohl2[0].gd.mw:0))
        ).toFixed(2), kv: (ihovborNippPs_ohl1[0]?.gd ?ihovborNippPs_ohl1[0].gd.V:0)},
        'TRANS-AMADI (GAS)' : {mw: Number(
            Math.abs(phMain_m21p[0]?.td ?phMain_m21p[0].td.mw:0)
            ).toFixed(2), kv: phMain_m21p[0]?.td ?phMain_m21p[0].td.V:0},
        'IBOM POWER (GAS)' : {mw: Number(
            -((eket_e21m[0]?.td ?eket_e21m[0].td.mw:0) + (eket_e22m[0]?.td ?eket_e22m[0].td.mw:0)) - (ekim_ek1m[0]?.td ?ekim_ek1m[0].td.mw:0)
        ).toFixed(2), kv: (eket_e21m[0]?.td ?eket_e21m[0].td.V:0)},
        'GBARAIN NIPP (GAS)' : {mw: Number(
            (gbarain_st1[0]?.gd ?gbarain_st1[0].gd.mw:0) + (gbarain_st2[0]?.gd ?gbarain_st2[0].gd.mw:0)
            ).toFixed(2), kv: (gbarain_st1[0]?.gd ?gbarain_st1[0].gd.V:0)},
        'OLORUNSOGO (GAS)' : {mw: Number(
            Math.abs(olorunsogo1_tr1[0]?.gd ?olorunsogo1_tr1[0].gd.mw:0) + Math.abs(olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.mw:0) + 
            Math.abs(olorunsogoPhase1Gs_tr3[0]?.gd ?olorunsogoPhase1Gs_tr3[0].gd.mw:0) + Math.abs(olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.mw:0)
                ).toFixed(2), kv: (olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.V:0)},
        'DADINKOWA G.S (HYDRO)' : {mw: Number(
            (dadinKowaGs_w21b[0]?.td ?dadinKowaGs_w21b[0].td.mw:0) + (dadinKowaGs_w23e[0]?.td ?dadinKowaGs_w23e[0].td.mw:0)
            ).toFixed(2), kv: dadinKowaGs_w21b[0]?.td ?dadinKowaGs_w21b[0].td.V:0},
    };
}

export default get_stations;
