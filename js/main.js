/* ==========================================================================
   js/main.js - Motor 3D Principal (Three.js), Loading, Progresso e Loop
   ========================================================================== */

const MotorJogo = {
    cena: null,
    camera: null,
    renderizador: null,
    lanterna: null,
    relogio: new THREE.Clock(),
    emExecucao: false,
    pausado: false,

    // Controle do contador de FPS
    framesContados: 0,
    tempoFps: 0,

    inicializarThree() {
        const container = document.getElementById("game-container");
        if (!container) return;

        // 1. Cena 3D
        this.cena = new THREE.Scene();

        // 2. Câmera em Primeira Pessoa (estilo Krunker)
        this.camera = new THREE.PerspectiveCamera(
            GameConfig.fov,
            window.innerWidth / window.innerHeight,
            0.1,
            350
        );
        this.camera.rotation.order = "YXZ";
        this.cena.add(this.camera);

        // 3. Renderizador WebGL
        this.renderizador = new THREE.WebGLRenderer({ antialias: false });
        this.renderizador.setSize(window.innerWidth, window.innerHeight);
        this.atualizarResolucao();
        container.innerHTML = "";
        container.appendChild(this.renderizador.domElement);

        // 4. Iluminação Base (Ambiente + Sol/Lua Direcional)
        const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.55);
        this.cena.add(luzAmbiente);

        const luzDirecional = new THREE.DirectionalLight(0xfff5e4, 0.75);
        luzDirecional.position.set(40, 80, 30);
        this.cena.add(luzDirecional);

        // 5. Lanterna Tática acoplada à câmera (Tecla F)
        this.lanterna = new THREE.SpotLight(0xffffff, 1.8, 45, Math.PI / 5, 0.4, 1);
        this.lanterna.position.set(0, 0, 0);
        this.lanterna.target.position.set(0, 0, -10);
        this.lanterna.visible = false;
        this.camera.add(this.lanterna);
        this.camera.add(this.lanterna.target);

        // Inicializa o modelo 3D das armas na mão do jogador
        if (typeof ModelosArmas !== "undefined") {
            ModelosArmas.inicializar(this.camera);
        }

        this.registrarEventosGlobais();
    },

    registrarEventosGlobais() {
        window.addEventListener("resize", () => {
            if (!this.camera || !this.renderizador) return;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderizador.setSize(window.innerWidth, window.innerHeight);
        });

        document.getElementById("game-container").addEventListener("click", () => {
            if (this.emExecucao && document.pointerLockElement !== document.body) {
                document.body.requestPointerLock().catch(() => {});
            }
        });

        document.addEventListener("pointerlockchange", () => {
            if (!this.emExecucao) return;
            if (document.pointerLockElement !== document.body) {
                this.pausarParaMenu();
            } else {
                this.pausado = false;
                document.getElementById("tela-inicial").classList.add("oculto");
            }
        });
    },

    // Inicia ou carrega uma fase específica usando a Tela de Carregamento
    iniciarFase(dadosFase) {
        if (!this.renderizador) {
            this.inicializarThree();
        }

        const executarConstrucao = () => {
            // Limpa objetos 3D da cena anterior mantendo apenas a câmera e as luzes
            for (let i = this.cena.children.length - 1; i >= 0; i--) {
                const obj = this.cena.children[i];
                if (obj !== this.camera && !(obj instanceof THREE.Light)) {
                    this.cena.remove(obj);
                }
            }

            // Reseta meshes de aliados remotos para recriá-los na nova cena
            if (typeof Multiplayer !== "undefined") {
                Multiplayer.aliados = {};
            }

            // Atualiza estado de vida / derrubado no Bloco
            if (typeof SistemaReanimacao !== "undefined") {
                SistemaReanimacao.resetarParaNovaFase();
            }

            // Inicializa Jogador e Armas conforme o personagem selecionado
            const persId = GameConfig.personagemSelecionado || "mateus";
            if (typeof Jogador !== "undefined") Jogador.inicializar(persId);
            if (typeof SistemaArmas !== "undefined") SistemaArmas.inicializarPorPersonagem(persId);

            // Constrói o mapa 3D da fase atual
            if (typeof ConstrutorMapa !== "undefined") {
                ConstrutorMapa.carregarFase(this.cena, dadosFase);
            }

            document.getElementById("hud-fase-nome").textContent =
                `Fase ${String(dadosFase.numero).padStart(2, "0")}: ${dadosFase.nome}`;

            document.body.requestPointerLock().catch(() => {});
            this.pausado = false;

            if (!this.emExecucao) {
                this.emExecucao = true;
                this.relogio.start();
                this.loop();
            }
        };

        if (typeof TelaLoading !== "undefined") {
            TelaLoading.exibirTransicao(dadosFase, executarConstrucao);
        } else {
            executarConstrucao();
        }
    },

    // Avança para a próxima fase (ou retorna ao Hub da Fase 02 no Bloco 1)
    concluirFaseAtual(destinoPersonalizado = null) {
        const atual = GameConfig.faseAtual;

        if (typeof SistemaProgresso !== "undefined") {
            SistemaProgresso.concluirFase(atual);
        }

        const proxima = destinoPersonalizado || (atual + 1);

        if (proxima > 88) {
            alert("PARABÉNS! Você sobreviveu às 88 fases e chegou ao SENAI Luiz Pagliato!");
            GameConfig.faseAtual = 1;
            salvarConfiguracoes();
            this.pausarParaMenu();
            return;
        }

        GameConfig.faseAtual = proxima;
        if (proxima > GameConfig.fasesDesbloqueadas) {
            GameConfig.fasesDesbloqueadas = proxima;
        }
        salvarConfiguracoes();

        if (typeof UI !== "undefined") {
            UI.atualizarCardFaseAtual();
            UI.gerarGrade88Fases();
        }

        this.iniciarFase(getFase(proxima));
    },

    pausarParaMenu() {
        this.pausado = true;
        document.getElementById("tela-inicial").classList.remove("oculto");
    },

    atualizarResolucao() {
        if (!this.renderizador) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.renderizador.setPixelRatio(dpr * GameConfig.escalaResolucao);
    },

    atualizarFov() {
        if (!this.camera) return;
        this.camera.fov = GameConfig.fov;
        this.camera.updateProjectionMatrix();
    },

    // Loop principal de renderização e física (60+ FPS)
    loop() {
        requestAnimationFrame(() => this.loop());

        const delta = Math.min(this.relogio.getDelta(), 0.1);

        this.framesContados++;
        this.tempoFps += delta;
        if (this.tempoFps >= 0.5) {
            const fps = Math.round(this.framesContados / this.tempoFps);
            const elFps = document.getElementById("fps-counter");
            if (elFps) elFps.textContent = `FPS: ${fps}`;
            this.framesContados = 0;
            this.tempoFps = 0;
        }

        if (!this.pausado && this.emExecucao) {
            if (typeof SistemaReanimacao !== "undefined") {
                SistemaReanimacao.atualizar(delta);
            }

            if (typeof Jogador !== "undefined") {
                Jogador.atualizar(delta);
                this.camera.position.copy(Jogador.posicao);
                this.camera.rotation.y = Jogador.rotacaoYaw;
                this.camera.rotation.x = Jogador.rotacaoPitch;
                if (this.lanterna) this.lanterna.visible = Jogador.lanternaLigada;
            }
            if (typeof Multiplayer !== "undefined") Multiplayer.atualizar(delta);

            if (typeof SistemaArmas !== "undefined") SistemaArmas.atualizar(delta);
            if (typeof Itens !== "undefined") Itens.atualizar(delta);
            if (typeof Zumbis !== "undefined") Zumbis.atualizar(delta);

            if (typeof PecaVeiculos !== "undefined") PecaVeiculos.atualizar(delta);
            if (typeof PecaPerigos !== "undefined") PecaPerigos.atualizar(delta);
            if (typeof Puzzles !== "undefined") Puzzles.atualizar();
        }

        if (this.renderizador && this.cena && this.camera) {
            this.renderizador.render(this.cena, this.camera);
        }
    }
};