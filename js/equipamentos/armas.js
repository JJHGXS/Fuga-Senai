/* ==========================================================================
   js/equipamentos/armas.js - Controle de Tiro, Recarga, Slots e Especiais
   ========================================================================== */

const SistemaArmas = {
    slots: {
        1: null, // Primária
        2: null, // Secundária
        3: null  // Corpo a Corpo
    },
    slotAtivo: 1,
    municaoAtual: { 1: 0, 2: 0, 3: 1 },
    municaoReserva: { 1: 0, 2: 0, 3: 1 },
    recarregando: false,
    tempoUltimoTiro: 0,
    calorPlasma: 0, // 0 a 100 para Arma de Plasma
    escudoFrontalAtivo: false,

    // Equipamento inicial automático conforme o personagem escolhido
    inicializarPorPersonagem(idPersonagem) {
        const loadouts = {
            mateus:   { p: "m4a1", s: "usps", m: "chave_grifo" },
            nicolas:  { p: "rpk", s: "desert_eagle", m: "chave_grifo" },
            luan:     { p: "mp5", s: "mac10", m: "chave_grifo" },
            rodrigo:  { p: "ump", s: "arma_tratamento", m: "chave_grifo" },
            kaua:     { p: "awm", s: "ghost", m: "chave_grifo" },
            joao_cba: { p: "vandal", s: "m500", m: "chave_grifo" }
        };

        const kit = loadouts[idPersonagem] || loadouts.mateus;
        this.equiparArma(kit.p, 1);
        this.equiparArma(kit.s, 2);
        this.equiparArma(kit.m, 3);
        this.selecionarSlot(1);
        this.registrarEventos();
    },

    equiparArma(idArma, slotDestino) {
        const arma = getArma(idArma);
        const slot = slotDestino || arma.slot || 1;
        this.slots[slot] = arma;
        this.municaoAtual[slot] = arma.pente;
        this.municaoReserva[slot] = arma.reserva;

        if (this.slotAtivo === slot) {
            this.atualizarHudArma();
            if (typeof ModelosArmas !== "undefined") {
                ModelosArmas.desenharArmaNaMao(arma);
            }
        }
    },

    selecionarSlot(numSlot) {
        if (!this.slots[numSlot] || this.recarregando) return;
        this.slotAtivo = numSlot;
        this.escudoFrontalAtivo = false;
        this.atualizarHudArma();

        if (typeof ModelosArmas !== "undefined") {
            ModelosArmas.desenharArmaNaMao(this.slots[numSlot]);
        }
    },

    getArmaAtiva() {
        return this.slots[this.slotAtivo];
    },

    registrarEventos() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "Digit1") this.selecionarSlot(1);
            if (e.code === "Digit2") this.selecionarSlot(2);
            if (e.code === "Digit3") this.selecionarSlot(3);
            if (e.code === "KeyR") this.iniciarRecarga();
        });

        window.addEventListener("mousedown", (e) => {
            if (document.pointerLockElement !== document.body) return;
            if (e.button === 0) this.atirar();
            if (e.button === 2 && this.getArmaAtiva()?.mecanica === "escudo_energia_frontal") {
                this.escudoFrontalAtivo = true;
            }
        });

        window.addEventListener("mouseup", (e) => {
            if (e.button === 2) this.escudoFrontalAtivo = false;
        });
    },

    atualizar(delta) {
        // Resfria a Arma de Plasma gradualmente
        if (this.calorPlasma > 0) {
            this.calorPlasma = Math.max(0, this.calorPlasma - 25 * delta);
        }
    },

    atirar() {
        const arma = this.getArmaAtiva();
        if (!arma || this.recarregando) return;

        const agora = performance.now() / 1000;
        const intervaloTiro = 1 / arma.cadencia;
        if (agora - this.tempoUltimoTiro < intervaloTiro) return;

        // Verifica munição (exceto corpo a corpo)
        if (arma.categoria !== "corpo_a_corpo") {
            if (this.municaoAtual[this.slotAtivo] <= 0) {
                this.iniciarRecarga();
                return;
            }
            this.municaoAtual[this.slotAtivo]--;
        }

        this.tempoUltimoTiro = agora;
        this.atualizarHudArma();

        // Mecânica Arma de Plasma (mais dano perto de superaquecer)
        let bonusCalor = 1.0;
        if (arma.mecanica === "superaquecimento") {
            this.calorPlasma = Math.min(100, this.calorPlasma + 12);
            bonusCalor = 1 + (this.calorPlasma / 100);
        }

        // Animação visual de recuo na mão
        if (typeof ModelosArmas !== "undefined") {
            ModelosArmas.animarRecuo();
        }

        // Alerta os zumbis próximos caso a arma NÃO seja silenciada
        const silenciada = ["silenciada_nao_alerta", "silenciada_hk_slap", "silenciada_precisa", "primeiro_tiro_letal", "corpo_a_corpo"]
            .includes(arma.mecanica);

        if (!silenciada && typeof Zumbis !== "undefined" && Zumbis.alertarPorSom) {
            Zumbis.alertarPorSom(Jogador.posicao, 45);
        }

        // Executa o disparo 3D (Raycasting a partir do centro da tela)
        this.processarAcerto3D(arma, bonusCalor);
    },

    processarAcerto3D(arma, bonusCalor = 1.0) {
        if (typeof MotorJogo === "undefined" || !MotorJogo.camera) return;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0, 0), MotorJogo.camera);

        // Alcance curto se for arma corpo a corpo (Chave de Grifo)
        if (arma.categoria === "corpo_a_corpo") {
            raycaster.far = 3.2;
        }

        // 1. Verifica se acertou algum zumbi
        if (typeof Zumbis !== "undefined" && Zumbis.listaMeshes) {
            const acertos = raycaster.intersectObjects(Zumbis.listaMeshes, true);
            if (acertos.length > 0) {
                const alvo = acertos[0].object;
                const qtdProjeteis = arma.projeteis || 1;
                const danoBase = arma.dano * qtdProjeteis * bonusCalor;

                // Integra com os bônus do personagem (Kaua crítico 3º tiro, Luan corpo a corpo, João 0,25% cura, etc.)
                const resultado = Jogador.calcularDanoDisparo(danoBase, arma.categoria);
                Zumbis.aplicarDano(alvo, resultado.dano, resultado.critico, arma.mecanica);
            }
        }
    },

    iniciarRecarga() {
        const arma = this.getArmaAtiva();
        if (!arma || arma.categoria === "corpo_a_corpo" || this.recarregando) return;
        if (this.municaoAtual[this.slotAtivo] >= arma.pente) return;
        if (this.municaoReserva[this.slotAtivo] <= 0) return;

        this.recarregando = true;
        document.getElementById("texto-municao").textContent = "RECARREGANDO...";

        setTimeout(() => {
            const faltam = arma.pente - this.municaoAtual[this.slotAtivo];
            const disponivel = Math.min(faltam, this.municaoReserva[this.slotAtivo]);

            this.municaoAtual[this.slotAtivo] += disponivel;
            this.municaoReserva[this.slotAtivo] -= disponivel;
            this.recarregando = false;
            this.atualizarHudArma();
        }, arma.recarga * 1000);
    },

    // Chamado quando o jogador pega uma Caixa de Munição (do Luan ou do mapa)
    reabastecerTudo() {
        [1, 2].forEach(slot => {
            const arma = this.slots[slot];
            if (arma) {
                this.municaoReserva[slot] = arma.reserva;
            }
        });
        this.atualizarHudArma();
    },

    atualizarHudArma() {
        const arma = this.getArmaAtiva();
        if (!arma || typeof UI === "undefined") return;

        if (arma.categoria === "corpo_a_corpo") {
            UI.atualizarMunicao(arma.nome, "∞", "CORPO A CORPO");
        } else {
            UI.atualizarMunicao(arma.nome, this.municaoAtual[this.slotAtivo], this.municaoReserva[this.slotAtivo]);
        }
    }
};