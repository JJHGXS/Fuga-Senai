/* ==========================================================================
   js/entidades/personagens.js - Os 6 Sobreviventes do SENAI Luiz Pagliato
   ========================================================================== */

const LISTA_PERSONAGENS = {
    mateus: {
        id: "mateus",
        nome: "Mateus",
        classe: "Comandante",
        descricao: "Equilíbrio perfeito. Emite aura de comando que aumenta o dano da equipe e reseta o tempo de recarga das habilidades.",
        status: {
            vidaMax: 120,
            estaminaMax: 100,
            velocidadeMult: 1.0,    // Equilibrado
            danoMult: 1.05,         // Leve bônus de liderança
            defesaMult: 1.0,
            precisaoMult: 1.0
        },
        afinidadeArmas: ["todas"],
        habilidade: {
            nome: "Ordem de Avanço (Buff & Reset)",
            tecla: "Q",
            cooldownSegundos: 35,
            duracaoSegundos: 10,
            bonusDanoEquipe: 1.35,  // +35% de dano para todos perto dele
            resetaCooldownAliados: true
        },
        passiva: "Liderança Tática: Equilíbrio total e redução de 10% nos cooldowns."
    },

    nicolas: {
        id: "nicolas",
        nome: "Nicolas Gregorio",
        classe: "Tanker",
        descricao: "Especialista em armas pesadas. Possui armadura e vida altíssimas para segurar a linha de frente, mas se move devagar.",
        status: {
            vidaMax: 240,           // Muita vida
            estaminaMax: 80,
            velocidadeMult: 0.78,   // Pouca velocidade
            danoMult: 1.15,         // Forte com armas pesadas
            defesaMult: 1.40,       // Recebe 40% menos dano
            precisaoMult: 0.90
        },
        afinidadeArmas: ["pesada", "escopeta"],
        habilidade: {
            nome: "Postura Inabalável",
            tecla: "Q",
            cooldownSegundos: 30,
            duracaoSegundos: 8,
            reducaoDanoExtra: 0.50  // Fica quase invulnerável por 8s
        },
        passiva: "Blindagem Pesada: +25% de dano com Metralhadoras Pesadas e Escopetas."
    },

    luan: {
        id: "luan",
        nome: "Luan",
        classe: "Engenheiro",
        descricao: "Mestre em armas corpo a corpo e pistolas/SMGs. Carrega Caixa de Munição e constrói uma Torreta Automática a cada 20 abates.",
        status: {
            vidaMax: 115,
            estaminaMax: 115,
            velocidadeMult: 1.08,
            danoMult: 1.0,
            danoCorpoACorpoMult: 1.60, // Forte no corpo a corpo
            danoLevesMult: 1.30,       // Forte com secundárias/leves
            defesaMult: 1.0,
            precisaoMult: 1.05
        },
        afinidadeArmas: ["corpo_a_corpo", "secundaria", "leve"],
        habilidade: {
            nome: "Caixa de Munição & Torreta SENAI",
            tecla: "Q",
            cooldownSegundos: 25,   // Para soltar Caixa de Munição
            killsParaTorreta: 20,   // Constrói Torreta a cada 20 kills
            duracaoTorretaSeg: 25
        },
        passiva: "Sucateiro Técnico: +60% dano corpo a corpo, +30% com secundárias e libera Torreta a cada 20 kills."
    },

    rodrigo: {
        id: "rodrigo",
        nome: "Rodrigo",
        classe: "Médico",
        descricao: "Ágil e resistente. Carrega Kits Médicos que curam 50% da vida máxima (recupera 1 kit a cada 5 abates). Possui pouco dano e pouca estamina.",
        status: {
            vidaMax: 175,           // Muita vida (menor que os 240 do Tanker)
            estaminaMax: 65,        // Pouca estamina
            velocidadeMult: 1.22,   // Rápido
            danoMult: 0.78,         // Pouco dano
            defesaMult: 1.10,
            precisaoMult: 1.0
        },
        afinidadeArmas: ["leve", "secundaria"],
        habilidade: {
            nome: "Kit Médico de Campo (50% Cura)",
            tecla: "Q",
            curaPorcentagem: 0.50,  // Cura 50% da vida máxima
            cargasIniciais: 2,
            cargasMaximas: 3,
            killsParaRecarga: 5     // Ganha +1 Kit Médico a cada 5 kills
        },
        passiva: "Paramédico Ágil: Alta velocidade e recupera 1 Kit Médico (50% HP) a cada 5 abates."
    },

    kaua: {
        id: "kaua",
        nome: "Kaua",
        classe: "Sniper",
        descricao: "Atirador de elite com dano massivo e alta precisão, mas defesa frágil. A cada 3 tiros acertados, dispara um Crítico devastador.",
        status: {
            vidaMax: 85,            // Defesa baixa
            estaminaMax: 100,
            velocidadeMult: 1.05,
            danoMult: 1.45,         // Dano massivo
            defesaMult: 0.75,       // Recebe 25% mais dano
            precisaoMult: 1.50      // Alta assertividade (menos recuo/espalhamento)
        },
        afinidadeArmas: ["sniper", "precisao"],
        habilidade: {
            nome: "Tiro Perfurante (3º Acerto Crítico)",
            tecla: "Passiva / Q",
            acertosParaCritico: 3,  // A cada 3 tiros acertados
            multiplicadorCritico: 2.5 // 250% de dano no 3º tiro
        },
        passiva: "Olho de Águia: Alta precisão e a cada 3 tiros acertados causa Dano Crítico massivo."
    },

    joao_cba: {
        id: "joao_cba",
        nome: "João CBA",
        classe: "Juggernaut / Assault",
        descricao: "Equilíbrio perfeito e autossuficiente. Imune a curas de Médicos, recupera 0,25% de vida por tiro acertado e ativa Modo Berserker trocando estamina por dano.",
        status: {
            vidaMax: 140,
            estaminaMax: 120,
            velocidadeMult: 1.02,
            danoMult: 1.05,
            defesaMult: 1.15,
            precisaoMult: 1.0
        },
        afinidadeArmas: ["assalto", "todas"],
        habilidade: {
            nome: "Modo Berserker (Estamina ➔ Dano)",
            tecla: "Q",
            custoEstaminaPorSeg: 18, // Drena estamina enquanto ativo
            bonusDanoBerserker: 1.65 // +65% de dano enquanto drena estamina
        },
        passiva: "Lobo Solitário: Não recebe cura de Médicos, mas regenera 0,25% da vida máxima a cada tiro acertado."
    }
};

// Retorna o objeto do personagem escolhido (padrão: Mateus)
function getPersonagem(id) {
    return LISTA_PERSONAGENS[id] || LISTA_PERSONAGENS.mateus;
}