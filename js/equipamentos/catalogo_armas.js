/* ==========================================================================
   js/equipamentos/catalogo_armas.js - Arsenal Completo (45 Armas + Corpo a Corpo)
   Categorias integradas aos bônus dos personagens:
   "assalto", "leve", "secundaria", "escopeta", "sniper", "pesada", "especial", "corpo_a_corpo"
   ========================================================================== */

const CATALOGO_ARMAS = {
    // ======================== SNIPERS / PRECISÃO ========================
    awm: {
        id: "awm", nome: "AWM", categoria: "sniper", slot: 1,
        dano: 145, cadencia: 0.7, pente: 5, reserva: 30, recarga: 2.4, precisao: 0.99,
        mecanica: "ferrolho_devastador", corPrincipal: 0x3b5323, formato: "sniper_longa"
    },
    svd: {
        id: "svd", nome: "SVD", categoria: "sniper", slot: 1,
        dano: 88, cadencia: 2.2, pente: 10, reserva: 50, recarga: 2.1, precisao: 0.96,
        mecanica: "semiauto", corPrincipal: 0x5c4033, formato: "sniper_longa"
    },
    woodpecker: {
        id: "woodpecker", nome: "Woodpecker (Carapina)", categoria: "sniper", slot: 1,
        dano: 76, cadencia: 2.6, pente: 12, reserva: 60, recarga: 1.9, precisao: 0.95,
        mecanica: "perfuracao_colete", corPrincipal: 0x4a2e1b, formato: "rifle_luneta"
    },
    ac80: {
        id: "ac80", nome: "AC80", categoria: "sniper", slot: 1,
        dano: 72, cadencia: 2.5, pente: 10, reserva: 50, recarga: 2.0, precisao: 0.95,
        mecanica: "dano_consecutivo_2x", corPrincipal: 0x2c3539, formato: "rifle_luneta"
    },
    sks: {
        id: "sks", nome: "SKS", categoria: "sniper", slot: 1,
        dano: 58, cadencia: 3.8, pente: 15, reserva: 75, recarga: 1.8, precisao: 0.92,
        mecanica: "semiauto_rapida", corPrincipal: 0x6b4423, formato: "rifle_luneta"
    },
    cg15: {
        id: "cg15", nome: "CG15", categoria: "sniper", slot: 1,
        dano: 42, cadencia: 6.5, pente: 20, reserva: 100, recarga: 1.7, precisao: 0.94,
        mecanica: "carrega_ao_mirar", corPrincipal: 0x00a8ff, formato: "scifi_rifle"
    },
    vss: {
        id: "vss", nome: "VSS", categoria: "sniper", slot: 1,
        dano: 36, cadencia: 7.5, pente: 15, reserva: 90, recarga: 1.6, precisao: 0.93,
        mecanica: "silenciada_nao_alerta", corPrincipal: 0x2f3640, formato: "silenciador_grosso"
    },

    // ======================== FUZIS DE ASSALTO ========================
    ak47: {
        id: "ak47", nome: "AK-47", categoria: "assalto", slot: 1,
        dano: 38, cadencia: 8.5, pente: 30, reserva: 150, recarga: 2.0, precisao: 0.84,
        mecanica: "alto_recuo_dano", corPrincipal: 0x7f4f24, formato: "ak_curvo"
    },
    vandal: {
        id: "vandal", nome: "Vandal", categoria: "assalto", slot: 1,
        dano: 42, cadencia: 8.2, pente: 25, reserva: 125, recarga: 1.9, precisao: 0.87,
        mecanica: "headshot_letal", corPrincipal: 0x1e272e, formato: "ak_curvo"
    },
    m4a1: {
        id: "m4a1", nome: "M4A1", categoria: "assalto", slot: 1,
        dano: 31, cadencia: 10.5, pente: 30, reserva: 150, recarga: 1.7, precisao: 0.91,
        mecanica: "equilibrada", corPrincipal: 0x2f3542, formato: "ar15"
    },
    scar: {
        id: "scar", nome: "SCAR", categoria: "assalto", slot: 1,
        dano: 36, cadencia: 8.8, pente: 25, reserva: 125, recarga: 1.8, precisao: 0.90,
        mecanica: "tijolao_estavel", corPrincipal: 0xc2b280, formato: "scar_pesado"
    },
    aug: {
        id: "aug", nome: "AUG", categoria: "assalto", slot: 1,
        dano: 32, cadencia: 9.8, pente: 30, reserva: 150, recarga: 1.9, precisao: 0.93,
        mecanica: "mira_integrada", corPrincipal: 0x4b5320, formato: "bullpup"
    },
    famas: {
        id: "famas", nome: "FAMAS", categoria: "assalto", slot: 1,
        dano: 29, cadencia: 11.5, pente: 25, reserva: 150, recarga: 1.8, precisao: 0.90,
        mecanica: "rajada_3_tiros", corPrincipal: 0x2c3e50, formato: "bullpup_alca"
    },
    groza: {
        id: "groza", nome: "Groza", categoria: "assalto", slot: 1,
        dano: 44, cadencia: 10.2, pente: 30, reserva: 150, recarga: 1.7, precisao: 0.92,
        mecanica: "raridade_airdrop", corPrincipal: 0x3d3d3d, formato: "bullpup"
    },
    an94: {
        id: "an94", nome: "AN94", categoria: "assalto", slot: 1,
        dano: 34, cadencia: 9.6, pente: 30, reserva: 150, recarga: 1.8, precisao: 0.92,
        mecanica: "primeiros_tiros_rapidos", corPrincipal: 0x353b48, formato: "ak_curvo"
    },
    xm8: {
        id: "xm8", nome: "XM8", categoria: "assalto", slot: 1,
        dano: 31, cadencia: 10.4, pente: 30, reserva: 150, recarga: 1.6, precisao: 0.93,
        mecanica: "scifi_leve", corPrincipal: 0x7f8fa6, formato: "scifi_rifle"
    },
    parafal: {
        id: "parafal", nome: "PARAFAL", categoria: "assalto", slot: 1,
        dano: 46, cadencia: 6.8, pente: 20, reserva: 100, recarga: 2.1, precisao: 0.89,
        mecanica: "dano_bruto", corPrincipal: 0x2d3436, formato: "ar15"
    },
    g36: {
        id: "g36", nome: "G36", categoria: "assalto", slot: 1,
        dano: 33, cadencia: 9.5, pente: 30, reserva: 150, recarga: 1.8, precisao: 0.92,
        mecanica: "modo_duplo_alcance", corPrincipal: 0x2f3640, formato: "bullpup_alca"
    },
    m7: {
        id: "m7", nome: "M7", categoria: "assalto", slot: 1,
        dano: 37, cadencia: 8.6, pente: 25, reserva: 125, recarga: 1.9, precisao: 0.86,
        mecanica: "dano_crescente_rajada", corPrincipal: 0x485460, formato: "scar_pesado"
    },

    // ======================== SUBMETRALHADORAS (LEVES) ========================
    p90: {
        id: "p90", nome: "P90", categoria: "leve", slot: 1,
        dano: 22, cadencia: 14.5, pente: 50, reserva: 200, recarga: 2.0, precisao: 0.86,
        mecanica: "carregador_50", corPrincipal: 0x2c3e50, formato: "p90_futurista"
    },
    mp5: {
        id: "mp5", nome: "MP5", categoria: "leve", slot: 1,
        dano: 24, cadencia: 12.5, pente: 30, reserva: 180, recarga: 1.5, precisao: 0.90,
        mecanica: "alta_mobilidade", corPrincipal: 0x1e272e, formato: "smg_compacta"
    },
    mp5_sd: {
        id: "mp5_sd", nome: "MP5-SD", categoria: "leve", slot: 1,
        dano: 23, cadencia: 12.5, pente: 30, reserva: 180, recarga: 1.6, precisao: 0.92,
        mecanica: "silenciada_hk_slap", corPrincipal: 0x2f3542, formato: "silenciador_grosso"
    },
    ump: {
        id: "ump", nome: "UMP .45", categoria: "leve", slot: 1,
        dano: 30, cadencia: 9.5, pente: 25, reserva: 150, recarga: 1.6, precisao: 0.89,
        mecanica: "alto_poder_parada", corPrincipal: 0x191919, formato: "smg_quadrada"
    },
    mac10: {
        id: "mac10", nome: "MAC-10", categoria: "leve", slot: 2,
        dano: 18, cadencia: 17.5, pente: 32, reserva: 192, recarga: 1.4, precisao: 0.76,
        mecanica: "cadencia_altissima", corPrincipal: 0x4b4b4b, formato: "bloco_compacto"
    },
    mp40: {
        id: "mp40", nome: "MP40", categoria: "leve", slot: 1,
        dano: 26, cadencia: 11.0, pente: 32, reserva: 160, recarga: 1.7, precisao: 0.88,
        mecanica: "classica_curta_distancia", corPrincipal: 0x3d3d3d, formato: "smg_compacta"
    },
    thompson: {
        id: "thompson", nome: "Thompson", categoria: "leve", slot: 1,
        dano: 27, cadencia: 11.8, pente: 50, reserva: 200, recarga: 2.2, precisao: 0.84,
        mecanica: "tambor_gangster", corPrincipal: 0x6f4e37, formato: "tambor_redondo"
    },
    vector: {
        id: "vector", nome: "Vector (Akimbo)", categoria: "leve", slot: 1,
        dano: 19, cadencia: 18.0, pente: 38, reserva: 228, recarga: 1.8, precisao: 0.85,
        mecanica: "akimbo_dupla", corPrincipal: 0x2f3640, formato: "smg_quadrada"
    },
    skorp: {
        id: "skorp", nome: "Skorp", categoria: "leve", slot: 2,
        dano: 20, cadencia: 15.5, pente: 25, reserva: 150, recarga: 1.3, precisao: 0.83,
        mecanica: "penetracao_curta", corPrincipal: 0x353b48, formato: "bloco_compacto"
    },

    // ======================== ESCOPETAS ========================
    m1014: {
        id: "m1014", nome: "M1014", categoria: "escopeta", slot: 1,
        dano: 18, projeteis: 8, cadencia: 3.2, pente: 7, reserva: 42, recarga: 2.3, precisao: 0.72,
        mecanica: "semiauto_escopeta", corPrincipal: 0x2c3a47, formato: "escopeta_longa"
    },
    mag7: {
        id: "mag7", nome: "MAG-7", categoria: "escopeta", slot: 1,
        dano: 22, projeteis: 8, cadencia: 1.5, pente: 5, reserva: 35, recarga: 1.7, precisao: 0.78,
        mecanica: "recarga_pente", corPrincipal: 0x57606f, formato: "smg_quadrada"
    },
    trogon: {
        id: "trogon", nome: "Trogon", categoria: "escopeta", slot: 1,
        dano: 20, projeteis: 7, cadencia: 4.0, pente: 12, reserva: 48, recarga: 2.5, precisao: 0.75,
        mecanica: "rajada_ou_granada", corPrincipal: 0xd35400, formato: "escopeta_tambor"
    },
    charge_buster: {
        id: "charge_buster", nome: "Charge Buster", categoria: "escopeta", slot: 1,
        dano: 35, projeteis: 6, cadencia: 1.2, pente: 6, reserva: 36, recarga: 2.1, precisao: 0.82,
        mecanica: "acumula_energia", corPrincipal: 0x00d2d3, formato: "scifi_cano_duplo"
    },
    m1887: {
        id: "m1887", nome: "M1887 (Bau-Bau)", categoria: "escopeta", slot: 1,
        dano: 28, projeteis: 8, cadencia: 2.0, pente: 2, reserva: 30, recarga: 1.6, precisao: 0.76,
        mecanica: "dois_tiros_impacto", corPrincipal: 0x6d4c41, formato: "cano_curto"
    },
    m590: {
        id: "m590", nome: "M590 Explosiva", categoria: "escopeta", slot: 1,
        dano: 130, projeteis: 1, cadencia: 1.1, pente: 4, reserva: 24, recarga: 2.0, precisao: 0.80,
        mecanica: "projetil_explosivo", corPrincipal: 0x2f3640, formato: "escopeta_longa"
    },

    // ======================== SECUNDÁRIAS / PISTOLAS ========================
    desert_eagle: {
        id: "desert_eagle", nome: "Desert Eagle", categoria: "secundaria", slot: 2,
        dano: 68, cadencia: 3.2, pente: 7, reserva: 42, recarga: 1.5, precisao: 0.89,
        mecanica: "calibre_50", corPrincipal: 0xbdc3c7, formato: "pistola_pesada"
    },
    usps: {
        id: "usps", nome: "USP-S", categoria: "secundaria", slot: 2,
        dano: 34, cadencia: 6.5, pente: 12, reserva: 72, recarga: 1.2, precisao: 0.94,
        mecanica: "silenciada_precisa", corPrincipal: 0x2c3e50, formato: "pistola_silenciada"
    },
    ghost: {
        id: "ghost", nome: "Ghost", categoria: "secundaria", slot: 2,
        dano: 38, cadencia: 6.0, pente: 15, reserva: 75, recarga: 1.3, precisao: 0.96,
        mecanica: "primeiro_tiro_letal", corPrincipal: 0x1e272e, formato: "pistola_silenciada"
    },
    m500: {
        id: "m500", nome: "M500", categoria: "secundaria", slot: 2,
        dano: 85, cadencia: 2.0, pente: 5, reserva: 30, recarga: 1.8, precisao: 0.93,
        mecanica: "mini_sniper", corPrincipal: 0x95a5a6, formato: "revolver_luneta"
    },
    canhao_mao: {
        id: "canhao_mao", nome: "Canhão de Mão", categoria: "secundaria", slot: 2,
        dano: 95, cadencia: 1.8, pente: 4, reserva: 24, recarga: 1.7, precisao: 0.84,
        mecanica: "mini_granadas", corPrincipal: 0xe67e22, formato: "pistola_pesada"
    },

    // ======================== ARMAS PESADAS ========================
    gatling: {
        id: "gatling", nome: "Gatling", categoria: "pesada", slot: 1,
        dano: 24, cadencia: 20.0, pente: 150, reserva: 300, recarga: 3.8, precisao: 0.78,
        mecanica: "giro_previo_lenta", corPrincipal: 0x34495e, formato: "giratoria"
    },
    kord: {
        id: "kord", nome: "Kord .50", categoria: "pesada", slot: 1,
        dano: 52, cadencia: 7.5, pente: 50, reserva