/* ==========================================================================
   js/entidades/tipos_zumbis.js - Arquétipos de Infectados, Boomer e Bosses
   ========================================================================== */

const TIPOS_ZUMBIS = {
    caminhante: {
        nome: "Infectado Comum",
        vidaBase: 90,
        velocidade: 4.2,
        dano: 12,
        cor: 0x3b6e4c,
        escala: { x: 0.75, y: 1.75, z: 0.55 },
        pontos: 100
    },
    corredor: {
        nome: "Corredor Frenético",
        vidaBase: 65,
        velocidade: 8.6,
        dano: 10,
        cor: 0x8e3535,
        escala: { x: 0.68, y: 1.70, z: 0.50 },
        pontos: 150
    },
    blindado: {
        nome: "Guarda Infectado",
        vidaBase: 220,
        velocidade: 3.1,
        dano: 22,
        cor: 0x2c3e50,
        escala: { x: 0.95, y: 1.90, z: 0.70 },
        pontos: 250
    },
    boomer: {
        nome: "Boomer (Explosivo)",
        vidaBase: 75,
        velocidade: 3.6,
        dano: 15,
        explodeAoMorrer: true,
        raioExplosao: 5.5,
        danoExplosao: 45,
        cor: 0x7f8c2a,
        escala: { x: 1.15, y: 1.75, z: 1.05 },
        pontos: 200
    },
    cuspidor: {
        nome: "Cuspidor Químico",
        vidaBase: 110,
        velocidade: 4.5,
        dano: 18,
        cor: 0x27ae60,
        escala: { x: 0.78, y: 1.80, z: 0.55 },
        pontos: 220
    },
    cacador: {
        nome: "Caçador Ágil",
        vidaBase: 130,
        velocidade: 9.8,
        dano: 20,
        cor: 0x4a235a,
        escala: { x: 0.72, y: 1.55, z: 0.65 },
        pontos: 280
    },
    // Mini-Boss da Fase 05 (Subterrâneo da Ultragaz)
    tanker: {
        nome: "MINI-BOSS: Tanker",
        vidaBase: 1800,
        velocidade: 5.4,
        dano: 38,
        ehMiniBoss: true,
        cor: 0x6e2c2c,
        escala: { x: 1.65, y: 2.55, z: 1.35 },
        pontos: 1200
    },
    // Boss da Fase 04 (Zumbi Gigante de 6 Metros com 3 Fases: Bala -> Gasolina/Fogo -> Eletrocussão)
    boss_gigante_6m: {
        nome: "BOSS: Colosso do Novo Mundo (6m)",
        vidaBase: 3500,
        velocidade: 4.4,
        dano: 48,
        ehBoss: true,
        mecanicaTresFases: true,
        cor: 0x4a1c1c,
        escala: { x: 2.6, y: 6.0, z: 2.2 },
        pontos: 3500
    },
    boss_bloco: {
        nome: "Mutante Alfa do Setor",
        vidaBase: 2600,
        velocidade: 5.0,
        dano: 42,
        ehBoss: true,
        cor: 0x7b241c,
        escala: { x: 1.6, y: 2.8, z: 1.3 },
        pontos: 2500
    }
};

// Escalona dificuldade a cada 10 fases e respeita a regra do Bloco 1 (sem mutantes especiais)
function getStatsZumbiPorFase(tipoId, numeroFase) {
    const base = TIPOS_ZUMBIS[tipoId] || TIPOS_ZUMBIS.caminhante;
    const bloco = Math.floor((numeroFase - 1) / 10);
    const multiplicadorVida = 1 + (bloco * 0.35);
    const multiplicadorDano = 1 + (bloco * 0.20);

    return {
        ...base,
        tipoId,
        vidaMax: Math.round(base.vidaBase * multiplicadorVida),
        danoFinal: Math.round(base.dano * multiplicadorDano)
    };
}