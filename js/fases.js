/* ==========================================================================
   js/fases.js - Catálogo das 88 Fases (Novo Mundo -> SENAI Luiz Pagliato)
   Escalada de dificuldade a cada 10 fases + Mecânicas estilo Left 4 Dead
   ========================================================================== */

const LISTA_FASES = [
    // ======================================================================
    // ATO 1 (FASES 01 a 10): JARDIM NOVO MUNDO -> CENTRO DE VOTORANTIM
    // Dificuldade: NORMAL | Mecânicas: Caminhadas longas, barricadas simples
    // ======================================================================
    {
        numero: 1,
        nome: "Saída do Jardim Novo Mundo",
        regiao: "Jardim Novo Mundo (Votorantim)",
        tipo: "caminhada_longa",
        tempoEstimado: "15 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase01.js",
        mecanicas: ["caminhada", "barricada_simples"],
        descricao: "Longa caminhada pelas ruas residenciais do Novo Mundo. Encontre suprimentos, contorne os primeiros bloqueios e siga rumo à saída do bairro."
    },
    {
        numero: 2,
        nome: "Subida da Av. Santo Antônio",
        regiao: "Votorantim",
        tipo: "caminhada_longa",
        tempoEstimado: "13 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase02.js",
        mecanicas: ["caminhada", "carros_abandonados"],
        descricao: "Avenida tomada por veículos abandonados. Avance com cautela pelos comércios fechados."
    },
    {
        numero: 3,
        nome: "Travessas da Vila Nova Votorantim",
        regiao: "Votorantim",
        tipo: "caminhada_media",
        tempoEstimado: "10 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase03.js",
        mecanicas: ["caminhada"],
        descricao: "Ruas estreitas onde os infectados podem surgir pelas esquinas."
    },
    {
        numero: 4,
        nome: "Ponte sobre o Rio Sorocaba",
        regiao: "Centro - Votorantim",
        tipo: "caminhada_media",
        tempoEstimado: "10 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase04.js",
        mecanicas: ["caminhada", "gargalo"],
        descricao: "Passagem estreita sobre o rio com pouca cobertura lateral."
    },
    {
        numero: 5,
        nome: "Praça de Eventos Lecy de Campos",
        regiao: "Centro - Votorantim",
        tipo: "caminhada_longa",
        tempoEstimado: "14 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase05.js",
        mecanicas: ["area_aberta", "horda_media"],
        descricao: "Espaço amplo cercado por tendas militares abandonadas."
    },
    {
        numero: 6,
        nome: "Av. 31 de Março - Trecho Sul",
        regiao: "Centro - Votorantim",
        tipo: "caminhada_longa",
        tempoEstimado: "13 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase06.js",
        mecanicas: ["caminhada"],
        descricao: "Corredor principal de Votorantim rumo à saída norte."
    },
    {
        numero: 7,
        nome: "Trilha do Parque do Matão",
        regiao: "Votorantim",
        tipo: "caminhada_media",
        tempoEstimado: "11 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase07.js",
        mecanicas: ["vegetacao", "emboscada"],
        descricao: "Trecho arborizado onde os infectados se escondem entre as árvores."
    },
    {
        numero: 8,
        nome: "Galpões do Bairro Rio Acima",
        regiao: "Votorantim",
        tipo: "caminhada_media",
        tempoEstimado: "10 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase08.js",
        mecanicas: ["caminhada"],
        descricao: "Ruas antigas próximas às fábricas desativadas."
    },
    {
        numero: 9,
        nome: "Terminal Urbano de Votorantim",
        regiao: "Centro - Votorantim",
        tipo: "caminhada_media",
        tempoEstimado: "12 min",
        dificuldade: "NORMAL",
        arquivoMapa: "js/mapas/fase09.js",
        mecanicas: ["plataformas", "horda_media"],
        descricao: "Plataformas cheias de ônibus bloqueando a passagem."
    },
    {
        numero: 10,
        nome: "Avenida Luiz do Patrocínio Fernandes",
        regiao: "Divisa Votorantim / Sorocaba",
        tipo: "caminhada_longa",
        tempoEstimado: "15 min",
        dificuldade: "NORMAL+",
        arquivoMapa: "js/mapas/fase10.js",
        mecanicas: ["barricada_militar", "horda_final_ato"],
        descricao: "Último trecho antes da divisa com Sorocaba. Rompa o bloqueio da quarentena."
    },

    // ======================================================================
    // ATO 2 (FASES 11 a 20): DIVISA -> PARQUE CAMPOLIM
    // Dificuldade: TÁTICO I | Nova Mecânica: PUZZLES DE BLOQUEIO E ENERGIA
    // ======================================================================
    {
        numero: 11,
        nome: "Subestação da Divisa (Posto de Controle)",
        regiao: "Divisa Sorocaba / Votorantim",
        tipo: "puzzle_compacto",
        tempoEstimado: "7 min",
        dificuldade: "TÁTICO I",
        arquivoMapa: "js/mapas/fase11.js",
        mecanicas: ["puzzle_gerador", "portao_trancado"],
        descricao: "Mapa compacto com puzzle. O portão blindado da divisa está sem energia: encontre os 3 fusíveis e religue o gerador para abrir passagem."
    }
];

