export default (state_data) => {
    if (!state_data) {
        return;
    }
    // console.log(state_data, 'the state data');
    // return;
    const ekim_ek1m = state_data?.ekim?.lines ? this.state.ekim.lines.filter(line => line.id === "ek1m").td : {mw: null, V: null};
    const eket_e21m = state_data?.eket?.lines ? this.state.eket.lines.filter(line => line.id === "e21m").td : {mw: null, V: null};
    const eket_e22m = state_data?.eket?.lines ? this.state.eket.lines.filter(line => line.id === "e22m").td : {mw: null, V: null};
    const kainjiTs_k1j = state_data?.kainjiTs?.lines ? this.state.kainjiTs.lines.filter(line => line.id === "k1j").td : {mw: null, V: null};
    const kainjiTs_k2j = state_data?.kainjiTs?.lines ? this.state.kainjiTs.lines.filter(line => line.id === "k2j").td : {mw: null, V: null};
    const kainjiTs_k3r = state_data?.kainjiTs?.lines ? this.state.kainjiTs.lines.filter(line => line.id === "k3r").td : {mw: null, V: null};
    const kainjiTs_k1f = state_data?.kainjiTs?.lines ? this.state.kainjiTs.lines.filter(line => line.id === "k1f").td : {mw: null, V: null};
    const egbinPs_st1 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const egbinPs_st2 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st2").gd : {mw: null, V: null};
    const egbinPs_st3 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st3").gd : {mw: null, V: null};
    const egbinPs_st4 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st4").gd : {mw: null, V: null};
    const egbinPs_st5 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st5").gd : {mw: null, V: null};
    const egbinPs_st6 = state_data?.egbinPs?.units ? this.state.egbinPs.units.filter(line => line.id === "st6").gd : {mw: null, V: null};
    const shiroroPs_411g1 = state_data?.shiroroPs?.units ? this.state.shiroroPs.units.filter(line => line.id === "411g1").gd : {mw: null, V: null};
    const shiroroPs_411g2 = state_data?.shiroroPs?.units ? this.state.shiroroPs.units.filter(line => line.id === "411g2").gd : {mw: null, V: null};
    const shiroroPs_411g3 = state_data?.shiroroPs?.units ? this.state.shiroroPs.units.filter(line => line.id === "411g3").gd : {mw: null, V: null};
    const shiroroPs_411g4 = state_data?.shiroroPs?.units ? this.state.shiroroPs.units.filter(line => line.id === "411g4").gd : {mw: null, V: null};
    const afamIv_vPs_gt17 = state_data?.afamIv_vPs?.units ? this.state.afamIv_vPs.units.filter(line => line.id === "gt17").td : {mw: null, V: null};
    const afamIv_vPs_gt18 = state_data?.afamIv_vPs?.units ? this.state.afamIv_vPs.units.filter(line => line.id === "gt18").td : {mw: null, V: null};
    const omotosho1_tr1 = state_data?.omotosho1?.lines ? this.state.omotosho1.lines.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const omotosho1_tr2 = state_data?.omotosho1?.lines ? this.state.omotosho1.lines.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const omotosho2_tr3 = state_data?.omotosho2?.lines ? this.state.omotosho2.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const omotosho2_tr4 = state_data?.omotosho2?.lines ? this.state.omotosho2.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const deltaGs_g3b = state_data?.deltaGs?.lines ? this.state.deltaGs.lines.filter(line => line.id === "g3b").td : {mw: null, V: null};
    const deltaGs_s4g = state_data?.deltaGs?.lines ? this.state.deltaGs.lines.filter(line => line.id === "s4g").td : {mw: null, V: null};
    const okpaiGs_k1t = state_data?.okpaiGs?.lines ? this.state.okpaiGs.lines.filter(line => line.id === "k1t").td : {mw: null, V: null};
    const okpaiGs_k2t = state_data?.okpaiGs?.lines ? this.state.okpaiGs.lines.filter(line => line.id === "k2t").td : {mw: null, V: null};
    const jebbaTs_b8j = state_data?.jebbaTs?.lines ? this.state.jebbaTs.lines.filter(line => line.id === "b8j").td : {mw: null, V: null};
    const jebbaTs_b9j = state_data?.jebbaTs?.lines ? this.state.jebbaTs.lines.filter(line => line.id === "b9j").td : {mw: null, V: null};    
    const alaoji_l7a = state_data?.alaoji?.lines ? this.state.alaoji.lines.filter(line => line.id === "l7a").td : {mw: null, V: null};
    const alaoji_l8a = state_data?.alaoji?.lines ? this.state.alaoji.lines.filter(line => line.id === "l8a").td : {mw: null, V: null};
    const afamViTs_ada200 = state_data?.afamViTs?.lines ? this.state.afamViTs.lines.filter(line => line.id === "ada200").td : {mw: null, V: null};
    const afamViTs_adb200 = state_data?.afamViTs?.lines ? this.state.afamViTs.lines.filter(line => line.id === "adb200").td : {mw: null, V: null};
    const phMain_m21p = state_data?.phMain?.lines ? this.state.phMain.lines.filter(line => line.id === "m21p").td : {mw: null, V: null};
    const odukpaniGs_d1b = state_data?.odukpaniGs?.lines ? this.state.odukpaniGs.lines.filter(line => line.id === "d1b").td : {mw: null, V: null};
    const odukpaniGs_d2b = state_data?.odukpaniGs?.lines ? this.state.odukpaniGs.lines.filter(line => line.id === "d2b").td : {mw: null, V: null};
    const omotoshoNippPs_tr1 = state_data?.omotoshoNippPs?.units ? this.state.omotoshoNippPs.units.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const omotoshoNippPs_tr2 = state_data?.omotoshoNippPs?.units ? this.state.omotoshoNippPs.units.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const omotoshoNippPs_tr3 = state_data?.omotoshoNippPs?.units ? this.state.omotoshoNippPs.units.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const omotoshoNippPs_tr4 = state_data?.omotoshoNippPs?.units ? this.state.omotoshoNippPs.units.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const sapeleNippPs_st1 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const sapeleNippPs_st3 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "st3").gd : {mw: null, V: null};
    const sapeleNippPs_gt1 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const sapeleNippPs_gt2 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "gt2").gd : {mw: null, V: null};
    const sapeleNippPs_gt3 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "gt3").gd : {mw: null, V: null};
    const sapeleNippPs_gt4 = state_data?.sapeleNippPs?.units ? this.state.sapeleNippPs.units.filter(line => line.id === "gt4").gd : {mw: null, V: null};
    const omokuPs1_o1r = state_data?.omokuPs1?.lines ? this.state.omokuPs1.lines.filter(line => line.id === "o1r").td : {mw: null, V: null};
    const riversIppPs_gt1 = state_data?.riversIppPs?.units ? this.state.riversIppPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const ikotEkpene_d1k = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "d1k").td : {mw: null, V: null};
    const ikotEkpene_d2k = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "d2k").td : {mw: null, V: null};
    const ikotEkpene_k1u = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "k1u").td : {mw: null, V: null};
    const ikotEkpene_k2u = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "k2u").td : {mw: null, V: null};
    const ikotEkpene_k3u = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "k3u").td : {mw: null, V: null};
    const ikotEkpene_k4u = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "k4u").td : {mw: null, V: null};
    const ikotEkpene_a1k = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "a1k").td : {mw: null, V: null};
    const ikotEkpene_a2k = state_data?.ikotEkpene?.lines ? this.state.ikotEkpene.lines.filter(line => line.id === "a2k").td : {mw: null, V: null};
    const gereguPs_r1j = state_data?.gereguPs?.units ? this.state.gereguPs.units.filter(line => line.id === "r1j").gd : {mw: null, V: null};
    const gereguPs_r2j = state_data?.gereguPs?.units ? this.state.gereguPs.units.filter(line => line.id === "r2j").gd : {mw: null, V: null};
    const gereguPs_gt11 = state_data?.gereguPs?.units ? this.state.gereguPs.units.filter(line => line.id === "gt11").gd : {mw: null, V: null};
    const gereguPs_gt12 = state_data?.gereguPs?.units ? this.state.gereguPs.units.filter(line => line.id === "gt12").gd : {mw: null, V: null};
    const gereguPs_gt13 = state_data?.gereguPs?.units ? this.state.gereguPs.units.filter(line => line.id === "gt13").gd : {mw: null, V: null};    
    const delta3_tr5 = state_data?.delta3?.lines ? this.state.delta3.lines.filter(line => line.id === "tr5").gd : {mw: null, V: null};
    const delta3_tr6 = state_data?.delta3?.lines ? this.state.delta3.lines.filter(line => line.id === "tr6").gd : {mw: null, V: null};
    const delta2_tr3 = state_data?.delta2?.lines ? this.state.delta2.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const delta2_tr4 = state_data?.delta2?.lines ? this.state.delta2.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const olorunsogo1_tr1 = state_data?.olorunsogo1?.lines ? this.state.olorunsogo1.lines.filter(line => line.id === "tr1").gd : {mw: null, V: null};
    const olorunsogo1_tr2 = state_data?.olorunsogo1?.lines ? this.state.olorunsogo1.lines.filter(line => line.id === "tr2").gd : {mw: null, V: null};
    const ihovborNippPs_ohl1 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "ohl1").gd : {mw: null, V: null};
    const ihovborNippPs_ohl2 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "ohl2").gd : {mw: null, V: null};
    const ihovborNippPs_gt1 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "gt1").gd : {mw: null, V: null};
    const ihovborNippPs_gt2 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "gt2").gd : {mw: null, V: null};
    const ihovborNippPs_gt3 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "gt3").gd : {mw: null, V: null};
    const ihovborNippPs_gt4 = state_data?.ihovborNippPs?.units ? this.state.ihovborNippPs.units.filter(line => line.id === "gt4").gd : {mw: null, V: null};
    const parasEnergyPs_132cb = state_data?.parasEnergyPs?.lines ? this.state.parasEnergyPs.lines.filter(line => line.id === "132cb").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_r2a = state_data?.olorunsogoPhase1Gs?.lines ? this.state.olorunsogoPhase1Gs.lines.filter(line => line.id === "r2a").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_r1w = state_data?.olorunsogoPhase1Gs?.lines ? this.state.olorunsogoPhase1Gs.lines.filter(line => line.id === "r1w").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_tr3 = state_data?.olorunsogoPhase1Gs?.lines ? this.state.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr3").gd : {mw: null, V: null};
    const olorunsogoPhase1Gs_tr4 = state_data?.olorunsogoPhase1Gs?.lines ? this.state.olorunsogoPhase1Gs.lines.filter(line => line.id === "tr4").gd : {mw: null, V: null};
    const gbarain_st1 = state_data?.gbarain?.units ? this.state.gbarain.units.filter(line => line.id === "st1").gd : {mw: null, V: null};
    const gbarain_st2 = state_data?.gbarain?.units ? this.state.gbarain.units.filter(line => line.id === "st2").gd : {mw: null, V: null};
    const dadinKowaGs_w21b = state_data?.dadinKowaGs?.lines ? this.state.dadinKowaGs.lines.filter(line => line.id === "w21b").td : {mw: null, V: null};
    const dadinKowaGs_w23e = state_data?.dadinKowaGs?.lines ? this.state.dadinKowaGs.lines.filter(line => line.id === "w23e").td : {mw: null, V: null};
    const lokojaTs_j1l = state_data?.lokojaTs?.lines ? this.state.lokojaTs.lines.filter(line => line.id === "j1l").td : {mw: null, V: null};
    const lokojaTs_j2l = state_data?.lokojaTs?.lines ? this.state.lokojaTs.lines.filter(line => line.id === "j2l").td : {mw: null, V: null};
    const lokojaTs_l6g = state_data?.lokojaTs?.lines ? this.state.lokojaTs.lines.filter(line => line.id === "l6g").td : {mw: null, V: null};
    const lokojaTs_l7g = state_data?.lokojaTs?.lines ? this.state.lokojaTs.lines.filter(line => line.id === "l7g").td : {mw: null, V: null};
    const gwagwalada_g5b = state_data?.gwagwalada?.lines ? this.state.gwagwalada.lines.filter(line => line.id === "g5b").td : {mw: null, V: null};
    const gwagwalada_r3g = state_data?.gwagwalada?.lines ? this.state.gwagwalada.lines.filter(line => line.id === "r3g").td : {mw: null, V: null};
    const asaba_b3d = state_data?.asaba?.lines ? this.state.asaba.lines.filter(line => line.id === "b3d").td : {mw: null, V: null};
    const asaba_d3t = state_data?.asaba?.lines ? this.state.asaba.lines.filter(line => line.id === "d3t").td : {mw: null, V: null};
    const ugwuaji_u1a = state_data?.gbarain?.lines ? this.state.gbarain.lines.filter(line => line.id === "u1a").td : {mw: null, V: null};
    const ugwuaji_u2a = state_data?.gbarain?.lines ? this.state.gbarain.lines.filter(line => line.id === "u2a").td : {mw: null, V: null};

    const station_array = { 
        'EKET': {mw: Number(eket_e21m.mw + eket_e22m.mw).toFixed(2), kv: eket_e21m.V},
        'PORT-HARCOURT MAIN' : {mw: Number(phMain_m21p.mw).toFixed(2), kv: phMain_m21p.V},
        'LOKOJA TS' : {mw: Number(
            (lokojaTs_j1l.mw + lokojaTs_j2l.mw) - 
            (lokojaTs_l6g.mw + lokojaTs_l7g.mw)
                ).toFixed(2), kv: lokojaTs_j1l.V},
        'EKIM' : {mw: Number(ekim_ek1m.mw).toFixed(2), kv: ekim_ek1m.V},
        'IKOT EKPENE' : {mw: Number(
            (ikotEkpene_a1k.mw + ikotEkpene_a2k.mw + ikotEkpene_d1k.mw + ikotEkpene_d2k.mw) - 
            (ikotEkpene_k1u.mw + ikotEkpene_k2u.mw + ikotEkpene_k3u.mw + ikotEkpene_k4u.mw)
                ).toFixed(2), kv: ikotEkpene_d1k.V}, 
        'GWAGWALADA' : {mw: Number(gwagwalada_g5b.mw + gwagwalada_r3g.mw).toFixed(2), kv: gwagwalada_g5b.V},
        'UGWUAJI' : {mw: Number(ugwuaji_u1a.mw + ugwuaji_u2a.mw).toFixed(2), kv: ugwuaji_u1a.V},
        'ASABA' : {mw: Number(asaba_b3d.mw + asaba_d3t.mw).toFixed(2), kv: asaba_b3d.V},
        'SHIRORO (HYDRO)' : {mw: Number(
            shiroroPs_411g1.mw + shiroroPs_411g2.mw + shiroroPs_411g3.mw + shiroroPs_411g4.mw    
                ).toFixed(2), kv: shiroroPs_411g1.V},
        'AFAM IV & V (GAS)' : {mw: Number(afamViTs_ada200.mw + afamViTs_adb200.mw).toFixed(2), kv: afamViTs_ada200.V},
        'KAINJI (HYDRO)' : {mw: Number(
            kainjiTs_k1f.mw + kainjiTs_k1j.mw + kainjiTs_k2j.mw + kainjiTs_k3r.mw
                ).toFixed(2), kv: kainjiTs_k1f.V},
        'EGBIN (STEAM)' : {mw: Number(
            egbinPs_st1.mw + egbinPs_st2.mw + egbinPs_st3.mw + egbinPs_st4.mw + egbinPs_st5.mw + egbinPs_st6.mw
                ).toFixed(2), kv: egbinPs_st1.V},
        'OKPAI (GAS/STEAM)' : {mw: Number(okpaiGs_k1t.mw + okpaiGs_k2t.mw).toFixed(2), kv: okpaiGs_k1t.V},
        'DELTA (GAS)' : {mw: Number(
            delta2_tr3.mw + delta2_tr4.mw + delta3_tr5.mw + delta3_tr6.mw + deltaGs_g3b.mw + deltaGs_s4g.mw    
                ).toFixed(2), kv: delta2_tr3.V},
        'JEBBA (HYDRO)' : {mw: Number(jebbaTs_b8j.mw + jebbaTs_b9j.mw).toFixed(2), kv: jebbaTs_b8j.V},
        'AFAM VI (GAS/STEAM)' : {mw: Number(afamIv_vPs_gt17.mw + afamIv_vPs_gt18.mw).toFixed(2), kv: afamIv_vPs_gt17.V},
        'ALAOJI NIPP (GAS)' : {mw: Number(alaoji_l7a.mw + alaoji_l8a.mw).toFixed(2), kv: alaoji_l7a.V},
        'SAPELE (STEAM)' : {mw: Number(sapeleNippPs_st1.mw + sapeleNippPs_st3.mw).toFixed(2), kv: sapeleNippPs_st1.V},
        'SAPELE NIPP (GAS)' : {mw: Number(
            sapeleNippPs_gt1.mw + sapeleNippPs_gt2.mw + sapeleNippPs_gt3.mw + sapeleNippPs_gt4.mw
                ).toFixed(2), kv: sapeleNippPs_gt1.V},
        'ODUKPANI NIPP (GAS)' : {mw: Number(
            odukpaniGs_d1b.mw + odukpaniGs_d2b.mw + ikotEkpene_d1k.mw + ikotEkpene_d2k.mw
                ).toFixed(2), kv: odukpaniGs_d1b.V},
        'OMOTOSHO (GAS)' : {mw: Number(
            omotosho1_tr1.mw + omotosho1_tr2.mw + omotosho2_tr3.mw + omotosho2_tr4.mw
                ).toFixed(2), kv: omotosho1_tr1.V},
        'GEREGU (GAS)' : {mw: Number(
            gereguPs_gt11.mw + gereguPs_gt12.mw + gereguPs_gt13.mw
                ).toFixed(2), kv: gereguPs_gt11.V},
        'RIVERS IPP (GAS)' : {mw: Number(riversIppPs_gt1.mw).toFixed(2), kv: riversIppPs_gt1.V},
        'OMOKU (GAS)' : {mw: Number(omokuPs1_o1r.mw).toFixed(2), kv: omokuPs1_o1r.V},
        'IHOVBOR NIPP (GAS)' : {mw: Number(
            ihovborNippPs_gt1.mw + ihovborNippPs_gt2.mw + ihovborNippPs_gt3.mw + ihovborNippPs_gt4.mw
                ).toFixed(2), kv: ihovborNippPs_gt1.V},
        'OLORUNSOGO NIPP' : {mw: Number(
            (olorunsogoPhase1Gs_r1w.mw + olorunsogoPhase1Gs_r2a.mw) - 
            (olorunsogo1_tr1.mw + olorunsogo1_tr2.mw + olorunsogoPhase1Gs_tr3.mw + olorunsogoPhase1Gs_tr4.mw)
                ).toFixed(2), kv: olorunsogoPhase1Gs_r1w.V},
        'PARAS ENERGY (GAS)' : {mw: Number(parasEnergyPs_132cb.mw).toFixed(2), kv: parasEnergyPs_132cb.V},
        'OMOTOSHO NIPP (GAS)' : {mw: Number(
            omotoshoNippPs_tr1.mw + omotoshoNippPs_tr2.mw + omotoshoNippPs_tr3.mw + omotoshoNippPs_tr4.mw
                ).toFixed(2), kv: omotoshoNippPs_tr1.V},
        'GEREGU NIPP (GAS)' : {mw: Number(
            -(gereguPs_r1j.mw + gereguPs_r1j.mw) - (gereguPs_gt11.mw + gereguPs_gt12.mw + gereguPs_gt13.mw)
                ).toFixed(2), kv: gereguPs_r2j.V},
        'AZURA-EDO IPP (GAS)' : {mw: Number(
            -(ihovborNippPs_ohl1.mw + ihovborNippPs_ohl2.mw)
        ).toFixed(2), kv: ihovborNippPs_ohl1.V},
        'TRANS-AMADI (GAS)' : {mw: Number(phMain_m21p.mw).toFixed(2), kv: phMain_m21p.V},
        'IBOM POWER (GAS)' : {mw: Number(
            -(eket_e21m.mw + eket_e22m.mw) - (ekim_ek1m.mw)
        ).toFixed(2), kv: eket_e21m.V},
        'GBARAIN NIPP (GAS)' : {mw: Number(gbarain_st1.mw + gbarain_st2.mw).toFixed(2), kv: gbarain_st1.V},
        'OLORUNSOGO (GAS)' : {mw: Number(
            olorunsogo1_tr1.mw + olorunsogo1_tr2.mw + olorunsogoPhase1Gs_tr3.mw + olorunsogoPhase1Gs_tr4.mw
                ).toFixed(2), kv: olorunsogo1_tr1.V},
        'DADINKOWA G.S (HYDRO)' : {mw: Number(dadinKowaGs_w21b.mw + dadinKowaGs_w23e.mw).toFixed(2), kv: dadinKowaGs_w21b.V},
    };
    return station_array;
}