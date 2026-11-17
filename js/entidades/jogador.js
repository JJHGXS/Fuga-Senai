/* ==========================================================================
   js/entidades/jogador.js - Movimentação FPS, Habilidades e Interação [E]
   ========================================================================== */

const Jogador = {
    personagemId: "mateus",
    dadosClasse: null,
    posicao: new THREE.Vector3(0, 1.75, 0),
    velocidade: new THREE.Vector3(0, 0, 0),
    rotacaoYaw: 0,
    rotacaoPitch: 0,
    vida: 100,
    vidaMax: 100,
    estamina: 100,
    estaminaMax: 100,
    noChao: true,
    lanternaLigada: false,
    cooldownHabilidade: 0,
    tempoBuffAtivo: 0,
    killsAcumuladas: 0,
    tirosAcertados: 0,
    teclas: {},
    eventosRegistrados: false,

    inicializar(personagemId = "mateus") {
        this.personagemId = personagemId;
        this.dadosClasse = (typeof getPersonagem === "function")
            ? getPersonagem(personagemId)
            : { vidaMax: 100, estaminaMax: 100, velocidadeBase: 8, multiplicadorCorrida: 1.45, forcaPulo: 9, habilidade: { cooldownSegundos: 15, duracaoSegundos: 8 } };

        this.vidaMax = this.dadosClasse.vidaMax;
        this.vida = this.vidaMax;
        this.estaminaMax = this.dadosClasse.estaminaMax;
        this.estamina = this.estaminaMax;

        if (GameConfig.faseAtual === 2 && typeof SistemaProgresso !== "undefined" && SistemaProgresso.estado.posicaoHubSalva) {
            const p = SistemaProgresso.estado.posicaoHubSalva;
            this.posicao.set(p.x, 1.75, p.z);
        } else {
            this.posicao.set(0, 1.75, 0);
        }

        this.velocidade.set(0, 0, 0);
        this.rotacaoYaw = 0;
        this.rotacaoPitch = 0;
        this.cooldownHabilidade = 0;
        this.tempoBuffAtivo = 0;
        this.killsAcumuladas = 0;
        this.tirosAcertados = 0;

        if (!this.eventosRegistrados) {
            this.registrarControles();
            this.eventosRegistrados = true;
        }

        if (typeof UI !== "undefined") UI.atualizarVida(this.vida, this.vidaMax);
    },

    registrarControles() {
        window.addEventListener("keydown", (e) => {
            this.teclas[e.code] = true;
            if (e.code === "KeyF") this.lanternaLigada = !this.lanternaLigada;
            if (e.code === "KeyQ") this.usarHabilidadeEspecial();
            if (e.code === "KeyE") this.interagirNoAmbiente();

            if (e.code === "Space" && this.noChao && !this.estaIncapacitado()) {
                this.velocidade.y = this.dadosClasse.forcaPulo;
                this.noChao = false;
                if (this.teclas["ShiftLeft"] && this.estamina >= 15) {
                    this.estamina -= 15;
                    const dir = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotacaoYaw);
                    this.velocidade.x += dir.x * 7.5;
                    this.velocidade.z += dir.z * 7.5;
                }
            }
        });

        window.addEventListener("keyup", (e) => { this.teclas[e.code] = false; });

        window.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement !== document.body) return;
            const sens = 0.0022 * (GameConfig.sensibilidade || 1.0);
            this.rotacaoYaw -= e.movementX * sens;
            this.rotacaoPitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.rotacaoPitch - e.movementY * sens));
        });
    },

    estaIncapacitado() {
        return (typeof SistemaReanimacao !== "undefined" && (SistemaReanimacao.caido || SistemaReanimacao.mortoDefinitivoNoBloco));
    },

    interagirNoAmbiente() {
        if (this.estaIncapacitado()) return;
        if (typeof Puzzles !== "undefined") Puzzles.tentarInteragir(this.posicao);

        if (typeof Multiplayer !== "undefined" && Multiplayer.conectado && Multiplayer.canalSala) {
            Object.entries(Multiplayer.aliados).forEach(([idAliado, aliado]) => {
                if (aliado.caido && aliado.mesh && this.posicao.distanceTo(aliado.mesh.position) <= 3.0) {
                    Multiplayer.canalSala.send({
                        type: "broadcast",
                        event: "reviver_aliado",
                        payload: { alvoId: idAliado, origem: Multiplayer.meuId }
                    });
                }
            });
        }
    },

    usarHabilidadeEspecial() {
        if (this.estaIncapacitado() || this.cooldownHabilidade > 0) return;
        const hab = this.dadosClasse.habilidade;
        this.cooldownHabilidade = hab.cooldownSegundos;

        if (this.personagemId === "mateus") {
            this.tempoBuffAtivo = hab.duracaoSegundos;
            this.cooldownHabilidade = 0;
        } else if (this.personagemId === "luan" && typeof Itens !== "undefined") {
            Itens.implantarTorreta(this.posicao, this.rotacaoYaw);
        } else if (this.personagemId === "rodrigo") {
            this.curar(this.vidaMax * 0.50, "medico");
        } else {
            this.tempoBuffAtivo = hab.duracaoSegundos;
        }
    },

    getMultiplicadorDanoAtual() {
        let mult = 1.0;
        if (this.tempoBuffAtivo > 0) {
            if (this.personagemId === "mateus") mult *= 1.35;
            if (this.personagemId === "kaua") mult *= 2.00;
            if (this.personagemId === "joao_cba") mult *= 1.45;
            if (this.personagemId === "nicolas") mult *= 1.25;
        }
        if (this.personagemId === "kaua") {
            this.tirosAcertados++;
            if (this.tirosAcertados % 3 === 0) mult *= 2.20;
        }
        if (this.personagemId === "joao_cba") {
            mult *= (1 + (1 - this.vida / this.vidaMax) * 0.60);
        }
        return mult;
    },

    registrarAcertoInimigo(danoCausado, matou = false) {
        if (this.personagemId === "joao_cba") this.curar(Math.max(2, danoCausado * 0.08), "passiva");
        if (matou) {
            this.killsAcumuladas++;
            if (this.personagemId === "rodrigo" && this.killsAcumuladas % 5 === 0) {
                this.curar(this.vidaMax * 0.50, "medico");
            }
        }
    },

    curar(quantidade, origem = "kit") {
        if (this.estaIncapacitado()) return;
        if (this.personagemId === "joao_cba" && origem === "medico") return;
        this.vida = Math.min(this.vidaMax, Math.round(this.vida + quantidade));
        if (typeof UI !== "undefined") UI.atualizarVida(this.vida, this.vidaMax);
    },

    receberDano(dano) {
        if (this.estaIncapacitado()) return;
        const danoFinal = this.personagemId === "nicolas" ? dano * 0.80 : dano;
        this.vida = Math.max(0, Math.round(this.vida - danoFinal));
        if (typeof UI !== "undefined") UI.atualizarVida(this.vida, this.vidaMax);

        if (this.vida <= 0) {
            if (typeof SistemaReanimacao !== "undefined") SistemaReanimacao.derrubarJogador();
            else this.vida = this.vidaMax;
        }
    },

    atualizar(delta) {
        if (this.cooldownHabilidade > 0) this.cooldownHabilidade = Math.max(0, this.cooldownHabilidade - delta);
        if (this.tempoBuffAtivo > 0) this.tempoBuffAtivo = Math.max(0, this.tempoBuffAtivo - delta);
        if (this.estaIncapacitado()) return;

        const correndo = this.teclas["ShiftLeft"] && this.estamina > 0;
        let velAlvo = this.dadosClasse.velocidadeBase * (correndo ? this.dadosClasse.multiplicadorCorrida : 1.0);
        if (this.personagemId === "joao_cba" && this.tempoBuffAtivo > 0) velAlvo *= 1.35;

        if (correndo && (this.teclas["KeyW"] || this.teclas["KeyA"] || this.teclas["KeyS"] || this.teclas["KeyD"])) {
            this.estamina = Math.max(0, this.estamina - 18 * delta);
        } else {
            this.estamina = Math.min(this.estaminaMax, this.estamina + 14 * delta);
        }

        const dirFrente = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotacaoYaw);
        const dirDireita = new THREE.Vector3(1, 0, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotacaoYaw);

        const move = new THREE.Vector3(0, 0, 0);
        if (this.teclas["KeyW"]) move.add(dirFrente);
        if (this.teclas["KeyS"]) move.sub(dirFrente);
        if (this.teclas["KeyD"]) move.add(dirDireita);
        if (this.teclas["KeyA"]) move.sub(dirDireita);
        if (move.lengthSq() > 0) move.normalize();

        const controle = this.noChao ? 14.0 : 4.5;
        this.velocidade.x += (move.x * velAlvo - this.velocidade.x) * Math.min(1, controle * delta);
        this.velocidade.z += (move.z * velAlvo - this.velocidade.z) * Math.min(1, controle * delta);
        this.velocidade.y -= 26.0 * delta;

        this.posicao.x += this.velocidade.x * delta;
        this.posicao.y += this.velocidade.y * delta;
        this.posicao.z += this.velocidade.z * delta;

        const alturaOlhos = this.teclas["KeyC"] ? 1.05 : 1.75;
        if (this.posicao.y <= alturaOlhos) {
            this.posicao.y = alturaOlhos;
            this.velocidade.y = 0;
            this.noChao = true;
        }
    }
};