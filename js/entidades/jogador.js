/* ==========================================================================
   js/entidades/jogador.js - Física Estilo Krunker, Habilidades e Resgate [E]
   ========================================================================== */

const Jogador = {
    personagemId: "mateus",
    dadosClasse: null,

    // Posição e Rotação
    posicao: new THREE.Vector3(0, 1.75, 0),
    velocidade: new THREE.Vector3(0, 0, 0),
    rotacaoYaw: 0,
    rotacaoPitch: 0,

    // Status Vitais
    vida: 100,
    vidaMax: 100,
    estamina: 100,
    estaminaMax: 100,
    noChao: true,
    agachado: false,
    lanternaLigada: false,

    // Habilidades e Passivas
    cooldownHabilidade: 0,
    tempoBuffAtivo: 0,
    killsAcumuladas: 0,
    tirosAcertados: 0,

    // Controles
    teclas: {},
    eventosRegistrados: false,

    inicializar(personagemId = "mateus") {
        this.personagemId = personagemId;
        this.dadosClasse = getPersonagem(personagemId);

        this.vidaMax = this.dadosClasse.vidaMax;
        this.vida = this.vidaMax;
        this.estaminaMax = this.dadosClasse.estaminaMax;
        this.estamina = this.estaminaMax;

        // Restaura posição salva no Hub (Fase 02) se estiver voltando de uma sub-fase
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

        if (typeof UI !== "undefined") {
            UI.atualizarVida(this.vida, this.vidaMax);
        }
    },

    registrarControles() {
        window.addEventListener("keydown", (e) => {
            this.teclas[e.code] = true;

            // [F] Lanterna
            if (e.code === "KeyF") {
                this.lanternaLigada = !this.lanternaLigada;
            }

            // [Q] Habilidade Especial
            if (e.code === "KeyQ") {
                this.usarHabilidadeEspecial();
            }

            // [E] Interagir (Alavancas, Botijões, Portais do Hub ou Levantar Aliado)
            if (e.code === "KeyE") {
                this.interagirNoAmbiente();
            }

            // [ESPAÇO] Pulo + Slide estilo Krunker
            if (e.code === "Space" && this.noChao && !this.estaIncapacitado()) {
                this.velocidade.y = this.dadosClasse.forcaPulo;
                this.noChao = false;

                if (this.teclas["ShiftLeft"] && this.estamina >= 15) {
                    this.estamina -= 15;
                    const dirFrente = new THREE.Vector3(0, 0, -1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotacaoYaw);
                    this.velocidade.x += dirFrente.x * 7.5;
                    this.velocidade.z += dirFrente.z * 7.5;
                }
            }
        });

        window.addEventListener("keyup", (e) => {
            this.teclas[e.code] = false;
        });

        window.addEventListener("mousemove", (e) => {
            if (document.pointerLockElement !== document.body) return;
            const sens = 0.0022 * GameConfig.sensibilidade;
            this.rotacaoYaw -= e.movementX * sens;
            this.rotacaoPitch -= e.movementY * sens;
            this.rotacaoPitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.rotacaoPitch));
        });
    },

    estaIncapacitado() {
        return (typeof SistemaReanimacao !== "undefined" && (SistemaReanimacao.caido || SistemaReanimacao.mortoDefinitivoNoBloco));
    },

    interagirNoAmbiente() {
        if (this.estaIncapacitado()) return;

        // 1. Verifica objetos de puzzle, alavancas, botijões e portais de fase
        if (typeof Puzzles !== "undefined") {
            Puzzles.tentarInteragir(this.posicao);
        }

        // 2. Verifica se existe aliado derrubado por perto no Multiplayer
        if (typeof Multiplayer !== "undefined" && Multiplayer.conectado