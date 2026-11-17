/* ==========================================================================
   js/equipamentos/catalogo_armas.js - Catálogo de Armas por Sobrevivente
   ========================================================================== */

const CATALOGO_ARMAS = {
    rifle_tatico: {
        id: "rifle_tatico",
        nome: "RIFLE TÁTICO M4",
        dano: 32,
        cadencia: 0.12,
        tempoRecarga: 1.8,
        carregador: 30,
        carregadorMax: 30,
        municaoReserva: 180,
        reservaMax: 180,
        alcance: 120,
        automatica: true
    },
    metralhadora_pesada: {
        id: "metralhadora_pesada",
        nome: "METRALHADORA PESADA M60",
        dano: 42,
        cadencia: 0.14,
        tempoRecarga: 2.8,
        carregador: 80,
        carregadorMax: 80,
        municaoReserva: 240,
        reservaMax: 240,
        alcance: 100,
        automatica: true
    },
    submetralhadora: {
        id: "submetralhadora",
        nome: "SMG MP5 TÁTICA",
        dano: 24,
        cadencia: 0.08,
        tempoRecarga: 1.4,
        carregador: 35,
        carregadorMax: 35,
        municaoReserva: 210,
        reservaMax: 210,
        alcance: 75,
        automatica: true
    },
    escopeta_medica: {
        id: "escopeta_medica",
        nome: "ESCOPETA DE COMBATE",
        dano: 95,
        cadencia: 0.65,
        tempoRecarga: 2.1,
        carregador: 8,
        carregadorMax: 8,
        municaoReserva: 64,
        reservaMax: 64,
        alcance: 35,
        automatica: false
    },
    sniper_barrett: {
        id: "sniper_barrett",
        nome: "SNIPER DE PRECISÃO",
        dano: 165,
        cadencia: 0.95,
        tempoRecarga: 2.4,
        carregador: 6,
        carregadorMax: 6,
        municaoReserva: 48,
        reservaMax: 48,
        alcance: 220,
        automatica: false
    },
    ak47_berserker: {
        id: "ak47_berserker",
        nome: "FUZIL AK-47 ASSAULT",
        dano: 38,
        cadencia: 0.13,
        tempoRecarga: 1.9,
        carregador: 30,
        carregadorMax: 30,
        municaoReserva: 180,
        reservaMax: 180,
        alcance: 110,
        automatica: true
    },
    pistola_reserva: {
        id: "pistola_reserva",
        nome: "PISTOLA 9MM (RESERVA)",
        dano: 22,
        cadencia: 0.22,
        tempoRecarga: 1.2,
        carregador: 15,
        carregadorMax: 15,
        municaoReserva: 999,
        reservaMax: 999,
        alcance: 65,
        automatica: false
    },
    faca_tatica: {
        id: "faca_tatica",
        nome: "FACA TÁTICA (CORPO A CORPO)",
        dano: 65,
        cadencia: 0.45,
        tempoRecarga: 0.1,
        carregador: 1,
        carregadorMax: 1,
        municaoReserva: 1,
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