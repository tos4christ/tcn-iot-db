const get_stations =  function(state_data, station_name = "TAOPEX") {
    if (!state_data) {
        return;
    }
    // console.log(state_data, 'the station data')
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
    // New topic added
    const afamVPs_gt20 = state_data.afamVPs ? (state_data.afamVPs?.units ? state_data.afamVPs.units.filter(line => line.id === "gt20") : [{mw: null, V: null}]) : [{}];
    const transamadiGs_m21p = state_data.transamadiGs ? (state_data.transamadiGs.lines ? state_data.transamadiGs.lines.filter(line => line.id === "m21p") : [{mw: null, V: null}]) : [{}];
    const transamadiGs_m22p = state_data.transamadiGs ? (state_data.transamadiGs.lines ? state_data.transamadiGs.lines.filter(line => line.id === "m22p") : [{mw: null, V: null}]) : [{}];

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
    // Old topics removed
    // const odukpaniGs_d1b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d1b") : [{mw: null, V: null}];
    // const odukpaniGs_d2b = state_data.odukpaniGs.lines ? state_data.odukpaniGs.lines.filter(line => line.id === "d2b") : [{mw: null, V: null}];
    // New topics added
    const odukpaniNippPs_gt1 = state_data.odukpaniNippPs? (state_data.odukpaniNippPs.units ? state_data.odukpaniNippPs.units.filter(line => line.id === "gt1") : [{mw: null, V: null}]) : [{}];
    const odukpaniNippPs_gt2 = state_data.odukpaniNippPs? (state_data.odukpaniNippPs.units ? state_data.odukpaniNippPs.units.filter(line => line.id === "gt2") : [{mw: null, V: null}]) : [{}];
    const odukpaniNippPs_gt3 = state_data.odukpaniNippPs? (state_data.odukpaniNippPs.units ? state_data.odukpaniNippPs.units.filter(line => line.id === "gt3") : [{mw: null, V: null}]) : [{}];
    const odukpaniNippPs_gt4 = state_data.odukpaniNippPs? (state_data.odukpaniNippPs.units ? state_data.odukpaniNippPs.units.filter(line => line.id === "gt4") : [{mw: null, V: null}]) : [{}];
    const odukpaniNippPs_gt5 = state_data.odukpaniNippPs? (state_data.odukpaniNippPs.units ? state_data.odukpaniNippPs.units.filter(line => line.id === "gt5") : [{mw: null, V: null}]) : [{}];

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
    const zungeru_z1ssX = state_data.zungeru.lines ? state_data.zungeru.lines.filter(line => line.id === "z1ssX") : [{mw: null, V: null}];    
    const zungeru_z2ssX = state_data.zungeru.lines ? state_data.zungeru.lines.filter(line => line.id === "z2ssX") : [{mw: null, V: null}];
    //Taopex
    const taopex = state_data.taopex.lines ? state_data.taopex.lines.filter(line => line.id === "line1") : [{mw: null, V: null}];    
    

    // console.log(omotosho2_tr3, omotosho2_tr4, 'the omotoshos');
    // const multiplier = 3/10;
    const stations_object = { 
        'TAOPEX': [{taopex: {mw: Number(taopex[0]?.td ? taopex[0].td.mw : 0).toFixed(2), kv: (taopex[0]?.td ? taopex[0].td.V : 0)}}],
        'EKET': [{e21m: {mw: Number(eket_e21m[0]?.td ? eket_e21m[0].td.mw : 0).toFixed(2), kv: (eket_e21m[0]?.td ? eket_e21m[0].td.V : 0)}},
                 {e22m: {mw: Number(eket_e22m[0]?.td ? eket_e22m[0].td.mw : 0).toFixed(2), kv: (eket_e22m[0]?.td ? eket_e22m[0].td.V : 0)}}],
        'ZUNGERU': [{z1ssX: {mw: Number(zungeru_z1ssX[0]?.td ? zungeru_z1ssX[0].td.mw : 0).toFixed(2), kv: (zungeru_z1ssX[0]?.td ? zungeru_z1ssX[0].td.V : 0)}},
                    {z2ssX: {mw: Number(zungeru_z2ssX[0]?.td ? zungeru_z2ssX[0].td.mw : 0).toFixed(2), kv: (zungeru_z2ssX[0]?.td ? zungeru_z2ssX[0].td.V : 0)}}],        
        'PORT-HARCOURT MAIN' : [{m21p : {mw: Number(phMain_m21p[0]?.td ? phMain_m21p[0].td.mw : 0).toFixed(2), kv: (phMain_m21p[0]?.td ? phMain_m21p[0].td.V : 0)}}],
        'LOKOJA TS' : [{j1l: {mw: Number(lokojaTs_j1l[0]?.td ? lokojaTs_j1l[0].td.mw : 0).toFixed(2), kv: (lokojaTs_j1l[0]?.td ? lokojaTs_j1l[0].td.V : 0)}},
                        {j2l: {mw: Number(lokojaTs_j2l[0]?.td ? lokojaTs_j2l[0].td.mw : 0).toFixed(2), kv: (lokojaTs_j2l[0]?.td ? lokojaTs_j2l[0].td.V : 0)}}, 
                        {l6g: {mw: Number(lokojaTs_l6g[0]?.td ? lokojaTs_l6g[0].td.mw : 0).toFixed(2), kv:(lokojaTs_l6g[0]?.td ? lokojaTs_l6g[0].td.V : 0)}} , 
                        {l7g: {mw: Number(lokojaTs_l7g[0]?.td ? lokojaTs_l7g[0].td.mw : 0).toFixed(2), kv: (lokojaTs_l7g[0]?.td ? lokojaTs_l7g[0].td.V : 0)}}],
        'EKIM' : [{ek1m: {mw: Number(ekim_ek1m[0]?.td ? ekim_ek1m[0].td.mw : 0), kv: (ekim_ek1m[0]?.td ? ekim_ek1m[0].td.V : 0)}}],
        'IKOT EKPENE' : [{a1k: {mw: Number(ikotEkpene_a1k[0]?.td ? ikotEkpene_a1k[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_a1k[0]?.td ?ikotEkpene_a1k[0].td.V : 0)}},
                     {a2k: {mw: Number(ikotEkpene_a2k[0]?.td ? ikotEkpene_a2k[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_a2k[0]?.td ?ikotEkpene_a2k[0].td.V : 0)}},
                     {d1k: {mw: Number(ikotEkpene_d1k[0]?.td ? ikotEkpene_d1k[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_d1k[0]?.td ?ikotEkpene_d1k[0].td.V : 0)}},
                     {d2k: {mw: Number(ikotEkpene_d2k[0]?.td ? ikotEkpene_d2k[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_d2k[0]?.td ?ikotEkpene_d2k[0].td.V : 0)}},
                     {k1u: {mw: Number(ikotEkpene_k1u[0]?.td ? ikotEkpene_k1u[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_k1u[0]?.td ?ikotEkpene_k1u[0].td.V : 0)}},
                     {k2u: {mw: Number(ikotEkpene_k2u[0]?.td ? ikotEkpene_k2u[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_k2u[0]?.td ?ikotEkpene_k2u[0].td.V : 0)}},
                     {k3u: {mw: Number(ikotEkpene_k3u[0]?.td ? ikotEkpene_k3u[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_k3u[0]?.td ?ikotEkpene_k3u[0].td.V : 0)}},
                     {k4u: {mw: Number(ikotEkpene_k4u[0]?.td ? ikotEkpene_k4u[0].td.mw : 0).toFixed(2), kv: (ikotEkpene_k4u[0]?.td ?ikotEkpene_k4u[0].td.V : 0)}}],
        'GWAGWALADA' : [{g5b: {mw: Number(gwagwalada_g5b[0]?.td ?gwagwalada_g5b[0].td.mw : 0).toFixed(2), kv: (gwagwalada_g5b[0]?.td ?gwagwalada_g5b[0].td.V : 0)}}, 
                        {r3g: {mw: Number(gwagwalada_r3g[0]?.td ?gwagwalada_r3g[0].td.mw : 0).toFixed(2), kv: (gwagwalada_r3g[0]?.td ?gwagwalada_r3g[0].td.V : 0)}}],
        'UGWUAJI' : [{u1a: {mw: Number(ugwuaji_u1a[0]?.td ?ugwuaji_u1a[0].td.mw : 0).toFixed(2), kv: (ugwuaji_u1a[0]?.td ?ugwuaji_u1a[0].td.V : 0)}}, 
                    {u2a: {mw: Number(ugwuaji_u2a[0]?.td ?ugwuaji_u2a[0].td.mw : 0).toFixed(2), kv: (ugwuaji_u2a[0]?.td ?ugwuaji_u2a[0].td.V : 0)}}],
        'ASABA' : [{b3d: {mw: Number(asaba_b3d[0]?.td ?asaba_b3d[0].td.mw:0).toFixed(2), kv: (asaba_b3d[0]?.td ?asaba_b3d[0].td.V : 0)}}, 
            {d3t: {mw: Number(asaba_d3t[0]?.td ?asaba_d3t[0].td.mw:0).toFixed(2), kv: (asaba_d3t[0]?.td ?asaba_d3t[0].td.V : 0)}}],            
        'SHIRORO (HYDRO)' : [{'411g1': {mw: Number(shiroroPs_411g1[0]?.gd ?shiroroPs_411g1[0].gd.mw : 0).toFixed(2), kv: (shiroroPs_411g1[0]?.gd ?shiroroPs_411g1[0].gd.V : 0)}},
                             {'411g2': {mw: Number(shiroroPs_411g2[0]?.gd ?shiroroPs_411g2[0].gd.mw : 0).toFixed(2), kv: (shiroroPs_411g2[0]?.gd ?shiroroPs_411g2[0].gd.V : 0)}}, 
                             {'411g3': {mw: Number(shiroroPs_411g3[0]?.gd ?shiroroPs_411g3[0].gd.mw : 0).toFixed(2), kv: (shiroroPs_411g3[0]?.gd ?shiroroPs_411g3[0].gd.V : 0)}}, 
                             {'411g4': {mw: Number(shiroroPs_411g4[0]?.gd ?shiroroPs_411g4[0].gd.mw : 0).toFixed(2), kv: (shiroroPs_411g4[0]?.gd ?shiroroPs_411g4[0].gd.V : 0)}}],
        'AFAM IV & V (GAS)' : [{gt17: {mw: Number(afamIv_vPs_gt17[0]?.td ?afamIv_vPs_gt17[0].td.mw : 0).toFixed(2), kv: (afamIv_vPs_gt17[0]?.td ?afamIv_vPs_gt17[0].td.V : 0)}}, 
                                {gt18: {mw: Number(afamIv_vPs_gt18[0]?.td ?afamIv_vPs_gt18[0].td.mw : 0).toFixed(2), kv: (afamIv_vPs_gt18[0]?.td ?afamIv_vPs_gt18[0].td.V : 0)}}, 
                                {gt20: {mw: Number(afamVPs_gt20[0]?.gd ? afamVPs_gt20[0].gd.mw : 0).toFixed(2), kv: (afamVPs_gt20[0]?.gd ?afamVPs_gt20[0].gd.V : 0)}}],
        'KAINJI (HYDRO)' : [{k1f: {mw: Number(kainjiTs_k1f[0]?.td ?kainjiTs_k1f[0].td.mw : 0).toFixed(2), kv: (kainjiTs_k1f[0]?.td ?kainjiTs_k1f[0].td.V : 0)}}, 
                            {k1j: {mw: Number(kainjiTs_k1j[0]?.td ?kainjiTs_k1j[0].td.mw : 0).toFixed(2), kv: (kainjiTs_k1j[0]?.td ?kainjiTs_k1j[0].td.V : 0)}}, 
                            {k2j: {mw: Number(kainjiTs_k2j[0]?.td ?kainjiTs_k2j[0].td.mw : 0).toFixed(2), kv: (kainjiTs_k2j[0]?.td ?kainjiTs_k2j[0].td.V : 0)}}, 
                            {k3r: {mw: Number(kainjiTs_k3r[0]?.td ?kainjiTs_k3r[0].td.mw : 0).toFixed(2), kv: (kainjiTs_k3r[0]?.td ?kainjiTs_k3r[0].td.V : 0)}}],
        'EGBIN (STEAM)' : [{st1: {mw: Number(egbinPs_st1[0]?.gd ?egbinPs_st1[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st1[0]?.gd ?egbinPs_st1[0].gd.V : 0)}}, 
                        {st2: {mw: Number(egbinPs_st2[0]?.gd ?egbinPs_st2[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st2[0]?.gd ?egbinPs_st2[0].gd.V : 0)}}, 
                        {st3: {mw: Number(egbinPs_st3[0]?.gd ?egbinPs_st3[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st3[0]?.gd ?egbinPs_st3[0].gd.V : 0)}}, 
                        {st4: {mw: Number(egbinPs_st4[0]?.gd ?egbinPs_st4[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st4[0]?.gd ?egbinPs_st4[0].gd.V : 0)}}, 
                        {st5: {mw: Number(egbinPs_st5[0]?.gd ?egbinPs_st5[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st5[0]?.gd ?egbinPs_st5[0].gd.V : 0)}}, 
                        {st6: {mw: Number(egbinPs_st6[0]?.gd ?egbinPs_st6[0].gd.mw : 0).toFixed(2), kv: (egbinPs_st6[0]?.gd ?egbinPs_st6[0].gd.V : 0)}}],
        'OKPAI (GAS/STEAM)' : [{k1t: {mw: Number(okpaiGs_k1t[0]?.td ?okpaiGs_k1t[0].td.mw : 0).toFixed(2), kv: (okpaiGs_k1t[0]?.td ?okpaiGs_k1t[0].td.V : 0)}}, 
                                {k2t: {mw: Number(okpaiGs_k2t[0]?.td ?okpaiGs_k2t[0].td.mw : 0).toFixed(2), kv: (okpaiGs_k2t[0]?.td ?okpaiGs_k2t[0].td.V : 0)}}],
        'DELTA (GAS)' : [{tr3: {mw: Number(delta2_tr3[0]?.gd ?delta2_tr3[0].gd.mw : 0).toFixed(2), kv: (delta2_tr3[0]?.td ?delta2_tr3[0].gd.V : 0)}}, 
                        {tr4: {mw: Number(delta2_tr4[0]?.gd ?delta2_tr4[0].gd.mw : 0).toFixed(2), kv: (delta2_tr4[0]?.td ?delta2_tr4[0].gd.V : 0)}}, 
                        {tr5: {mw: Number(delta3_tr5[0]?.gd ?delta3_tr5[0].gd.mw : 0).toFixed(2), kv: (delta3_tr5[0]?.td ?delta3_tr5[0].gd.V : 0)}}, 
                        {tr6: {mw: Number(delta3_tr6[0]?.gd ?delta3_tr6[0].gd.mw : 0).toFixed(2), kv: (delta3_tr6[0]?.td ?delta3_tr6[0].gd.V : 0)}},
                        {g3b: {mw: Number(deltaGs_g3b[0]?.td ? deltaGs_g3b[0].td.mw : 0).toFixed(2), kv: (deltaGs_g3b[0]?.td ?deltaGs_g3b[0].td.V : 0)}},
                        {s4g: {mw: Number(deltaGs_s4g[0]?.td ?deltaGs_s4g[0].td.mw : 0).toFixed(2), kv: (deltaGs_s4g[0]?.td ?deltaGs_s4g[0].td.V : 0)}}],
        'JEBBA (HYDRO)' : [{b8j: {mw: Number(jebbaTs_b8j[0]?.td ?jebbaTs_b8j[0].td.mw : 0).toFixed(2), kv: (jebbaTs_b8j[0]?.td ?jebbaTs_b8j[0].td.V : 0)}},
                            {b9j: {mw: Number(jebbaTs_b9j[0]?.td ?jebbaTs_b9j[0].td.mw : 0).toFixed(2), kv: (jebbaTs_b9j[0]?.td ?jebbaTs_b9j[0].td.V : 0)}}],
        'AFAM VI (GAS/STEAM)' : [{ada200: {mw: Number(afamViTs_ada200[0]?.td ?afamViTs_ada200[0].td.mw : 0).toFixed(2), kv: (afamViTs_ada200[0]?.td ?afamViTs_ada200[0].td.V : 0)}}, 
                                {adb200: {mw: Number(afamViTs_adb200[0]?.td ?afamViTs_adb200[0].td.mw : 0).toFixed(2), kv: (afamViTs_adb200[0]?.td ?afamViTs_adb200[0].td.V : 0)}}],
        'ALAOJI NIPP (GAS)' : [{l7a: {mw: Number(alaoji_l7a[0]?.td ?alaoji_l7a[0].td.mw : 0).toFixed(2), kv: (alaoji_l7a[0]?.td ?alaoji_l7a[0].td.V : 0)}}, 
                                {l8a: {mw: Number(alaoji_l8a[0]?.td ?alaoji_l8a[0].td.mw : 0).toFixed(2), kv: (alaoji_l8a[0]?.td ?alaoji_l8a[0].td.V : 0)}}],
        'SAPELE (STEAM)' : [{st1: {mw: Number(sapeleNippPs_st1[0]?.gd ?sapeleNippPs_st1[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_st1[0]?.gd ?sapeleNippPs_st1[0].gd.V : 0)}}, 
                            {st3: {mw: Number(sapeleNippPs_st3[0]?.gd ?sapeleNippPs_st3[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_st3[0]?.gd ?sapeleNippPs_st3[0].gd.V : 0)}}],
        'SAPELE NIPP (GAS)' : [{gt1: {mw: Number(sapeleNippPs_gt1[0]?.gd ?sapeleNippPs_gt1[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_gt1[0]?.gd ?sapeleNippPs_gt1[0].gd.V : 0)}}, 
                                {gt2: {mw: Number(sapeleNippPs_gt2[0]?.gd ?sapeleNippPs_gt2[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_gt2[0]?.gd ?sapeleNippPs_gt2[0].gd.V : 0)}}, 
                                {gt3: {mw: Number(sapeleNippPs_gt3[0]?.gd ?sapeleNippPs_gt3[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_gt3[0]?.gd ?sapeleNippPs_gt3[0].gd.V : 0)}}, 
                                {gt4: {mw: Number(sapeleNippPs_gt4[0]?.gd ?sapeleNippPs_gt4[0].gd.mw : 0).toFixed(2), kv: (sapeleNippPs_gt4[0]?.gd ?sapeleNippPs_gt4[0].gd.V : 0)}}],
        'ODUKPANI NIPP (GAS)' : [{gt1: {mw: Number(odukpaniNippPs_gt1[0]?.gd ?odukpaniNippPs_gt1[0].gd.mw : 0).toFixed(2), kv: (odukpaniNippPs_gt1[0]?.gd ?odukpaniNippPs_gt1[0].gd.V : 0)}}, 
                                {gt2: {mw: Number(odukpaniNippPs_gt2[0]?.gd ?odukpaniNippPs_gt2[0].gd.mw : 0).toFixed(2), kv: (odukpaniNippPs_gt2[0]?.gd ?odukpaniNippPs_gt2[0].gd.V : 0)}}, 
                                {gt3: {mw: Number(odukpaniNippPs_gt3[0]?.gd ?odukpaniNippPs_gt3[0].gd.mw : 0).toFixed(2), kv: (odukpaniNippPs_gt3[0]?.gd ?odukpaniNippPs_gt3[0].gd.V : 0)}}, 
                                {gt4: {mw: Number(odukpaniNippPs_gt4[0]?.gd ?odukpaniNippPs_gt4[0].gd.mw : 0).toFixed(2), kv: (odukpaniNippPs_gt4[0]?.gd ?odukpaniNippPs_gt4[0].gd.V : 0)}}, 
                                {gt5: {mw: Number(odukpaniNippPs_gt5[0]?.gd ?odukpaniNippPs_gt5[0].gd.mw : 0).toFixed(2), kv: (odukpaniNippPs_gt5[0]?.gd ?odukpaniNippPs_gt5[0].gd.V : 0)}}],
        'OMOTOSHO (GAS)' : [{tr1: {mw: Number(omotosho1_tr1[0]?.gd ?omotosho1_tr1[0].gd.mw : 0).toFixed(2), kv: (omotosho1_tr1[0]?.gd ?omotosho1_tr1[0].gd.V : 0)}}, 
                            {tr2: {mw: Number(omotosho1_tr2[0]?.gd ?omotosho1_tr2[0].gd.mw : 0).toFixed(2), kv: (omotosho1_tr2[0]?.gd ?omotosho1_tr2[0].gd.V : 0)}}, 
                            {tr3: {mw: Number(omotosho2_tr3[0]?.gd ?omotosho2_tr3[0].gd.mw : 0).toFixed(2), kv: (omotosho2_tr3[0]?.gd ?omotosho2_tr3[0].gd.V : 0)}}, 
                            {tr4: {mw: Number(omotosho2_tr4[0]?.gd ?omotosho2_tr4[0].gd.mw : 0).toFixed(2), kv: (omotosho2_tr4[0]?.gd ?omotosho2_tr4[0].gd.V : 0)}}],
        'GEREGU (GAS)' : [{gt11: {mw: Number(gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.mw : 0).toFixed(2), kv: (gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.V : 0)}}, 
                        {gt12: {mw: Number(gereguPs_gt12[0]?.gd ?gereguPs_gt12[0].gd.mw : 0).toFixed(2) , kv: (gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.V : 0)}}, 
                        {gt13: {mw: Number(gereguPs_gt13[0]?.gd ?gereguPs_gt13[0].gd.mw : 0).toFixed(2), kv: (gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.V : 0)}}],
        'RIVERS IPP (GAS)' : [{gt1: { mw: Number(riversIppPs_gt1[0]?.gd ?riversIppPs_gt1[0].gd.mw : 0).toFixed(2), kv: (riversIppPs_gt1[0]?.gd ?riversIppPs_gt1[0].gd.V : 0)}}],
        'OMOKU (GAS)' : [{o1r: {mw: Number(omokuPs1_o1r[0]?.td ?omokuPs1_o1r[0].td.mw : 0).toFixed(2), kv: (omokuPs1_o1r[0]?.td ?omokuPs1_o1r[0].td.V : 0)}}],
        'IHOVBOR NIPP (GAS)' : [{gt1: {mw: Number(ihovborNippPs_gt1[0]?.gd ?ihovborNippPs_gt1[0].gd.mw : 0).toFixed(2), kv: (ihovborNippPs_gt1[0]?.gd ?ihovborNippPs_gt1[0].gd.V : 0)}}, 
                                {gt2: {mw: Number(ihovborNippPs_gt2[0]?.gd ?ihovborNippPs_gt2[0].gd.mw : 0).toFixed(2), kv: (ihovborNippPs_gt2[0]?.gd ?ihovborNippPs_gt2[0].gd.V : 0)}}, 
                                {gt3: {mw: Number(ihovborNippPs_gt3[0]?.gd ?ihovborNippPs_gt3[0].gd.mw : 0).toFixed(2), kv: (ihovborNippPs_gt3[0]?.gd ?ihovborNippPs_gt3[0].gd.V : 0)}}, 
                                {gt4: {mw: Number(ihovborNippPs_gt4[0]?.gd ?ihovborNippPs_gt4[0].gd.mw : 0).toFixed(2), kv: (ihovborNippPs_gt4[0]?.gd ?ihovborNippPs_gt4[0].gd.V : 0)}}],

        'OLORUNSOGO NIPP' : [{r1w: {mw: Number(olorunsogoPhase1Gs_r1w[0]?.td ? olorunsogoPhase1Gs_r1w[0].td.mw : 0).toFixed(2), kv: (olorunsogoPhase1Gs_r1w[0]?.td ?olorunsogoPhase1Gs_r1w[0].td.V : 0)}}, 
                            {r2a: {mw: Number(olorunsogoPhase1Gs_r2a[0]?.td ?olorunsogoPhase1Gs_r2a[0].td.mw : 0).toFixed(2), kv: (olorunsogoPhase1Gs_r2a[0]?.td ?olorunsogoPhase1Gs_r2a[0].td.V : 0)}}, 
                            {tr1: {mw: Number(olorunsogo1_tr1[0]?.gd ?olorunsogo1_tr1[0].gd.mw : 0).toFixed(2), kv: (olorunsogo1_tr1[0]?.gd ?olorunsogo1_tr1[0].gd.V : 0)}}, 
                            {tr2: {mw: Number(olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.mw : 0).toFixed(2), kv: (olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.V : 0)}}, 
                            {tr3: {mw: Number(olorunsogoPhase1Gs_tr3[0]?.gd ?olorunsogoPhase1Gs_tr3[0].gd.mw : 0).toFixed(2), kv: (olorunsogoPhase1Gs_tr3[0]?.gd ?olorunsogoPhase1Gs_tr3[0].gd.V : 0)}}, 
                            {tr4: {mw: Number(olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.mw : 0).toFixed(2), kv: (olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.V : 0)}}],

        'PARAS ENERGY (GAS)' : {mw: Number(
            (parasEnergyPs_132cb[0]?.gd ?parasEnergyPs_132cb[0].gd.mw:0)
            ).toFixed(2), kv: (parasEnergyPs_132cb[0]?.gd ?parasEnergyPs_132cb[0].gd.V:0)},

        'OMOTOSHO NIPP (GAS)' : {mw: Number(
            Math.abs(Math.abs(omotoshoNippPs_tr1[0]?.gd ?omotoshoNippPs_tr1[0].gd.mw:0) + Math.abs(omotoshoNippPs_tr2[0]?.gd ?omotoshoNippPs_tr2[0].gd.mw:0) + 
            Math.abs(omotoshoNippPs_tr3[0]?.gd ?omotoshoNippPs_tr3[0].gd.mw:0) + Math.abs(omotoshoNippPs_tr4[0]?.gd ?omotoshoNippPs_tr4[0].gd.mw:0))
                ).toFixed(2), kv: (omotoshoNippPs_tr1[0]?.gd ?omotoshoNippPs_tr1[0].gd.V:0)},

        'GEREGU NIPP (GAS)' : {mw: Number(
            -((gereguPs_r1j[0]?.gd ?gereguPs_r1j[0].gd.mw:0) + (gereguPs_r2j[0]?.gd ?gereguPs_r2j[0].gd.mw:0)) - 
            ((gereguPs_gt11[0]?.gd ?gereguPs_gt11[0].gd.mw:0) + (gereguPs_gt12[0]?.gd ?gereguPs_gt12[0].gd.mw:0) +
            (gereguPs_gt13[0]?.gd ?gereguPs_gt13[0].gd.mw:0))
                ).toFixed(2), kv: (gereguPs_r2j[0]?.gd ?gereguPs_r2j[0].gd.V:0)},

        'AZURA-EDO IPP (GAS)' : {mw: Number(
            -((ihovborNippPs_ohl1[0]?.gd ?ihovborNippPs_ohl1[0].gd.mw:0) + (ihovborNippPs_ohl2[0]?.gd ?ihovborNippPs_ohl2[0].gd.mw:0))
        ).toFixed(2), kv: (ihovborNippPs_ohl1[0]?.gd ?ihovborNippPs_ohl1[0].gd.V:0)},

        'TRANS-AMADI (GAS)' : {mw: Number(
            (transamadiGs_m21p[0]?.td ?transamadiGs_m21p[0].td.mw:0) + (transamadiGs_m22p[0]?.td ?transamadiGs_m22p[0].td.mw:0)
            ).toFixed(2), kv: (transamadiGs_m21p[0]?.td ?transamadiGs_m21p[0].td.V:0)},

        'IBOM POWER (GAS)' : {mw: Number(
            -((eket_e21m[0]?.td ?eket_e21m[0].td.mw:0) + (eket_e22m[0]?.td ?eket_e22m[0].td.mw:0)) - (ekim_ek1m[0]?.td ?ekim_ek1m[0].td.mw:0)
        ).toFixed(2), kv: (eket_e21m[0]?.td ?eket_e21m[0].td.V:0)},

        'GBARAIN NIPP (GAS)' : {mw: Number(
            (gbarain_st1[0]?.gd ?gbarain_st1[0].gd.mw:0) + (gbarain_st2[0]?.gd ?gbarain_st2[0].gd.mw:0)
            ).toFixed(2), kv: (gbarain_st1[0]?.gd ?gbarain_st1[0].gd.V:0)},

        'OLORUNSOGO (GAS)' : {mw: Number(
            Math.abs(olorunsogo1_tr1[0]?.gd ?olorunsogo1_tr1[0].gd.mw:0) + Math.abs(olorunsogo1_tr2[0]?.gd ?olorunsogo1_tr2[0].gd.mw:0) + 
            Math.abs(olorunsogoPhase1Gs_tr3[0]?.gd ?olorunsogoPhase1Gs_tr3[0].gd.mw:0) + Math.abs(olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.mw:0)
                ).toFixed(2), kv: (olorunsogoPhase1Gs_tr4[0]?.gd ?olorunsogoPhase1Gs_tr4[0].gd.V:0)},

        'DADINKOWA G.S (HYDRO)' : {mw: Number(
            (dadinKowaGs_w21b[0]?.td ?dadinKowaGs_w21b[0].td.mw:0) + (dadinKowaGs_w23e[0]?.td ?dadinKowaGs_w23e[0].td.mw:0)
            ).toFixed(2), kv: dadinKowaGs_w21b[0]?.td ?dadinKowaGs_w21b[0].td.V:0},
    };

    return stations_object[station_name]
}

export default get_stations;
