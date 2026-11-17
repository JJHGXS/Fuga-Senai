/* ==========================================================================
   js/sistema/reanimacao.js - Sistema de Incapacitado (120s para Levantar)
   ========================================================================== */

const SistemaReanimacao = {
    caido: false,
    mortoDefinitivoNoBloco: false,
    tempoRestante: 120,
    progressoResgate: 0, // 0 a 3 segundos segurando [E]
    bannerAviso: null,

    resetarParaNovaFase() {
        const meuId = (typeof Multiplayer !== "undefined") ? Multiplayer.meuId : "solo";
        this.mortoDefinitivoNoBloco = SistemaProgresso.estado.jogadoresMortosNoBloco.includes(meuId);
        this.caido = false;
        this.tempoRestante = 120;
        this.progressoResgate = 0;
        this.atualizarBanner();
    },

    derrubarJogador() {
        if (this.caido || this.mortoDefinitivoNoBloco) return;

        // No modo Solo sem aliados vivos, morte direta aciona o reset do Bloco
        const temAliadosOnline = (typeof Multiplayer !== "undefined" && Multiplayer.conectado && Object.keys(Multiplayer.aliados).length > 0);
        if (!temAliadosOnline) {
            SistemaProgresso.reiniciarBlocoPorMorteTotal(GameConfig.faseAtual);
            return;
        }

        this.caido = true;
        this.tempoRestante = 120;
        this.progressoResgate = 0;

        if (typeof Multiplayer !== "undefined" && Multiplayer.canalSala) {
            Multiplayer.canalSala.send({
                type: "broadcast",
                event: "status_vida",
                payload: { id: Multiplayer.meuId, status: "caido", tempo: 120 }
            });
        }

        this.atualizarBanner();
    },

    levantarJogador() {
        this.caido = false;
        this.tempoRestante = 120;
        this.progressoResgate = 0;

        if (typeof Jogador !== "undefined") {
            Jogador.vida = Math.ceil(Jogador.vidaMax * 0.4); // Levanta com 40% da vida
            if (typeof UI !== "undefined") UI.atualizarVida(Jogador.vida, Jogador.vidaMax);
        }

        this.atualizarBanner();
    },

    atualizar(delta) {
        if (this.caido && !this.mortoDefinitivoNoBloco) {
            this.tempoRestante -= delta;
            this.atualizarBanner();

            if (this.tempoRestante <= 0) {
                this.confirmarMorteNoBloco();
            }
        }
    },

    confirmarMorteNoBloco() {
        this.caido = false;
        this.mortoDefinitivoNoBloco = true;

        const meuId = (typeof Multiplayer !== "undefined") ? Multiplayer.meuId : "solo";
        if (!SistemaProgresso.estado.jogadoresMortosNoBloco.includes(meuId)) {
            SistemaProgresso.estado.jogadoresMortosNoBloco.push(meuId);
            SistemaProgresso.salvar();
        }

        this.atualizarBanner();
        this.verificarSeTodosMorreram();
    },

    verificarSeTodosMorreram() {
        const totalJogadores = 1 + (typeof Multiplayer !== "undefined" ? Object.keys(Multiplayer.aliados).length : 0);
        if (SistemaProgresso.estado.jogadoresMortosNoBloco.length >= totalJogadores) {
            SistemaProgresso.reiniciarBlocoPorMorteTotal(GameConfig.faseAtual);
        }
    },

    atualizarBanner() {
        if (!this.bannerAviso) {
            this.bannerAviso = document.createElement("div");
            this.bannerAviso.style.cssText = `
                position: fixed; top: 85px; left: 50%; transform: translateX(-50%);
                background: rgba(220, 38, 38, 0.92); color: #fff; padding: 12px 24px;
                border-radius: 8px; font-weight: 800; font-family: sans-serif;
                z-index: 9000; display: none; text-align: center; border: 2px solid #fff;
            `;
            document.body.appendChild(this.bannerAviso);
        }

        if (this.caido) {
            this.bannerAviso.style.display = "block";
            this.bannerAviso.innerHTML = `
                🩸 VOCÊ ESTÁ DERRUBADO! AGUARDANDO RESGATE DA EQUIPE...<br>
                <span style="font-size:1.3rem; color:#fde047;">${Math.ceil(this.tempoRestante)}s RESTANTES</span>
            `;
        } else if (this.mortoDefinitivoNoBloco) {
            this.bannerAviso.style.display = "block";
            this.bannerAviso.style.background = "rgba(15, 23, 42, 0.92)";
            this.bannerAviso.innerHTML = `
                💀 VOCÊ MORREU NESTE BLOCO — Retornará automaticamente ao concluir o Bloco atual!
            `;
        } else {
            this.bannerAviso.style.display = "none";
        }
    }
};