// Define automaticamente as regras e novas mecânicas a cada bloco de 10 fases
function obterRegrasPorBloco(numeroFase) {
    if (numeroFase <= 10) {
        return { dificuldade: "NORMAL", puzzles: false, corvos: false, carrosAlarme: false, neblina: false, multZumbis: 1.0 };
    } else if (numeroFase <= 20) {
        return { dificuldade: "TÁTICO I", puzzles: true, corvos: false, carrosAlarme: false, neblina: false, multZumbis: 1.2 };
    } else if (numeroFase <= 30) {
        return { dificuldade: "ALERTA I", puzzles: true, corvos: true, carrosAlarme: false, neblina: false, multZumbis: 1.4 };
    } else if (numeroFase <= 40) {
        return { dificuldade: "ALERTA II", puzzles: true, corvos: true, carrosAlarme: true, neblina: false, multZumbis: 1.6 };
    } else if (numeroFase <= 50) {
        return { dificuldade: "DIFÍCIL", puzzles: true, corvos: true, carrosAlarme: true, neblina: false, multZumbis: 1.9 };
    } else if (numeroFase <= 60) {
        return { dificuldade: "PESADELO I", puzzles: true, corvos: true, carrosAlarme: true, neblina: true, multZumbis: 2.2 };
    } else if (numeroFase <= 70) {
        return { dificuldade: "PESADELO II", puzzles: true, corvos: true, carrosAlarme: true, neblina: true, multZumbis: 2.5 };
    } else if (numeroFase <= 80) {
        return { dificuldade: "EXTREMO", puzzles: true, corvos: true, carrosAlarme: true, neblina: true, multZumbis: 2.8 };
    } else {
        return { dificuldade: "SOBREVIVÊNCIA FINAL", puzzles: true, corvos: true, carrosAlarme: true, neblina: true, multZumbis: 3.2 };
    }
}

// Gera os slots das fases 12 até 88 para podermos criar e nomear cada mapa individualmente
(function inicializarFasesRestantes() {
    for (let i = LISTA_FASES.length + 1; i <= 88; i++) {
        const regras = obterRegrasPorBloco(i);
        const ehFaseFinal = (i === 88);
        const ehPuzzle = (i % 5 === 1); // Intercala fases compactas focadas em puzzle

        LISTA_FASES.push({
            numero: i,
            nome: ehFaseFinal ? "SENAI Luiz Pagliato - O Refúgio Final" : `Setor ${i} - Travessia Sorocaba`,
            regiao: ehFaseFinal ? "Jardim Faculdade / Mangal - Sorocaba" : "Rota Sorocaba",
            tipo: ehFaseFinal ? "batalha_final" : (ehPuzzle ? "puzzle_compacto" : "caminhada_longa"),
            tempoEstimado: ehFaseFinal ? "20 min" : (ehPuzzle ? "8 min" : "14 min"),
            dificuldade: regras.dificuldade,
            arquivoMapa: `js/mapas/fase${String(i).padStart(2, '0')}.js`,
            mecanicas: [
                ehPuzzle ? "puzzle_bloqueio" : "caminhada",
                ...(regras.corvos ? ["corvos_alerta"] : []),
                ...(regras.carrosAlarme ? ["carros_alarme"] : []),
                ...(regras.neblina ? ["neblina_densa"] : [])
            ],
            descricao: ehFaseFinal
                ? "Você chegou aos portões do SENAI Luiz Pagliato! Resista à horda final nas oficinas até o resgate chegar."
                : "Fase da campanha — o mapa individual deste setor será desenhado com obstáculos e desafios próprios."
        });
    }
})();

// Busca os dados de uma fase específica pelo número (1 a 88)
function getFase(numero) {
    return LISTA_FASES.find(f => f.numero === numero) || LISTA_FASES[0];
}