/* ==========================================================================
   js/sistema/progresso.js - Salvamento, Checkpoints por Bloco e Rotas do Hub
   ========================================================================== */

const SistemaProgresso = {
    CHAVE_SAVE: "fuga_senai_progresso_v1",

    estado: {
        fasesConcluidas: [],
        rotasDesbloqueadas: [1, 2], // Fase 01 libera a 02 (Hub)
        rotasSeladas: [],           // Ex: Fase 01 e Fase 03 após concluídas
        alavancasAtivadas: [],
        posicaoHubSalva: null,      // { x, y, z } para voltar ao ponto certo no Hub
        jogadoresMortosNoBloco: []  // IDs de jogadores que expiraram os 120s
    },

    carregar() {
        try {
            const salvo = localStorage.getItem(this.CHAVE_SAVE);
            if (salvo) {
                this.estado = Object.assign(this.estado, JSON.parse(salvo));
            }
        } catch (e) {
            console.warn("Erro ao carregar progresso:", e);
        }
    },

    salvar() {
        try {
            localStorage.setItem(this.CHAVE_SAVE, JSON.stringify(this.estado));
        } catch (e) {
            console.warn("Erro ao salvar progresso:", e);
        }
    },

    // Retorna o checkpoint inicial do Bloco atual (1, 11, 21, 31...)
    getCheckpointDoBloco(numeroFase) {
        return Math.floor((numeroFase - 1) / 10) * 10 + 1;
    },

    // Verifica se o jogador pode entrar em uma rota do Hub
    verificarAcessoRota(numeroFaseDestino) {
        if (numeroFaseDestino === 1) {
            return { permitido: false, mensagem: "Rota bloqueada! Não há volta para o terreno inicial." };
        }
        if (this.estado.rotasSeladas.includes(numeroFaseDestino)) {
            return { permitido: false, mensagem: `Fase ${String(numeroFaseDestino).padStart(2, "0")} já concluída e selada!` };
        }
        if (!this.estado.rotasDesbloqueadas.includes(numeroFaseDestino)) {
            const anterior = String(numeroFaseDestino - 1).padStart(2, "0");
            return { permitido: false, mensagem: `Essa rota está bloqueada! Finalize a Fase ${anterior} primeiro.` };
        }
        return { permitido: true, mensagem: "" };
    },

    // Registra conclusão de uma fase e atualiza as regras do Hub
    concluirFase(numeroFase) {
        if (!this.estado.fasesConcluidas.includes(numeroFase)) {
            this.estado.fasesConcluidas.push(numeroFase);
        }

        // Regras específicas de desbloqueio do Bloco 1 (Jardim Novo Mundo)
        if (numeroFase === 1) {
            this.desbloquearRota(2);
            this.selarRota(1);
        } else if (numeroFase === 3) {
            this.selarRota(3);
            this.desbloquearRota(4);
        } else if (numeroFase === 4) {
            this.selarRota(4);
            // Boss da Fase 04 derruba a energia e abre as rotas 5, 6 e 7 simultaneamente!
            this.desbloquearRota(5);
            this.desbloquearRota(6);
            this.desbloquearRota(7);
        } else if (numeroFase >= 5 && numeroFase <= 9) {
            this.selarRota(numeroFase);
            this.desbloquearRota(numeroFase + 1);
        } else {
            this.desbloquearRota(numeroFase + 1);
        }

        // Se fechou o Bloco (ex: Fase 10 -> 11), revive jogadores mortos no Bloco
        if (numeroFase % 10 === 0) {
            this.estado.jogadoresMortosNoBloco = [];
            this.estado.posicaoHubSalva = null;
        }

        this.salvar();
    },

    desbloquearRota(num) {
        if (!this.estado.rotasDesbloqueadas.includes(num)) {
            this.estado.rotasDesbloqueadas.push(num);
        }
    },

    selarRota(num) {
        if (!this.estado.rotasSeladas.includes(num)) {
            this.estado.rotasSeladas.push(num);
        }
    },

    // Wipe total: todos os jogadores morreram -> reinicia no checkpoint do Bloco
    reiniciarBlocoPorMorteTotal(faseAtual) {
        const faseCheckpoint = this.getCheckpointDoBloco(faseAtual);
        this.estado.jogadoresMortosNoBloco = [];
        this.estado.posicaoHubSalva = null;
        this.salvar();

        GameConfig.faseAtual = faseCheckpoint;
        salvarConfiguracoes();

        alert(`💀 TODA A EQUIPE CAIU! Reiniciando no Checkpoint do Bloco (Fase ${String(faseCheckpoint).padStart(2, "0")}).`);

        if (typeof MotorJogo !== "undefined") {
            MotorJogo.iniciarFase(getFase(faseCheckpoint));
        }
    }
};

SistemaProgresso.carregar();