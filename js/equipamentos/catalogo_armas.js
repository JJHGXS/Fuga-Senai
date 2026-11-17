/* ==========================================================================
   js/equipamentos/catalogo_armas.js - Catálogo de Armas por Sobrevivente
   ========================================================================== */

const CATALOGO_ARMAS = {
    rifle_tatico: {
        id: "rifle_tatico",
        nome: "RIFLE TÁTICO M4",
        dano: 32,
        cadencia: 0.12,
        carregadorMax: 30,
        reservaMax: 180,
        alcance: 120,
        automatica: true
    },
    metralhadora_pesada: {
        id: "metralhadora_pesada",
        nome: "METRALHADORA PESADA M60",
        dano: 42,
        cadencia: 0.14,
        carregadorMax: 80,
        reservaMax: 240,
        alcance: 100,
        automatica: true
    },
    submetralhadora: {
        id: "submetralhadora",
        nome: "SMG MP5 TÁTICA",
        dano: 24,
        cadencia: 0.08,
        carregadorMax: 35,
        reservaMax: 210,
        alcance: 75,
        automatica: true
    },
    escopeta_medica: {
        id: "escopeta_medica",
        nome: "ESCOPETA DE COMBATE",
        dano: 95,
        cadencia: 0.65,
        carregadorMax: 8,
        reservaMax: 64,
        alcance: 35,
        automatica: false
    },
    sniper_barrett: {
        id: "sniper_barrett",
        nome: "SNIPER DE PRECISÃO",
        dano: 165,
        cadencia: 0.95,
        carregadorMax: 6,
        reservaMax: 48,
        alcance: 220,
        automatica: false
    },
    ak47_berserker: {
        id: "ak47_berserker",
        nome: "FUZIL AK-47 ASSAULT",
        dano: 38,
        cadencia: 0.13,
        carregadorMax: 30,
        reservaMax: 180,
        alcance: 110,
        automatica: true
    },
    pistola_reserva: {
        id: "pistola_reserva",
        nome: "PISTOLA 9MM (RESERVA)",
        dano: 22,
        cadencia: 0.22,
        carregadorMax: 15,
        reservaMax: 999,
        alcance: 65,
        automatica: false
    },
    faca_tatica: {
        id: "faca_tatica",
        nome: "FACA TÁTICA (CORPO A CORPO)",
        dano: 65,
        cadencia: 0.45,
        carregadorMax: 1,
        reservaMax: 1,
        alcance: 3.2,
        automatica: false,
        corpoACorpo: true
    }
};

function getArma(idArma) {
    return CATALOGO_ARMAS[idArma] || CATALOGO_ARMAS.rifle_tatico;
}

function getArmaPorPersonagem(personagemId) {
    const mapa = {
        mateus: "rifle_tatico",
        nicolas: "metralhadora_pesada",
        luan: "submetralhadora",
        rodrigo: "escopeta_medica",
        kaua: "sniper_barrett",
        joao_cba: "ak47_berserker"
    };
    return getArma(mapa[personagemId]);
}